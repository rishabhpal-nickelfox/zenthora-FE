import {ChangeDetectorRef, ElementRef, Injectable, OnInit, ViewChild} from '@angular/core';
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {
  PaymentMethodsViewService
} from "../../../../../common/src/lib/payment/paymentmethod/payment-methods-view.service";
import {SalePrintService, DocTypeEnumValue} from "@eps/common";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {SalePortalPaymentViewModel} from "../../../models/sale-portal-payment-view.model";
import {ServerErrorService} from "../../../../../common/src/lib/utils/server-error.service";
import {CompanyLabels} from "../../../../../company-portal/src/app/pages/companymanagement/company/company-labels";
import {SaleLabels} from "./sale-labels";
import {PaymentMethodsViewModel} from "../../../../../common/src/lib/payment/paymentmethod/payment-methods.component";
import {PaymentHistoryComponent} from "../../../../../common/src/lib/sale/view/payment-history.component";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";
import {PaymentMethodTypeEnum} from "../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {SafeHtml} from "@angular/platform-browser";
import {SalePaymentViewService} from "../../../services/sale-payment-view.service";
import {CreditCardModel} from "../../../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../../../common/src/lib/models/sale/ach.model";
import {catchError, finalize, map, mergeMap, switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import cloneDeep from 'lodash/cloneDeep';
import {CustomerService} from "../../../services/customer.service";
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {SaleEmailPaymentLabels} from "../../checkout/sale-email-payment-labels";
import {AddressConverterModel} from "../../../../../common/src/lib/models/common/address-model-converter";
import {isDefined, ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {SaleService} from "../../../services/sale.service";
import {PaymentErrorService} from "../../../../../common/src/lib/utils/errorhandler/payment-error.service";
import {ConfirmModalComponent} from "../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerPermissionService} from "../../../services/customer-permission.service";
import {TermService} from "../../../../../common/src/lib/services/eula/term.service";
import {HtmlContentModalComponent} from "../../../../../common/src/lib/modals/htmlcontent/html-content-modal.component";
import {Mask} from "../../../../../common/src/lib/helpers/mask";
import {
  UseExistingPaymentMethodModalComponent
} from "../../modal/payment-method/use-existing-payment-method-modal.component";
import {HtmlSanitizerService} from "../../../../../common/src/lib/utils/html-sanitizer.service";

@Injectable()
export abstract class SalePortalPaymentComponent extends AutoScrollingFormPageComponent implements OnInit {
  paymentMethodsLoading = false;
  termsOfServiceLoading = false;
  privacyStatementLoading = false;

  paymentResult: {
    paymentAmount: number;
    surchargeAmount: number;
    totalIncludingSurcharge: number;
    authorizationId: string;
    approvalId: string;
  };


  _paymentAmount = new FormControl<number>(null);
  _surchargeAmount = new FormControl<number>(null);
  _totalIncludingSurcharge = new FormControl<number>(null);
  _paymentMethods = new FormControl<PaymentMethodsViewModel>(new PaymentMethodsViewModel(null, null));
  processPayment = false;
  protected saleViewModel: SalePortalPaymentViewModel;
  protected Labels = SaleLabels;
  protected form: FormGroup = this._fb.group<SalePaymentFormGroupModel>({
    paymentAmount: this._paymentAmount,
    surchargeAmount: this._surchargeAmount,
    totalIncludingSurcharge: this._totalIncludingSurcharge,
    paymentMethods: this._paymentMethods
  });
  protected readonly CompanyLabels = CompanyLabels;
  protected readonly DocTypeEnumValue = DocTypeEnumValue;
  @ViewChild(PaymentHistoryComponent) protected saleEmailPaymentHistoryComponent: PaymentHistoryComponent;
  protected readonly SaleEmailPaymentLabels = SaleEmailPaymentLabels;
  protected readonly AddressConverterModel = AddressConverterModel;
  protected saleLoading: boolean;

  constructor(formPageStateService: FormPageStateService, elementRef: ElementRef,
              errorService: ErrorService, formServerErrorService: ServerErrorService,
              protected ch: ChangeDetectorRef, protected _fb: FormBuilder,
              protected viewService: SalePaymentViewService,
              protected paymentMethodsViewService: PaymentMethodsViewService,
              protected htmlSanitizer: HtmlSanitizerService,
              protected printService: SalePrintService,
              protected customerService: CustomerService,
              protected modalService: NgbModal,
              protected alertService: AlertService,
              protected fieldValidationService: FieldValidationErrorService,
              protected paymentErrorService: PaymentErrorService,
              protected customerPermissionService: CustomerPermissionService,
              protected termService: TermService) {
    super(formPageStateService, elementRef, errorService, formServerErrorService);
  }

  get paymentMethodType(): PaymentMethodTypeEnum {
    return this._paymentMethods.value.paymentMethodType;
  }

  protected abstract get printSale(): ElementRef;

  protected abstract get saleService(): SaleService;

  _sanitizedAuthorizationMessage: SafeHtml;

  private get sanitizedAuthorizationMessage(): SafeHtml {
    return this.htmlSanitizer.sanitizeToSafeHtml(this.authorizationMessage);
  }

  private get authorizationMessage(): string {
    return this.viewService.getAuthorizationMessage(this._paymentAmount.value, this._surchargeAmount.value, this._totalIncludingSurcharge.value, this.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod);
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

  getForm(): FormGroup {
    return this.form;
  }

  print() {
    const head = document.head.innerHTML;
    const classList = Array.from(document.body.classList).join(' ');
    //open a4-sized window
    const popup = window.open('', '_blank', 'width=794,height=1123,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popup.document.open();

    popup.document.write(`<html>${head}<body onload="window.print()" class="${classList}">${this.printSale.nativeElement.innerHTML}</body></html>`);
    popup.document.close();
  }


  pay() {
    if (this.viewService.canBePaid) {
      this.subscriptions.add(
        this.getPaymentMethodsObservable()
          .pipe(finalize(() => {
            this.resetPayment();
            this.processPayment = true;
            this.ch.detectChanges();

            document.getElementById('paymentAmount').scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          })).subscribe()
      );
    }
  }

  cancelPayment() {
    this.processPayment = false;
    this.ch.detectChanges();
  }

  openReloadDialog(header: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.body = 'Do you want to reload Sale data?';
    modalRef.result.then(() => this.reloadSale(), reason => {
      this.ch.detectChanges();
    });
  }

  protected onReInit(sale: SalePortalPaymentViewModel) {
    this.saleViewModel = sale;
    this.viewService.initSale(this.saleViewModel, this.paymentMethodsViewService, this.customerPermissionService.canProcessSalePayments(this.saleViewModel.docType), true);
    this._paymentAmount.setValue(this.viewService.partialPaymentsAllowed ? null : this.saleViewModel.saleData.amountDue);
    if (this.viewService.partialPaymentsAllowed) {
      this._paymentAmount.enable();
    } else {
      this._paymentAmount.disable();
    }
    this.ch.detectChanges();
  }

  protected onSubmit({value}: { value: any }) {
    const savePaymentMethod = this._paymentMethods.value.selectedPaymentMethod.savePaymentMethod;

    if (savePaymentMethod) {
      this.savePaymentMethodAndSubmitPayment(this._paymentMethods.value.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod, this.authorizationMessage)
    } else {
      this.submitPayment(this.authorizationMessage)
    }
  }

  protected onInit() {
    super.onInit();

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
    })
    this.getForm().valueChanges.subscribe(() => this.onFormValueChanges());

  }

  protected resetPayment() {
    this.paymentResult = null;

    const paymentMethodType = this.viewService.defaultPaymentMethod ? this.viewService.defaultPaymentMethod instanceof ACHModel ? PaymentMethodTypeEnum.ACH :
      this.viewService.defaultPaymentMethod instanceof CreditCardModel ? PaymentMethodTypeEnum.CREDIT_CARD : null : null;
    this.form.patchValue({
      paymentAmount: this.saleViewModel.saleData.amountDue,
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

  private reloadSale() {
    this.saleLoading = true;
    this.subscriptions.add(
      this.saleService.getAdditionalInfo(this.saleViewModel.id)
        .pipe(map(sale => {
          this.reInit(sale);
        }))
        .pipe(mergeMap(() => this.getPaymentMethodsObservableAndSelectDefault()))
        .pipe(finalize(() => {
          this.saleLoading = false;
          this.ch.detectChanges();
        }))
        .subscribe()
    )
  }

  private submitPayment(authorizationMessage: string): void {
    this.subscriptions.add(
      this.getSubmitPaymentObservable(authorizationMessage).pipe(finalize(() => {
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
                savedPaymentMethod.cvv = (newPaymentMethod as CreditCardModel).cvv;
              } else if (paymentMethodType == PaymentMethodTypeEnum.ACH) {
                savedPaymentMethod = (savedPaymentMethod as ACHModel);
              }
            }
            this.form.controls.paymentMethods.reset({
              selectedPaymentMethod: savedPaymentMethod,
              paymentMethodType: paymentMethodType,
              savePaymentMethod: false
            });
          }))))
          .pipe(mergeMap(() => this.getSubmitPaymentObservable(authorizationMessage)))
          .pipe(catchError(error => {
            this.fieldValidationService.error(error, this);
            throw error;
          }))
          .pipe(finalize(() => {
            this.afterSubmit();
            this.ch.detectChanges();
          }))
          .subscribe());
    };

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
            selectedPaymentMethod: pmCandidate,
            paymentMethodType: paymentMethodType,
            savePaymentMethod: false
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

  private getSubmitPaymentObservable(authorizationMessage: string): Observable<void> {
    return this.saleService.pay(this.saleViewModel.id, this.viewService.version, this._paymentAmount.value, this._surchargeAmount.value, this.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod, authorizationMessage, this.saleViewModel.saleData.amountDue)
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
          this.reloadSale();
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

  private onFormValueChanges() {
    this._sanitizedAuthorizationMessage = this.sanitizedAuthorizationMessage;
    this.ch.detectChanges();

    document.getElementById(this.viewService.termsOfServiceLinkId)?.addEventListener("click", () => this.onTermsOfService());
    document.getElementById(this.viewService.privacyStatementLinkId)?.addEventListener("click", () => this.onPrivacyStatement());
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

  onTermsOfService() {
    this.termsOfServiceLoading = true;
    this.termService.getTermsOfService().pipe(finalize(() => {
      this.termsOfServiceLoading = false;
      this.ch.detectChanges();
    })).subscribe(base64String => {
      this.openTermsOfService(base64String);
    })
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

  onPrivacyStatement() {
    this.privacyStatementLoading = true;
    this.termService.getPrivacyStatement().pipe(finalize(() => {
      this.privacyStatementLoading = false;
      this.ch.detectChanges();
    })).subscribe(base64String => {
      this.openPrivacyStatement(base64String);
    })
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

  private updateSurcharge() {
    const paymentMethodType = this._paymentMethods.value.paymentMethodType;
    const paymentMethod = this._paymentMethods.value.selectedPaymentMethod;
    this._surchargeAmount.setValue(this.viewService.calculateSurcharge(this._paymentAmount.value, paymentMethodType, paymentMethod));
    this.updateTotalIncludingSurcharge();
  }

  private updateTotalIncludingSurcharge(): void {
    this._totalIncludingSurcharge.setValue(SalePaymentViewService.calculateTotal(this._paymentAmount.value, this._surchargeAmount.value));
  }

  protected readonly ObjectHelper = ObjectHelper;
}


export interface SalePaymentFormGroupModel {
  paymentAmount: FormControl<number>;
  surchargeAmount: FormControl<number>;
  paymentMethods: FormControl<PaymentMethodsViewModel>;
  totalIncludingSurcharge: FormControl<number>;
}
