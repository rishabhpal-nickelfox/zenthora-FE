import {EventEmitter, Injectable, Output} from "@angular/core";
import {PaymentMethodTypeEnum} from "../../enums/sale/payment-method-type.enum";
import {CreditCardModel} from "../../models/sale/credit-card.model";
import {ACHModel} from "../../models/sale/ach.model";

@Injectable()
export class PaymentMethodsViewService {
  @Output() globalPaymentEnabledChanged = new EventEmitter();
  @Output() usePaymentMethodChanged = new EventEmitter();
  @Output() paymentMethodsChanged = new EventEmitter();
  @Output() allowedPaymentMethodsChanged = new EventEmitter();
  @Output() autoSavePaymentMethodsChanged = new EventEmitter();
  @Output() paymentMethodTypeChanged = new EventEmitter();
  @Output() canManagePaymentMethodsChanged = new EventEmitter();
  private _paymentMethods: (CreditCardModel | ACHModel)[] = [];

  get paymentMethods(): (CreditCardModel | ACHModel)[] {
    return this._paymentMethods || [];
  }

  set paymentMethods(value: (CreditCardModel | ACHModel)[]) {
    this._paymentMethods = value;
    this.paymentMethodsChanged.emit();
  }

  private _usePaymentMethod: boolean;

  get usePaymentMethod(): boolean {
    return this._usePaymentMethod;
  }

  set usePaymentMethod(value: boolean) {
    this._usePaymentMethod = value;
    this.usePaymentMethodChanged.emit();
  }

  private _allowedPaymentMethods: PaymentMethodTypeEnum[] = [];

  get allowedPaymentMethods(): PaymentMethodTypeEnum[] {
    return this._allowedPaymentMethods || [];
  }

  set allowedPaymentMethods(value: PaymentMethodTypeEnum[]) {
    this._allowedPaymentMethods = value;
    this.allowedPaymentMethodsChanged.emit();
  }

  private _customerId: number;

  get customerId(): number {
    return this._customerId;
  }

  set customerId(value: number) {
    this._customerId = value;
  }

  private _companyName: string;

  get companyName(): string {
    return this._companyName;
  }

  set companyName(value: string) {
    this._companyName = value;
  }

  private _globalPaymentsEnabled;

  get globalPaymentsEnabled(): boolean {
    return this._globalPaymentsEnabled;
  }

  set globalPaymentsEnabled(value: boolean) {
    this._globalPaymentsEnabled = value;
    this.globalPaymentEnabledChanged.emit();
  }

  get defaultPaymentMethod(): CreditCardModel | ACHModel {
    return this._paymentMethods.find(pm => pm.customerDefault);
  }

  get batchDefaultPaymentMethod(): CreditCardModel | ACHModel {
    return this._paymentMethods.find(pm =>  pm.batchDefault);
  }

  get paymentDefaultPaymentMethod(): CreditCardModel | ACHModel {
    return this._paymentMethods.find(pm =>  pm.paymentDefault);
  }

  private _autoSavePaymentMethods = false;

  get autoSavePaymentMethods(): boolean {
    return this._autoSavePaymentMethods;
  }

  set autoSavePaymentMethods(value: boolean) {
    this._autoSavePaymentMethods = value;
    this.autoSavePaymentMethodsChanged.emit();
  }

  private _canManagePaymentMethods = true;

  get canManagePaymentMethods(): boolean {
    return this._canManagePaymentMethods;
  }

  set canManagePaymentMethods(value: boolean) {
    this._canManagePaymentMethods = value;
    this.canManagePaymentMethodsChanged.emit();
  }

  private _customerEmail: string;

  get customerEmail(): string {
    return this._customerEmail;
  }

  set customerEmail(value: string) {
    this._customerEmail = value;
  }


}
