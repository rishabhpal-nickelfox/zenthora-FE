import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {
  PaymentMethodsViewService
} from "../../../../../../common/src/lib/payment/paymentmethod/payment-methods-view.service";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {ServerErrorService} from "../../../../../../common/src/lib/utils/server-error.service";
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {SaleLabels} from "../sale-labels";
import {MoneyHelper} from "../../../../../../common/src/lib/helpers/money.helper";
import {decimal} from "../../../../../../common/src/lib/helpers/number.helper";
import {isDefined, ObjectHelper} from "../../../../../../common/src/lib/helpers/object.helper";
import {
  PaymentMethodsViewModel
} from "../../../../../../common/src/lib/payment/paymentmethod/payment-methods.component";
import {PaymentMethodTypeEnum} from "../../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CreditCardModel} from "../../../../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../../../../common/src/lib/models/sale/ach.model";
import {catchError, finalize, map, mergeMap, switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import cloneDeep from 'lodash/cloneDeep';
import {CustomerService} from "../../../../services/customer.service";
import {CustomerPermissionService} from "../../../../services/customer-permission.service";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {AuthorizationMessageViewService} from "../../../../services/authorization-message-view.service";
import {SafeHtml} from "@angular/platform-browser";
import {CustomerCurrentDataService} from "../../../../services/customer-current-data.service";
import {
  FieldValidationErrorService
} from "../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {InvoiceService} from "../../../../services/invoice.service";
import {InvoiceTableModel} from "../../../../models/invoice.model";
import {CustomValidator} from "../../../../../../common/src/lib/helpers/custom.validator";
import {FormHelper} from "../../../../../../common/src/lib/helpers/form.helper";
import {InvoiceMultiplePaymentPrintModel} from "./invoice-multiple-payment-print.component";
import {ConfirmModalComponent} from "../../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PaymentErrorService} from "../../../../../../common/src/lib/utils/errorhandler/payment-error.service";
import {TermService} from "../../../../../../common/src/lib/services/eula/term.service";
import {
  HtmlContentModalComponent
} from "../../../../../../common/src/lib/modals/htmlcontent/html-content-modal.component";
import {
  UseExistingPaymentMethodModalComponent
} from "../../../modal/payment-method/use-existing-payment-method-modal.component";
import {Mask} from "../../../../../../common/src/lib/helpers/mask";
import {SalePaymentViewService} from "../../../../services/sale-payment-view.service";
import {USStateEnum} from "../../../../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../../../../common/src/lib/enums/utils/ca-state.enum";
import {ReceiptModalComponent} from "../../../../../../common/src/lib/modals/receipt/receipt-modal.component";
import {HtmlSanitizerService} from "../../../../../../common/src/lib/utils/html-sanitizer.service";

@Component({
  standalone: false,
  selector: 'app-invoice-multiple-payment',
  templateUrl: 'invoice-multiple-payment.component.html',
  styleUrls: ['./invoice-multiple-payment.component.scss', '../../../../../../common/src/lib/table/table.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService, PaymentMethodsViewService]
})
export class InvoiceMultiplePaymentComponent extends AutoScrollingFormPageComponent implements OnInit {
  _paymentMethods = new FormControl<PaymentMethodsViewModel>(new PaymentMethodsViewModel(null, null));
  invoices: InvoiceTableModel[] = [];
  paymentResult: { paymentAmount: number, surchargeAmount: number, totalIncludingSurcharge: number, authorizationId: string, approvalId: string, payments: { invoice: InvoiceTableModel, paymentAmount: number }[]};
  _paymentAmounts = new FormArray([]);
  _surchargeAmount = new FormControl<number>(null);
  _totalIncludingSurcharge = new FormControl<number>(null);
  @Output() goBackToListEvent = new EventEmitter<void>;
  @ViewChild('printDiv', {static: true}) printDiv: ElementRef;
  protected readonly Labels = SaleLabels;
  protected readonly DocTypeEnumValue = DocTypeEnumValue;
  protected readonly DocTypeEnum = DocTypeEnum;
  protected readonly ObjectHelper = ObjectHelper;
  private _creditCardAuthorizationMessage: string;
  private _achAuthorizationMessage: string;
  private readonly termsOfServiceLinkId = 'termsOfServiceLink';
  private readonly privacyStatementLinkId = 'privacyStatementLink';
  private _authorizationMessage: string;
  private _form = this._fb.group<InvoiceMultiplePaymentFormModel>({
    paymentAmounts: this._paymentAmounts,
    paymentMethods: this._paymentMethods,
    surchargeAmount: this._surchargeAmount,
    totalIncludingSurcharge: this._totalIncludingSurcharge
  });
   _printModel: InvoiceMultiplePaymentPrintModel;
  protected surchargePercent: number;
  protected surchargeProhibitedStates: (USStateEnum | CAStateEnum)[];

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              public errorService: ErrorService,
              public formServerErrorService: ServerErrorService,
              private _fb: FormBuilder,
              private ch: ChangeDetectorRef,
              private paymentMethodsViewService: PaymentMethodsViewService,
              private customerService: CustomerService,
              private customerPermissionService: CustomerPermissionService,
              private authAuthorizationMessageViewService: AuthorizationMessageViewService,
              private customerCurrentDataService: CustomerCurrentDataService,
              private fieldValidationService: FieldValidationErrorService,
              private paymentErrorService: PaymentErrorService,
              private htmlSanitizer: HtmlSanitizerService,
              private invoiceService: InvoiceService,
              private modalService: NgbModal,
              private termService: TermService) {
    super(formPageStateService, elementRef, errorService, formServerErrorService);
  }

  termsOfServiceLoading = false;
  privacyStatementLoading = false;

  private _invoicesLoading: boolean;

  get invoicesLoading(): boolean {
    return this._invoicesLoading;
  }

  private _paymentMethodsLoading: boolean;

  get paymentMethodsLoading(): boolean {
    return this._paymentMethodsLoading;
  }

  private _creditCardPaymentAmountLeft: number;

  get creditCardPaymentAmountLeft(): number {
    return this._creditCardPaymentAmountLeft;
  }

  set creditCardPaymentAmountLeft(value: number) {
    this._creditCardPaymentAmountLeft = value;
  }

  private _creditCardPaymentAmountLimit: number;

  get creditCardPaymentAmountLimit(): number {
    return this._creditCardPaymentAmountLimit;
  }

  private _invoicePartialPaymentsAllowed: boolean;

  get invoicePartialPaymentsAllowed(): boolean {
    return this._invoicePartialPaymentsAllowed;
  }

  get payments(): { invoice: InvoiceTableModel, paymentAmount: number }[] {
    return this._paymentAmounts.controls.map(
      (control, i) => ({
        invoice: this.invoices[i],
        paymentAmount: control.value
      })
    )
  }

  private _sanitizedAuthorizationMessage: SafeHtml;

  get sanitizedAuthorizationMessage(): SafeHtml {
    return this._sanitizedAuthorizationMessage;
  }

  private _currencyPrefix: string;

  get currencyPrefix(): string {
    return this._currencyPrefix;
  }

  get totalPaymentAmount(): number { //Without surcharge
    if (ObjectHelper.isDefined(this._paymentAmounts)) {
      return decimal(this._paymentAmounts.getRawValue().reduce((i, k) => i.add(Number(k)), decimal(0))).toDecimalPlaces(2).toNumber();
    }
    return 0;
  }

  get totalLeftToPay(): number {
    if (ObjectHelper.isDefined(this.invoices)) {
      return this.invoices.map(invoice => invoice.amountDue).reduce((i, k) => i.add(Number(k)), decimal(0)).toDecimalPlaces(2).toNumber();
    }
    return 0;
  }

  get paymentMethodType(): PaymentMethodTypeEnum {
    return this._paymentMethods.getRawValue().paymentMethodType;
  }

  get paymentMethod(): CreditCardModel | ACHModel {
    return this._paymentMethods.getRawValue().selectedPaymentMethod;
  }

  get showCCPaymentAmountLimitHint() {
    return ObjectHelper.isDefined(this.creditCardPaymentAmountLimit) && this.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD;
  }

  get printing(): boolean {
    return ObjectHelper.isDefined(this._printModel);
  }

  getForm(): FormGroup {
    return this._form;
  }

  openReloadDialog(header: string): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.body = 'Do you want to reload Invoices data?';
    modalRef.result.then(() => this.updateInvoices(), reason => {
      this.ch.detectChanges();
    });
  }

  protected onReInit(data: {
    invoices: InvoiceTableModel[],
    invoicePartialPaymentsAllowed: boolean,
    globalPaymentsEnabled: boolean,
    allowedPaymentMethods: PaymentMethodTypeEnum[],
    creditCardAuthorizationMessage: string,
    achAuthorizationMessage: string,
    creditCardPaymentAmountLimit: number,
    creditCardPaymentAmountLeft: number,
    surchargePercent: number,
    surchargeProhibitedStates: (USStateEnum | CAStateEnum)[];
  }) {

    this._creditCardAuthorizationMessage = data.creditCardAuthorizationMessage;
    this._achAuthorizationMessage = data.achAuthorizationMessage;
    this._invoicePartialPaymentsAllowed = data.invoicePartialPaymentsAllowed;
    this.paymentMethodsViewService.companyName = this.customerCurrentDataService.companyRole.name;
    this.paymentMethodsViewService.globalPaymentsEnabled = data.globalPaymentsEnabled;
    this.paymentMethodsViewService.allowedPaymentMethods = data.allowedPaymentMethods;
    this.paymentMethodsViewService.usePaymentMethod = true;
    this.paymentMethodsViewService.canManagePaymentMethods = this.customerPermissionService.canManagePaymentMethods;
    this._creditCardPaymentAmountLimit = data.creditCardPaymentAmountLimit;
    this._creditCardPaymentAmountLeft = data.creditCardPaymentAmountLeft;
    this.surchargePercent = data.surchargePercent;
    this.surchargeProhibitedStates = data.surchargeProhibitedStates;

    while (this._paymentAmounts.length !== 0) {
      this._paymentAmounts.removeAt(0)
    }

    this.invoices = data.invoices;

    this._currencyPrefix = MoneyHelper.getCurrencyPrefix(this.invoices[0].currency);

    this.invoices.forEach(invoice => {
      const paymentAmountFormControl = new FormControl<number>(invoice.amountDue ?? 0, Validators.compose([
        c => CustomValidator.maxAmount(this.Labels.AmountToCharge, invoice.amountDue, this.currencyPrefix)(c), c => CustomValidator.minAmountStrict(this.Labels.AmountToCharge, 0, this.currencyPrefix)(c)]));
      paymentAmountFormControl.markAsDirty();
      this._paymentAmounts.push(paymentAmountFormControl);
    });

    this.getForm().setValidators(Validators.compose([c => this.invoicePaymentMaxTotalValidation()(c), c => this.invoicePaymentMinTotalValidation()(c)]))

    this.subscriptions.add(
      this.getPaymentMethodsObservableAndSelectDefault().subscribe()
    );

    this.ch.detectChanges();
  }

  protected onSubmit(value) {
    const savePaymentMethod = this._paymentMethods.value.selectedPaymentMethod.savePaymentMethod;

    if (savePaymentMethod) {
      this.savePaymentMethodAndSubmitPayment()
    } else {
      this.submitPayment()
    }
  }

  protected onDeletePaymentMethod(value: {
    paymentMethodType: PaymentMethodTypeEnum,
    paymentMethod: CreditCardModel | ACHModel
  }) {
    this.subscriptions.add(
      this.customerService.deletePaymentMethod(value.paymentMethodType, value.paymentMethod)
        .pipe(map(() => this.errorService.showSuccess('', 'Payment method deleted')))
        .pipe(mergeMap(() => this.getPaymentMethodsObservableAndSelectDefault()))
        .subscribe()
    )
  }

  protected onInit() {
    super.onInit();
    this.paymentMethodsViewService.globalPaymentsEnabled = true;
    this.subscriptions.add(
      this.getForm().valueChanges.subscribe(value => this.onFormValueChanges())
    );
    this.subscriptions.add(
      this.paymentMethodsViewService.paymentMethodTypeChanged.subscribe(() => {
        FormHelper.updateGroupValidation(this._paymentAmounts);
      })
    );
    this.subscriptions.add(
      this._paymentMethods.valueChanges.subscribe(() => {
        this.updateSurcharge();
      })
    );
    this.subscriptions.add(
      this._paymentAmounts.valueChanges.subscribe(() => {
        this.updateSurcharge();
      })
    )
  }

  protected startPrinting() {
    const payments = ObjectHelper.isDefined(this.paymentResult) ? this.paymentResult.payments : this.invoices.map(invoice => ({
      invoice: invoice,
      paymentAmount: null
    }));
    this._printModel = {
      payments: payments,
      paymentResult: this.paymentResult ? {approvalId: this.paymentResult.approvalId, authorizationId: this.paymentResult.authorizationId, paymentAmount: this.paymentResult.paymentAmount, surchargeAmount: this.paymentResult.surchargeAmount, totalIncludingSurcharge: this.paymentResult.totalIncludingSurcharge}: null,
      currencyPrefix: this.currencyPrefix
    }
    this.ch.detectChanges();
  }

  protected onReadyToPrint() {
    this.print(this.printDiv);
    this._printModel = null;
    this.ch.detectChanges();
  }

  private getPaymentMethodsObservable(): Observable<void> {
    if (this.customerPermissionService.canProcessSalePayments(DocTypeEnum.INVOICE)) {
      return of(this._paymentMethodsLoading = true).pipe(switchMap(() =>
        this.customerService.getAllowedPaymentMethods().pipe(map(result => {
          let paymentMethods = cloneDeep(result.paymentMethods);
          paymentMethods = paymentMethods.sort((a, b) => {
            return b.customerDefault ? 1 : -1;
          });
          this.paymentMethodsViewService.paymentMethods = paymentMethods;
        })).pipe(finalize(() => {
          this._paymentMethodsLoading = false;
          this.ch.detectChanges();
        }))));
    }
    return of(void 0).pipe(map(() => {
      this.paymentMethodsViewService.paymentMethods = [];
    }));
  }

  private getPaymentMethodsObservableAndSelectDefault() {
    return this.getPaymentMethodsObservable().pipe(map(() => this.selectDefault()))
  }

  private selectDefault() {
    if (this.paymentMethodsViewService.defaultPaymentMethod) {
      const paymentMethodType = this.paymentMethodsViewService.defaultPaymentMethod instanceof CreditCardModel ? PaymentMethodTypeEnum.CREDIT_CARD :
        this.paymentMethodsViewService.defaultPaymentMethod instanceof ACHModel ? PaymentMethodTypeEnum.ACH : null;
      this._paymentMethods.reset({
        paymentMethodType: paymentMethodType,
        selectedPaymentMethod: Object.assign({savePaymentMethod: false}, this.paymentMethodsViewService.defaultPaymentMethod),
      });
    } else {
      this._paymentMethods.reset({
        paymentMethodType: null,
        selectedPaymentMethod: null
      });
    }
  }

  private onFormValueChanges() {
    this._authorizationMessage = this.authAuthorizationMessageViewService.getAuthorizationMessage(
      this.totalPaymentAmount,
      this._surchargeAmount.value,
      this._totalIncludingSurcharge.value,
      this.paymentMethodType, this._paymentMethods.getRawValue().selectedPaymentMethod, this._creditCardAuthorizationMessage, this._achAuthorizationMessage, this.Labels.Submit,
      this.termsOfServiceLinkId, this.privacyStatementLinkId);
    this._sanitizedAuthorizationMessage = this.htmlSanitizer.sanitizeToSafeHtml(this._authorizationMessage);
    this.ch.detectChanges();
    document.getElementById(this.termsOfServiceLinkId)?.addEventListener("click", () => this.onTermsOfService());
    document.getElementById(this.privacyStatementLinkId)?.addEventListener("click", () => this.onPrivacyStatement());
  }

  private savePaymentMethodAndSubmitPayment() {
    const savePaymentMethodAndSubmitPayment = () => {
      this.subscriptions.add(
        this.getSavePaymentMethodObservable(this.paymentMethodType, this.paymentMethod)
          .pipe(mergeMap(newPaymentMethod => this.getPaymentMethodsObservable().pipe(map(() => {
            let savedPaymentMethod = this.paymentMethodsViewService.paymentMethods.find(pm => pm.id == newPaymentMethod.id);
            if (isDefined(savedPaymentMethod)) {
              if (this.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
                savedPaymentMethod = (savedPaymentMethod as CreditCardModel);
                savedPaymentMethod.cvv = (newPaymentMethod as CreditCardModel).cvv;
              } else if (this.paymentMethodType == PaymentMethodTypeEnum.ACH) {
                savedPaymentMethod = (savedPaymentMethod as ACHModel);
              }
            }
            this._paymentMethods.reset({
              selectedPaymentMethod: Object.assign({savePaymentMethod: false}, savedPaymentMethod),
              paymentMethodType: this.paymentMethodType
            });
          }))))
          .pipe(mergeMap(() => this.getSubmitPaymentObservable()))
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
    if (!isDefined(this.paymentMethod.id)) {
      if (this.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
        const last4 = Mask.unmaskCreditCardNumber((this.paymentMethod as CreditCardModel).number).slice(-4);
        const date = (this.paymentMethod as CreditCardModel).date;
        pmCandidate = this.paymentMethodsViewService.paymentMethods.find(pm => pm instanceof CreditCardModel && pm.number.slice(-4) == last4 && (pm as CreditCardModel).date == date);
      } else if (this.paymentMethodType == PaymentMethodTypeEnum.ACH) {
        const accountNumber = (this.paymentMethod as ACHModel).accountNumber.slice(-4);
        const routingNumber = (this.paymentMethod as ACHModel).routingNumber;
        pmCandidate = this.paymentMethodsViewService.paymentMethods.find(pm => pm instanceof ACHModel && pm.accountNumber.slice(-4) == accountNumber && pm.routingNumber == routingNumber);
      }
      if (isDefined(pmCandidate)) {
        const onUseExisting = () => {
          this._paymentMethods.reset({
            selectedPaymentMethod: Object.assign({savePaymentMethod: false}, pmCandidate),
            paymentMethodType: this.paymentMethodType
          });
          this.afterSubmit();
        }
        const onCreateNew = () => savePaymentMethodAndSubmitPayment();
        const onCancel = () => this.afterSubmit();


        this.openConfirmAddSimilarPaymentMethod(this.paymentMethodType, pmCandidate, onUseExisting, onCreateNew, onCancel);
        return;
      }
    }
    return savePaymentMethodAndSubmitPayment();
  }

  private getSavePaymentMethodObservable(paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel): Observable<CreditCardModel | ACHModel> {
    return this.customerService.savePaymentMethod(paymentMethodType, paymentMethod);
  }

  private getSubmitPaymentObservable(): Observable<void> {
    return this.invoiceService.payMultiple(this.payments, this._surchargeAmount.value, this.paymentMethodType, this.paymentMethod, this._authorizationMessage)
      .pipe(finalize(() => this.afterSubmit()))
      .pipe(map(
        result => {
          this.showReceipt(result.receipt.value);
          this.cancel();
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
      }))
  }

  private submitPayment(): void {
    this.subscriptions.add(
      this.getSubmitPaymentObservable().pipe(finalize(() => {
        this.ch.detectChanges();
      })).subscribe()
    );
  }

  private invoicePaymentMaxTotalValidation(): ValidatorFn {
    return (control: AbstractControl) => {
      if (this.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD && ObjectHelper.isDefined(this._creditCardPaymentAmountLimit)) {
        return this.totalPaymentAmount <= this._creditCardPaymentAmountLeft ? null : {'totalPaymentAmountExceedsCreditCardPaymentAmountLimit': true}
      }
      return null;
    };
  }

  private invoicePaymentMinTotalValidation(): ValidatorFn {
    return (control: AbstractControl) => {
      return this.totalPaymentAmount > 0 ? null : {'totalPaymentAmountMustBeGreaterThan0': true}
    };
  }

  private updateInvoices() {
    this._invoicesLoading = true;
    this.subscriptions.add(
      this.invoiceService.getMultipleInvoices(this.invoices.map(invoice => invoice.id))
        .pipe(finalize(() => {
          this._invoicesLoading = false;
          this.ch.detectChanges();
        }))
        .subscribe(
          result => {
            this.reInit({
              invoices: result.invoices,
              invoicePartialPaymentsAllowed: result.invoicePartialPaymentsAllowed,
              globalPaymentsEnabled: this.paymentMethodsViewService.globalPaymentsEnabled,
              allowedPaymentMethods: result.allowedPaymentMethods,
              creditCardAuthorizationMessage: this._creditCardAuthorizationMessage,
              achAuthorizationMessage: this._achAuthorizationMessage,
              creditCardPaymentAmountLimit: result.creditCardPaymentAmountLimit,
              creditCardPaymentAmountLeft: result.creditCardPaymentAmountLeft
            });
          }
        )
    )
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
    this._surchargeAmount.setValue(SalePaymentViewService.calculateSurchargeByPercent(this.totalPaymentAmount, paymentMethodType, paymentMethod, this.surchargePercent, this.surchargeProhibitedStates));
    this.updateTotalIncludingSurcharge();
  }

  private updateTotalIncludingSurcharge() {
    this._totalIncludingSurcharge.setValue(SalePaymentViewService.calculateTotal(this.totalPaymentAmount, this._surchargeAmount.value));
  }

  private showReceipt(receipt) {
    const modalRef = this.modalService.open(ReceiptModalComponent, {
      windowClass: 'transaction-history-receipt auto-size',
      backdrop: 'static'
    });
    const receiptComponent: ReceiptModalComponent = modalRef.componentInstance;
    receiptComponent.receipt = receipt;
  }

  goBackToInvoiceList() {
    this.unlockSubmit();
    this.goBackToListEvent.emit();
  }

}

class InvoiceMultiplePaymentFormModel {
  paymentAmounts: FormArray<FormControl<number>>;
  paymentMethods: FormControl<PaymentMethodsViewModel>;
  surchargeAmount: FormControl<number>;
  totalIncludingSurcharge: FormControl<number>;
}
