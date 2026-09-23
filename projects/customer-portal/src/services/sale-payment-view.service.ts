import {Injectable} from "@angular/core";
import {PaymentStatusEnum} from "../../../common/src/lib/enums/sale/payment-status.enum";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {DocTypeEnum} from "@eps/common";
import {SaleTransactionViewModel} from "../../../common/src/lib/models/sale/sale-view.model";
import {PaymentMethodsViewService} from "../../../common/src/lib/payment/paymentmethod/payment-methods-view.service";
import {CustomerPermissionService} from "./customer-permission.service";
import {SalePaymentViewModel} from "../models/sale-payment-view.model";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {decimal} from "../../../common/src/lib/helpers/number.helper";
import Decimal from "decimal.js";
import {USStateEnum} from "../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../common/src/lib/enums/utils/ca-state.enum";
import {AuthorizationMessageViewService} from "./authorization-message-view.service";

@Injectable()
export class SalePaymentViewService {


  private paymentMethodsViewService: PaymentMethodsViewService;
  private _saleViewModel: SalePaymentViewModel;

  constructor(private currentCustomerService: CustomerCurrentDataService,
              private customerPermissionService: CustomerPermissionService,
              private authorizationMessageViewService: AuthorizationMessageViewService) {
  }

  get currency(): string {
    return this._saleViewModel?.currency;
  }

  get paymentsArray(): SaleTransactionViewModel[] {
    return this._saleViewModel?.transactions;
  }

  get showPayment(): boolean {
    return this.canBePaid && this._saleViewModel?.status != PaymentStatusEnum.PAID && this._saleViewModel?.status != PaymentStatusEnum.CANCELLED;
  }

  get disablePayment(): boolean {
    return this.allowedPaymentMethods.length == 0;
  }

  get allowedPaymentMethods(): PaymentMethodTypeEnum[] {
    return this.paymentMethodsViewService.allowedPaymentMethods;
  }

  get showPaymentHistory(): boolean {
    return this._saleViewModel?.transactions && this._saleViewModel?.transactions.length > 0;
  }

  get version(): string {
    return this._saleViewModel?.version;
  }

  get transactionHistoryVersion(): number {
    return this._saleViewModel?.transactionHistoryVersion;
  }

  get companyName(): string {
    return this._saleViewModel?.saleData.companyInfo.displayName;
  }

  get defaultSubmitButtonName(): string {
    return 'Complete Order';
  }

  get termsOfServiceLinkId(): string {
    return 'termsOfServiceLink';
  }

  get privacyStatementLinkId(): string {
    return 'privacyStatementLink';
  }

  get docType(): DocTypeEnum {
    return this._saleViewModel?.docType;
  }

  get partialPaymentsAllowed(): boolean {
    switch (this.docType) {
      case DocTypeEnum.INVOICE:
        return this._saleViewModel?.invoicePartialPaymentsAllowed;
      case DocTypeEnum.SALES_ORDER:
        return this._saleViewModel?.salesOrderPartialPaymentsAllowed;
      case DocTypeEnum.DEPOSIT:
        return this._saleViewModel?.depositPartialPaymentsAllowed;
      default:
        console.error(`Unknown docType ${this.docType}`);
        return null;
    }
  }

  get paymentMethods(): (CreditCardModel | ACHModel)[] {
    return this.paymentMethodsViewService.paymentMethods;
  }

  set paymentMethods(value: (CreditCardModel | ACHModel)[]) {
    this.paymentMethodsViewService.paymentMethods = value;
  }

  get defaultPaymentMethod(): CreditCardModel | ACHModel {
    return this.paymentMethodsViewService.defaultPaymentMethod;
  }

  get globalPaymentsEnabled(): boolean {
    return this.paymentMethodsViewService.globalPaymentsEnabled;
  }

  get customerCanPay(): boolean {
    return !this.currentCustomerService.isLoggedIn() || this.customerPermissionService.canProcessSalePayments(this._saleViewModel.docType);
  }

  private _canBePaid: boolean;

  get canBePaid(): boolean {
    return this._canBePaid;
  }

  set canBePaid(value: boolean) {
    this._canBePaid = value;
  }

  set canManagePaymentMethods(value: boolean) {
    this.paymentMethodsViewService.canManagePaymentMethods = value;
  }

  private _creditCardPaymentAmountLeft: number;

  set creditCardPaymentAmountLeft(value: number) {
    this._creditCardPaymentAmountLeft = value;
  }

  private get creditCardPaymentAmountLimit(): number {
    return this._saleViewModel.creditCardPaymentAmountLimit;
  }

  get amountDue() {
    return this._saleViewModel.saleData.amountDue;
  }

  initSale(saleEmailViewModel: SalePaymentViewModel, paymentMethodsViewService: PaymentMethodsViewService, canPay: boolean, savePaymentMethodsEnabled: boolean) {
    this._saleViewModel = saleEmailViewModel;
    this._creditCardPaymentAmountLeft = this._saleViewModel.creditCardPaymentAmountLeft;
    this.paymentMethodsViewService = paymentMethodsViewService;
    this.paymentMethodsViewService.globalPaymentsEnabled = saleEmailViewModel.globalPaymentsEnabled;
    this.paymentMethodsViewService.allowedPaymentMethods = saleEmailViewModel?.allowedPaymentMethods || [];
    this.paymentMethodsViewService.companyName = this.companyName;
    this.paymentMethodsViewService.usePaymentMethod = true;
    this.paymentMethodsViewService.canManagePaymentMethods = this.customerPermissionService.canManagePaymentMethods || (!this.currentCustomerService.isLoggedIn() && savePaymentMethodsEnabled);
    this._canBePaid = canPay;
  }

  getAuthorizationMessage(
    paymentAmount: number,
    surchargeAmount: number,
    totalIncludingSurcharge: number,
    paymentMethodType: PaymentMethodTypeEnum,
    paymentMethod: CreditCardModel | ACHModel
  ): string {
    const creditCardAuthorizationMessage = ObjectHelper.isDefined(surchargeAmount)
      ? this._saleViewModel.creditCardSurchargesAuthorizationMessage
      : this._saleViewModel.creditCardAuthorizationMessage;

    return this.authorizationMessageViewService.getAuthorizationMessage(
      paymentAmount,
      surchargeAmount,
      totalIncludingSurcharge,
      paymentMethodType,
      paymentMethod,
      creditCardAuthorizationMessage,
      this._saleViewModel.achAuthorizationMessage,
      this.defaultSubmitButtonName,
      this.termsOfServiceLinkId,
      this.privacyStatementLinkId
    );
  }


  getPaymentAmountMaxValue(paymentMethodType: PaymentMethodTypeEnum): number {
    return paymentMethodType === PaymentMethodTypeEnum.CREDIT_CARD && ObjectHelper.isDefined(this._creditCardPaymentAmountLeft) ? Math.min(this.amountDue, this._creditCardPaymentAmountLeft) : this.amountDue;
  }

  showCCPaymentAmountLimitMessage(paymentMethodType: PaymentMethodTypeEnum): boolean {
    return paymentMethodType === PaymentMethodTypeEnum.CREDIT_CARD && ObjectHelper.isDefined(this.creditCardPaymentAmountLimit);
  }

  calculateSurcharge(paymentAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: ACHModel | CreditCardModel): number {
    return SalePaymentViewService.calculateSurchargeByPercent(paymentAmount, paymentMethodType, paymentMethod, this.surchargePercent, this.surchargeProhibitedStates);
  }

  static calculateSurchargeByPercent(paymentAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: ACHModel | CreditCardModel, surchargePercent: number, surchargeProhibitedStates: (USStateEnum | CAStateEnum)[]): number {
    if (paymentMethodType === PaymentMethodTypeEnum.CREDIT_CARD && ObjectHelper.isDefined(surchargePercent)) {
      const creditCard = paymentMethod as CreditCardModel;
      if (creditCard.isCredit && !surchargeProhibitedStates.includes(creditCard.state as USStateEnum | CAStateEnum)) {
        return decimal(paymentAmount).mul(surchargePercent).div(100).toDecimalPlaces(2, Decimal.ROUND_DOWN).toNumber();
      }
    }
    return null;
  }

  get surchargePercent(): number {
    return this._saleViewModel.surchargePercent;
  }

  get surchargeProhibitedStates(): (USStateEnum | CAStateEnum)[]{
    return this._saleViewModel.surchargeProhibitedStates;
  }

  static calculateTotal(paymentAmount: number, surchargeAmount: number): number {
    return decimal(paymentAmount).add(surchargeAmount ?? 0).toDecimalPlaces(2).toNumber();
  }
}
