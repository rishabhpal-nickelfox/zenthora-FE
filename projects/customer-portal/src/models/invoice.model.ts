import {DocTypeEnum} from "@eps/common";
import {SalePortalPaymentViewModel, SaleTableModel} from "./sale-portal-payment-view.model";
import {
  AchData,
  CreditCardData,
  ShortCreditCardData
} from "../../../common/src/lib/models/sale/email/sale-email-payment-server.model";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";

export class InvoiceModel extends SalePortalPaymentViewModel {
  readonly docType = DocTypeEnum.INVOICE;

}

export class InvoiceTableModel extends SaleTableModel {
  version: string;

  static fromJSON(json): InvoiceTableModel {
    const invoice = Object.assign(new InvoiceTableModel(), SaleTableModel.fromJSON(json));
    invoice.version = json.version;
    return invoice;
  }
}

export interface InvoiceMultiplePaymentWithPaymentDataRequest {
  payments: { invoiceId: number, version: string, controlAmountDue: number, paymentAmount: number }[];
  surchargeAmount: number;
  paymentMethod: string;
  creditCardData: CreditCardData;
  achData: AchData;
  authorizationMessage: string;
}

export interface InvoiceMultiplePaymentWithSavedPaymentMethodRequest {
  payments: { invoiceId: number, version: string, controlAmountDue: number, paymentAmount: number }[];
  surchargeAmount: number;
  creditCardData: ShortCreditCardData,
  authorizationMessage: string;
}

export class InvoiceMultiplePaymentResult {
  receipt: { name: string, value: string };

  static toInvoiceMultiplePaymentResult(json){
    const result = new InvoiceMultiplePaymentResult();
    result.receipt = json.receipt;
    return result;

  }
}

export interface InvoiceMultiplePaymentInfo {
  invoices: InvoiceTableModel[];
  creditCardAuthorizationMessage: string;
  achAuthorizationMessage: string;
  creditCardPaymentAmountLeft: number;
}

export class ReloadInvoiceMultipleResponse {
  invoices: InvoiceTableModel[];
  creditCardPaymentAmountLeft: number;
  creditCardPaymentAmountLimit: number;
  allowedPaymentMethods: PaymentMethodTypeEnum[];
  invoicePartialPaymentsAllowed: boolean;

  static toReloadInvoiceMultipleResponse(json){
    const result = new ReloadInvoiceMultipleResponse();
    result.invoices = json.invoices.map(invoice => InvoiceTableModel.fromJSON(invoice));
    result.creditCardPaymentAmountLeft = json.creditCardPaymentAmountLeft;
    result.creditCardPaymentAmountLimit = json.creditCardPaymentAmountLimit;
    result.allowedPaymentMethods = json.allowedPaymentMethods;
    result.invoicePartialPaymentsAllowed = json.invoicePartialPaymentsAllowed;
    return result;

  }
}
