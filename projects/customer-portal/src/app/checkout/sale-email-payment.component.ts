import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../common/src/lib/utils/errorhandler/error.service';
import {AlertService} from '../../../../common/src/lib/utils/alert.service';
import {SaleEmailPaymentService} from '../../services/sale-email-payment.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
  PaymentMethodTypeEnum,
  PaymentMethodTypeEnumValue
} from '../../../../common/src/lib/enums/sale/payment-method-type.enum';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../../../common/src/lib/modals/confirm/confirm-modal.component';
import {catchError, finalize, map, mergeMap, switchMap} from 'rxjs/operators';
import {FormPageStateService} from '../../../../common/src/lib/utils/form-page-state.service';
import {SafeHtml} from "@angular/platform-browser";
import {PaymentStatusEnum, PaymentStatusEnumValue} from "../../../../common/src/lib/enums/sale/payment-status.enum";
import {SalePaymentViewService} from "../../services/sale-payment-view.service";
import {
  FieldValidationErrorService
} from "../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {PaymentErrorService} from "../../../../common/src/lib/utils/errorhandler/payment-error.service";
import {SaleEmailPaymentViewModel} from "../../models/sale-email-payment-view.model";
import {PaymentHistoryComponent} from "../../../../common/src/lib/sale/view/payment-history.component";
import {AddressConverterModel} from "../../../../common/src/lib/models/common/address-model-converter";
import {HtmlContentModalComponent} from "../../../../common/src/lib/modals/htmlcontent/html-content-modal.component";
import {TermService} from "../../../../common/src/lib/services/eula/term.service";
import {DocTypeEnumValue, SalePrintService} from "@eps/common";
import {SaleEmailPaymentLabels} from "./sale-email-payment-labels";
import {CreditCardModel} from "../../../../common/src/lib/models/sale/credit-card.model";
import {PaymentMethodsViewModel} from "../../../../common/src/lib/payment/paymentmethod/payment-methods.component";
import {ACHModel} from "../../../../common/src/lib/models/sale/ach.model";
import {EMPTY, Observable, of, throwError} from "rxjs";
import {CustomerService} from "../../services/customer.service";
import {RecaptchaService} from "../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import * as hermes from "../../../../common/src/assets/hermes/hermes.min.js";
import {HermesEnum} from "../../../../common/src/lib/enums/utils/hermes.enum";
import {PaymentMethodsViewService} from "../../../../common/src/lib/payment/paymentmethod/payment-methods-view.service";
import cloneDeep from 'lodash/cloneDeep';
import {AutoScrollingFormPageComponent} from "../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {CustomValidator} from "../../../../common/src/lib/helpers/custom.validator";
import {isDefined, ObjectHelper} from "../../../../common/src/lib/helpers/object.helper";
import {CustomerCurrentDataService} from "../../services/customer-current-data.service";
import {
  CustomerPreFilledSignInModalComponent,
  CustomerPreFilledSignInModel,
  PayerSignInModalMode
} from "../modal/signin/prefilled/customer-pre-filled-sign-in-modal.component";
import {
  CurrentCustomerSuitableForSaleResponseModel
} from "../../models/current-customer-suitable-for-sale-response.model";
import {
  SaleEmailCustomerIsNotSuitableModalComponent
} from "../modal/checkout/sale-email-customer-is-not-suitable-modal.component";
import {CustomerPermissionService} from "../../services/customer-permission.service";
import {
  UseExistingPaymentMethodModalComponent
} from "../modal/payment-method/use-existing-payment-method-modal.component";
import {Mask} from "../../../../common/src/lib/helpers/mask";
import {CustomerRoutingService} from "../../services/customer-routing.service";
import {SETTINGS_PROVIDER_TOKEN} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {CustomerSettingsProvider} from "../../services/customer-settings-provider.service";
import {CustomerTitleHelperService} from "../../services/customer-title-helper.service";
import {isEmptyString} from "../../../../common/src/lib/helpers/string.helper";
import {HtmlSanitizerService} from "../../../../common/src/lib/utils/html-sanitizer.service";

@Component({
  standalone: false,
  selector: 'app-sale-email-payment',
  templateUrl: './sale-email-payment.component.html',
  styleUrls: ['../../../../common/src/lib/sale/template/interpret/full/sale-email-payment-full-template-interpret.component.scss', 'sale-email-payment.component.scss'],
  providers: [FormPageStateService, SalePaymentViewService, PaymentMethodsViewService, SalePrintService]
})
export class SaleEmailPaymentComponent extends AutoScrollingFormPageComponent implements OnInit {
  token: string;
  saleEmailViewModel: SaleEmailPaymentViewModel;

  processPayment = false;
  saleLoading = false;
  termsOfServiceLoading = false;
  privacyStatementLoading = false;
  paymentMethodsLoading = false;

  paymentResult: {
    paymentAmount: number;
    surchargeAmount: number;
    totalIncludingSurcharge: number;
    authorizationId: string;
    approvalId: string;
  };


  readonly PaymentMethodTypeEnumValue = PaymentMethodTypeEnumValue;
  readonly PaymentMethodTypeEnum = PaymentMethodTypeEnum;
  readonly SaleStatusEnum = PaymentStatusEnum;
  readonly SaleStatusEnumValue = PaymentStatusEnumValue;
  readonly DocTypeEnumValue = DocTypeEnumValue;
  readonly AddressConverterModel = AddressConverterModel;
  readonly Labels = SaleEmailPaymentLabels;
  _paymentAmount = new FormControl<number>(null);
  _surchargeAmount = new FormControl<number>({value: null, disabled: true});
  _totalIncludingSurcharge = new FormControl<number>({value: null, disabled: true});
  _paymentMethods = new FormControl<PaymentMethodsViewModel>(new PaymentMethodsViewModel(null, null));
  @ViewChild('printSale', {read: ElementRef, static: false}) printSale: ElementRef;
  private form = this._fb.group<SaleEmailPaymentFormGroupModel>({
    paymentAmount: this._paymentAmount,
    surchargeAmount: this._surchargeAmount,
    totalIncludingSurcharge: this._totalIncludingSurcharge,
    paymentMethods: this._paymentMethods
  });
  @ViewChild(PaymentHistoryComponent) private saleEmailPaymentHistoryComponent: PaymentHistoryComponent;
  private customerIsNotSuitableModalComponent: NgbModalRef;

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              public errorService: ErrorService,
              private alertService: AlertService,
              private fieldValidationService: FieldValidationErrorService,
              private paymentErrorService: PaymentErrorService,
              private _fb: FormBuilder,
              private saleEmailPaymentService: SaleEmailPaymentService,
              private customerService: CustomerService,
              private termService: TermService,
              private modalService: NgbModal,
              protected viewService: SalePaymentViewService,
              private printService: SalePrintService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: CustomerSettingsProvider,
              private currentDataService: CustomerCurrentDataService,
              private recaptchaService: RecaptchaService,
              private paymentMethodsViewService: PaymentMethodsViewService,
              private customerPermissionService: CustomerPermissionService,
              private htmlSanitizer: HtmlSanitizerService,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: CustomerRoutingService,
              private ngZone: NgZone,
              private titleService: CustomerTitleHelperService) {
    super(formPageStateService, elementRef, errorService);
  }

  get paymentMethodType(): PaymentMethodTypeEnum {
    return this._paymentMethods.value.paymentMethodType;
  }

  get canSignIn(): boolean {
    return this.saleEmailViewModel.customerLogins?.length > 0;
  }

  get showGoToPortal(): boolean {
    return this.customerService.isLoggedIn() && this.saleEmailViewModel.customerPortalEnabled && isDefined(this.paymentResult);
  }

  protected get submitButtonName(): string {
    return this.isSignInRequired ?
      `${this.Labels.SignIn} & ${this.viewService.defaultSubmitButtonName}` : this.viewService.defaultSubmitButtonName;
  }

  protected get showSignIn(): boolean {
    return !this.customerService.isLoggedIn();
  }

  protected get currentPayerEmail(): string {
    return this.currentDataService.currentCustomer?.email;
  }

  _sanitizedAuthorizationMessage: SafeHtml;

  private get sanitizedAuthorizationMessage(): SafeHtml {
    return this.htmlSanitizer.sanitizeToSafeHtml(this.authorizationMessage);
  }

  private get authorizationMessage(): string {
    return this.viewService.getAuthorizationMessage(this._paymentAmount.value, this._surchargeAmount.value, this._totalIncludingSurcharge.value, this.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod);
  }

  private get isSignInRequired(): boolean {
    return !this.customerService.isLoggedIn() && this._paymentMethods.value.selectedPaymentMethod.savePaymentMethod;
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['paymentAmount', this._paymentAmount],
      ['surchargeAmount', this._surchargeAmount],
      ['paymentMethod', this._paymentMethods],
      ['creditCardData', this._paymentMethods],
      ['achData', this._paymentMethods],
      ['savePaymentMethod', this._paymentMethods]
    ]);
  }

  ngOnInit(): void {
    this.token = this.router.snapshot.paramMap.get('token');
    this.saleLoading = true;
    this.loadSiteSeal();

    this.subscriptions.add(
      this.getSaleEmailObservable()
        .pipe(mergeMap(() => this.customerService.isLoggedIn() ? this.processCustomerIsLoggedInObservable() : of(void 0)))
        .pipe(finalize(() => {
          this.saleLoading = false;
          this.ch.detectChanges();
        })).subscribe());

    this._paymentAmount.setValidators([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.PaymentAmount)(c),
      this.processPayment)(c)
      , c => CustomValidator.addIf(c => CustomValidator.maxAmount(this.Labels.PaymentAmount, this.viewService.getPaymentAmountMaxValue(this.paymentMethodType), this.viewService.currency)(c),
        this.processPayment)(c), c => CustomValidator.addIf(c => CustomValidator.minAmountStrict(this.Labels.PaymentAmount, 0, this.viewService.currency)(c),
        this.processPayment)(c)]);


    this._paymentMethods.valueChanges.subscribe(() => {
      this._paymentAmount.updateValueAndValidity();
    });

    this._paymentAmount.valueChanges.subscribe(() => {
      this.updateSurcharge();
    });

    this.getForm().valueChanges.subscribe(() => this.onFormValueChanges());


    hermes.on(HermesEnum.CUSTOMER_LOGOUT, () => {
      this.viewService.canManagePaymentMethods = this.saleEmailViewModel.customerRegistrationOnCheckoutPageEnabled;
      this.clearPaymentMethods();
    });

    hermes.on(HermesEnum.CUSTOMER_CHANGE_COMPANY, () => {
      this.ngZone.run(() => this.subscriptions.add(this.processCustomerIsLoggedInObservable()
        .subscribe()));
    });
  }

  onTermsOfService() {
    this.termsOfServiceLoading = true;
    this.termService.getTermsOfService().pipe(finalize(() => {
      this.termsOfServiceLoading = false;
      this.ch.detectChanges();
    })).subscribe(base64String => {
      this.openTermsOfService(base64String);
    })
  }

  onPrivacyStatement() {
    this.privacyStatementLoading = true;
    this.termService.getPrivacyStatement().pipe(finalize(() => {
      this.privacyStatementLoading = false;
      this.ch.detectChanges();
    })).subscribe(base64String => {
      this.openPrivacyStatement(base64String);
    })
  }

  loadSiteSeal() {
    const node = document.createElement('script');
    node.src = this.settingsProvider.siteSealUrl;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementById('siteseal').appendChild(node);
  }

  print() {
    this.printService.print(this.printSale);
    return false;
  }

  goToPortal(): boolean {
    this.routingService.navigateFirstUrl();
    return false;
  }

  pay() {
    this.subscriptions.add(
      (this.customerService.isLoggedIn() ? this.getPaymentMethodsObservable() : of(void 0))
        .pipe(finalize(() => {
          this.processPayment = true;
          this.onReInit();
          this.ch.detectChanges();

          document.getElementById('paymentAmount').scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        })).subscribe()
    );
  }

  cancelPayment() {
    this.processPayment = false;
    this.ch.detectChanges();
  }

  getForm(): FormGroup {
    return this.form;
  }

  openTermsOfService(base64String: string): void {
    const modalRef = this.modalService.open(HtmlContentModalComponent, {
      backdrop: 'static',
      size: "xl",
      scrollable: true
    });
    modalRef.componentInstance.header = 'Terms of Service';
    modalRef.componentInstance.innerHtml = this.htmlSanitizer.sanitizeToSafeHtml(atob(base64String));
    modalRef.result.then(() => {
    }, reason => {
    });
  }

  openPrivacyStatement(base64String: string): void {
    const modalRef = this.modalService.open(HtmlContentModalComponent, {
      backdrop: 'static',
      size: "xl",
      scrollable: true
    });
    modalRef.componentInstance.header = 'Privacy Statement';
    modalRef.componentInstance.innerHtml = this.htmlSanitizer.sanitizeToSafeHtml(atob(base64String));
    modalRef.result.then(() => {
    }, reason => {
    });
  }

  openReloadDialog(header: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.body = 'Do you want to reload Sale data?';
    modalRef.result.then(() => this.reloadSaleEmail(), reason => {
      this.ch.detectChanges();
    });
  }

  protected onReInit() {
    this.paymentResult = null;

    const paymentMethodType = this.viewService.defaultPaymentMethod ? this.viewService.defaultPaymentMethod instanceof ACHModel ? PaymentMethodTypeEnum.ACH :
      this.viewService.defaultPaymentMethod instanceof CreditCardModel ? PaymentMethodTypeEnum.CREDIT_CARD : null : null;
    this.form.patchValue({
      paymentAmount: this.viewService.amountDue,
      paymentMethods: new PaymentMethodsViewModel(paymentMethodType, this.viewService.defaultPaymentMethod)
    });

    if (this.viewService.partialPaymentsAllowed) {
      this._paymentAmount.enable();
    } else {
      this._paymentAmount.disable();
    }

    if (this._paymentAmount.value > this.viewService.getPaymentAmountMaxValue(this.paymentMethodType)) {
      this._paymentAmount.markAsDirty();
      this._paymentAmount.updateValueAndValidity();
    }

  }

  protected onSubmit(value) {
    const savePaymentMethod = this._paymentMethods.value.selectedPaymentMethod.savePaymentMethod;

    let submitPayment;
    if (savePaymentMethod) {
      submitPayment = (recaptchaToken?: string) => this.savePaymentMethodAndSubmitPayment(this._paymentMethods.value.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod, this.authorizationMessage, recaptchaToken);
    } else {
      submitPayment = (recaptchaToken?: string) => this.submitPayment(this.authorizationMessage, recaptchaToken);
    }

    const recaptchaAndSubmit = () => {
      if (this.settingsProvider.isRecaptchaEnabled()) {
        this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.EMAIL_PAYMENT, submitPayment);
      } else {
        submitPayment();
      }
    };

    if (this.isSignInRequired) {
      const onSighIn = () => {
        this.viewService.canManagePaymentMethods = this.customerPermissionService.canManagePaymentMethods;
        recaptchaAndSubmit();
        // this.getPaymentMethodsObservable().pipe(map(() => recaptchaAndSubmit())).subscribe();
      }
      this.showSignInModal(onSighIn, () => this.afterSubmit());
    } else {
      recaptchaAndSubmit();
    }
  }

  protected onSignIn(): void {
    const onResult = () => {
      this.viewService.canManagePaymentMethods = this.customerPermissionService.canManagePaymentMethods;
      this.getPaymentMethodsObservableAndSelectDefault().subscribe()
    }
    this.showSignInModal(onResult);
  }

  protected onSignOut(): void {
    this.customerService.logout();
    this.viewService.canManagePaymentMethods = this.saleEmailViewModel.customerRegistrationOnCheckoutPageEnabled;
    this.clearPaymentMethods();
  }

  protected onDeletePaymentMethod(value: {
    paymentMethodType: PaymentMethodTypeEnum,
    paymentMethod: CreditCardModel | ACHModel
  }) {
    this.subscriptions.add(
      this.customerService.deletePaymentMethod(value.paymentMethodType, value.paymentMethod)
        .pipe(map(() => this.alertService.showSuccess('', 'Payment method deleted')))
        .pipe(mergeMap(() => this.getPaymentMethodsObservableAndSelectDefault()))
        .subscribe()
    )
  }

  private clearPaymentMethods(): void {
    this.viewService.paymentMethods = [];
    this._paymentMethods.reset(new PaymentMethodsViewModel(null, null));
    this.ch.detectChanges();
  }

  private getSaleEmail() {
    this.saleLoading = true;
    this.subscriptions.add(
      this.getSaleEmailObservable().pipe(finalize(() => {
        this.saleLoading = false;
        this.ch.detectChanges();
      })).subscribe()
    );
  }

  private reloadSaleEmail() {
    this.saleLoading = true;
    this.subscriptions.add(
      this.getSaleEmailObservable().pipe(mergeMap(() => this.getPaymentMethodsObservableAndSelectDefault()))
        .pipe(finalize(() => {
          this.saleLoading = false;
          this.ch.detectChanges();
        })).subscribe()
    );
  }

  private processCustomerIsLoggedInObservable(): Observable<void> {
    return this.viewService.canBePaid ? this.saleEmailPaymentService.isCurrentCustomerSuitableForSale(this.token)
      .pipe(mergeMap(result => {
        if (result.currentCustomerSuitable) {
          this.viewService.canManagePaymentMethods = this.customerPermissionService.canManagePaymentMethods;
          if (this.processPayment == true) {
            return this.getPaymentMethodsObservable();
          }
        } else {
          this.processPayment = false;
          this.showCustomerIsNotSuitableModal(result);

          this.ch.detectChanges();
        }
        return of(void 0);
      })) : of(void 0);
  }

  private getSaleEmailObservable(): Observable<void> {
    return this.saleEmailPaymentService.getSale(this.token).pipe(map(result => {
      this.saleEmailViewModel = result;
      this.updateTitle(this.saleEmailViewModel);
      this.viewService.initSale(this.saleEmailViewModel, this.paymentMethodsViewService, this.saleEmailViewModel.emailPaymentsEnabled, this.saleEmailViewModel.customerRegistrationOnCheckoutPageEnabled);
      this._paymentAmount.setValue(this.viewService.partialPaymentsAllowed ? null : this.viewService.amountDue);
      if (this.viewService.partialPaymentsAllowed) {
        this._paymentAmount.enable();
      } else {
        this._paymentAmount.disable();
      }
    })).pipe(catchError((error: HttpErrorResponse) => this.redirectToPortalOnNotFound(error)))
  }

  private getPaymentMethodsObservable(): Observable<void> {
    return of(this.paymentMethodsLoading = true).pipe(switchMap(() =>
      this.customerService.getAllowedPaymentMethods().pipe(map(result => {
        let paymentMethods = cloneDeep(result.paymentMethods);
        paymentMethods = paymentMethods.sort((a, b) => {
          return b.customerDefault ? 1 : -1;
        });
        this.viewService.paymentMethods = paymentMethods;
      })).pipe(finalize(() => {
        this.paymentMethodsLoading = false;
        this.ch.detectChanges();
      }))));
  }

  private getPaymentMethodsObservableAndSelectDefault() {
    return this.getPaymentMethodsObservable().pipe(map(() => this.selectDefault()))
  }

  private selectDefault() {
    if (this.viewService.defaultPaymentMethod) {
      const paymentMethodType = this.viewService.defaultPaymentMethod instanceof CreditCardModel ? PaymentMethodTypeEnum.CREDIT_CARD :
        this.viewService.defaultPaymentMethod instanceof ACHModel ? PaymentMethodTypeEnum.ACH : null;
      this._paymentMethods.reset({
        paymentMethodType: paymentMethodType,
        selectedPaymentMethod: Object.assign({savePaymentMethod: false}, this.viewService.defaultPaymentMethod)
      });
    } else {
      this._paymentMethods.reset({
        paymentMethodType: null,
        selectedPaymentMethod: null
      });
    }
  }

  private onFormValueChanges() {

    this._sanitizedAuthorizationMessage = this.sanitizedAuthorizationMessage;
    this.ch.detectChanges();

    document.getElementById(this.viewService.termsOfServiceLinkId)?.addEventListener("click", () => this.onTermsOfService());
    document.getElementById(this.viewService.privacyStatementLinkId)?.addEventListener("click", () => this.onPrivacyStatement());
  }

  private submitPayment(authorizationMessage: string, recaptchaToken?: string): void {
    this.subscriptions.add(
      this.getSubmitPaymentObservable(authorizationMessage, recaptchaToken).pipe(finalize(() => {
        this.ch.detectChanges();
      })).subscribe()
    );
  }

  private savePaymentMethodAndSubmitPayment(paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, recaptchaToken?: string) {
    const savePaymentMethodAndSubmitPayment = () => {
      this.subscriptions.add(
        this.getSavePaymentMethodObservable(paymentMethodType, paymentMethod)
          .pipe(mergeMap(newPaymentMethod => this.getPaymentMethodsObservable().pipe(map(() => {
            let savedPaymentMethod = this.viewService.paymentMethods.find(pm => pm.id == newPaymentMethod.id);
            if (isDefined(savedPaymentMethod)) {
              if (paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
                savedPaymentMethod = (savedPaymentMethod as CreditCardModel);
                savedPaymentMethod.cvv = (paymentMethod as CreditCardModel).cvv;
              } else if (paymentMethodType == PaymentMethodTypeEnum.ACH) {
                savedPaymentMethod = (savedPaymentMethod as ACHModel);
              }
            }
            this.form.controls.paymentMethods.reset({
              selectedPaymentMethod: Object.assign({savePaymentMethod: false}, savedPaymentMethod),
              paymentMethodType: paymentMethodType
            });
          }))))
          .pipe(mergeMap(() => this.getSubmitPaymentObservable(authorizationMessage, recaptchaToken)))
          .pipe(catchError(error => {
            this.fieldValidationService.error(error, this);
            throw error;
          }))
          .pipe(finalize(() => {
            this.afterSubmit();
            this.ch.detectChanges();
          }))
          .subscribe());
    }


    let pmCandidate: CreditCardModel | ACHModel;
    if (!isDefined(paymentMethod.id)) {
      if (paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
        const last4 = Mask.unmaskCreditCardNumber((paymentMethod as CreditCardModel).number).slice(-4);
        const date = (paymentMethod as CreditCardModel).date;
        pmCandidate = this.paymentMethodsViewService.paymentMethods.find(pm => pm instanceof CreditCardModel && pm.number.slice(-4) == last4 && (pm as CreditCardModel).date == date);
      } else if (paymentMethodType == PaymentMethodTypeEnum.ACH) {
        const accountNumber = (paymentMethod as ACHModel).accountNumber.slice(-4);
        const routingNumber = (paymentMethod as ACHModel).routingNumber;
        pmCandidate = this.paymentMethodsViewService.paymentMethods.find(pm => pm instanceof ACHModel && pm.accountNumber.slice(-4) == accountNumber && pm.routingNumber == routingNumber);
      }
      if (isDefined(pmCandidate)) {
        const onUseExisting = () => {
          this.form.controls.paymentMethods.reset({
            selectedPaymentMethod: Object.assign({savePaymentMethod: false}, pmCandidate),
            paymentMethodType: paymentMethodType
          });
          this.afterSubmit();
        }
        const onCreateNew = () => savePaymentMethodAndSubmitPayment();
        const onCancel = () => this.afterSubmit();

        this.openConfirmAddSimilarPaymentMethod(paymentMethodType, pmCandidate, onUseExisting, onCreateNew, onCancel);
        return;
      }
    }
    return savePaymentMethodAndSubmitPayment();
  }

  private getSavePaymentMethodObservable(paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel): Observable<CreditCardModel | ACHModel> {
    return this.customerService.savePaymentMethod(paymentMethodType, paymentMethod);
  }

  openConfirmAddSimilarPaymentMethod(paymentMethodType: PaymentMethodTypeEnum, candidate: CreditCardModel | ACHModel, useExistingCallback, createNewCallback, cancelCallback): void {
    const modalRef = this.modalService.open(UseExistingPaymentMethodModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.paymentMethodType = paymentMethodType;
    modalRef.componentInstance.candidate = candidate;
    modalRef.result.then(result => {
      if (result) {
        return createNewCallback();
      }
      return useExistingCallback();
    }, reason => {
      cancelCallback()
    });
  }


  private getSubmitPaymentObservable(authorizationMessage: string, recaptchaToken?: string): Observable<void> {
    return this.saleEmailPaymentService.pay(this.token, this.viewService.version, this._paymentAmount.value, this._surchargeAmount.value, this._paymentMethods.value.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod, authorizationMessage, this.viewService.amountDue, recaptchaToken)
      .pipe(finalize(() => this.afterSubmit()))
      .pipe(map(
        response => {
          this.paymentResult = {
            authorizationId: response.authorizationId,
            approvalId: response.approvalId,
            paymentAmount: this._paymentAmount.value,
            surchargeAmount: this._surchargeAmount.value,
            totalIncludingSurcharge: this._totalIncludingSurcharge.value
          }
          this.viewService.creditCardPaymentAmountLeft = response.creditCardPaymentAmountLeft;
          this.processPayment = false;
          this.getSaleEmail();
          this.scroll();
        }))
      .pipe(catchError(error => {
          let errorMessage;
          if (this.paymentErrorService.isSaleHasChangedError(error)) {
            errorMessage = this.Labels.SaleHasChangedErrorMessage;
          } else if (this.paymentErrorService.isBadPaymentAmountError(error)) {
            errorMessage = this.Labels.SaleAmountDueHasChanged;
          } else if (this.paymentErrorService.isCCPaymentsDisabledError(error)) {
            errorMessage = this.Labels.CCPaymentsDisabled;
          } else if (this.paymentErrorService.isACHPaymentsDisabledError(error)) {
            errorMessage = this.Labels.ACHPaymentsDisabled;
          } else if (this.paymentErrorService.isPartialPaymentsDisabledError(error)) {
            errorMessage = this.Labels.PartialPaymentsDisabledErrorMessage;
          } else {
            this.fieldValidationService.error(error, this);
          }
          if (errorMessage) {
            this.openReloadDialog(errorMessage);
          }
          throw error;
        })
      )
  }

  private showSignInModal(successCallback: () => any, failedCallback?: () => any): void {
    const modalRef = this.modalService.open(CustomerPreFilledSignInModalComponent, {
      backdrop: 'static',
      size: 'md'
    });
    modalRef.componentInstance.reInit(new CustomerPreFilledSignInModel(PayerSignInModalMode.SIGN_IN, this.token, this.saleEmailViewModel.companyId, null, this.saleEmailViewModel.customerLogins, this.saleEmailViewModel.registrationConfirmationLifeTimeInMinutes, this.saleEmailViewModel.customerRegistrationOnCheckoutPageEnabled && !this.saleEmailViewModel.customerUserLimitExceeded));
    modalRef.result.then(customerId => {
      successCallback();
    }, reason => {
      if (failedCallback) {
        failedCallback();
      }
    });
  }

  private showCustomerIsNotSuitableModal(result: CurrentCustomerSuitableForSaleResponseModel) {
    if (!ObjectHelper.isDefined(this.customerIsNotSuitableModalComponent)) {
      this.customerIsNotSuitableModalComponent = this.modalService.open(SaleEmailCustomerIsNotSuitableModalComponent, {
        backdrop: 'static',
        size: 'md'
      });
    }
    this.customerIsNotSuitableModalComponent.componentInstance.reInit(result.suitableCustomerAsRoleId);
    this.customerIsNotSuitableModalComponent.result.then(() => this.customerIsNotSuitableModalComponent = null, () => this.customerIsNotSuitableModalComponent = null);
  }

  private updateSurcharge() {
    const paymentMethodType = this._paymentMethods.value.paymentMethodType;
    const paymentMethod = this._paymentMethods.value.selectedPaymentMethod;
    this._surchargeAmount.setValue(this.viewService.calculateSurcharge(this._paymentAmount.value, paymentMethodType, paymentMethod));
    this.updateTotalIncludingSurcharge();
  }

  private updateTotalIncludingSurcharge(){
    this._totalIncludingSurcharge.setValue(SalePaymentViewService.calculateTotal(this._paymentAmount.value, this._surchargeAmount.value));
  }

  private redirectToPortalOnNotFound(error: HttpErrorResponse) {
    if (error.status === 404) {
      this.routingService.navigateFirstUrl();
      return EMPTY;
    }
    return throwError(error);
  }

  protected readonly ObjectHelper = ObjectHelper;

  private updateTitle(saleEmailViewModel: SaleEmailPaymentViewModel) {
    let customerName = '';
    const billTo = saleEmailViewModel.saleData.billingAddress;
    if (billTo) {
      if (billTo.companyName) {
        customerName = billTo.companyName;
      } else if (billTo.lastName && billTo.firstName) {
        customerName = `${billTo.lastName}, ${billTo.firstName}`;
      } else if (billTo.lastName) {
        customerName = billTo.lastName;
      } else if (billTo.firstName) {
        customerName = billTo.firstName;
      }
    }

    this.titleService.setTitle(
      `${DocTypeEnumValue.get(saleEmailViewModel.saleData.saleShortInfo.docType)} ${saleEmailViewModel.saleData.saleShortInfo.docNumber}${!isEmptyString(customerName) ? ' for ' + customerName : ''}`,
      null
    );
  }
}

export interface SaleEmailPaymentFormGroupModel {
  paymentAmount: FormControl<number>;
  surchargeAmount: FormControl<number>;
  totalIncludingSurcharge: FormControl<number>;
  paymentMethods: FormControl<PaymentMethodsViewModel>
}
