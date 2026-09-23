import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {
  InvoiceMultiplePaymentWithPaymentDataRequest,
  InvoiceMultiplePaymentWithSavedPaymentMethodRequest,
  InvoiceTableModel
} from "./invoice.model";

export class InvoiceMultiplePaymentModelConverter {

  static toPayWithPaymentMethodDataRequest(ps: {
    invoice: InvoiceTableModel,
    paymentAmount: number
  }[], surchargeAmount: number, paymentMethod: PaymentMethodTypeEnum, paymentMethodModel: CreditCardModel | ACHModel, authorizationMessage: string): InvoiceMultiplePaymentWithPaymentDataRequest {
    const creditCardData = paymentMethod == PaymentMethodTypeEnum.CREDIT_CARD ? CreditCardModel.toJSON(<CreditCardModel>paymentMethodModel) : null;
    const achData = paymentMethod === PaymentMethodTypeEnum.ACH ? ACHModel.toJSON(<ACHModel>paymentMethodModel) : null;
    const payments = InvoiceMultiplePaymentModelConverter.toPayments(ps);
    return {payments, surchargeAmount, paymentMethod, creditCardData, achData, authorizationMessage};
  }

  static toPayWithSavedPaymentMethodRequest(ps: {
    invoice: InvoiceTableModel,
    paymentAmount: number
  }[], surchargeAmount: number, paymentMethod: PaymentMethodTypeEnum, paymentMethodModel: CreditCardModel | ACHModel, authorizationMessage: string): InvoiceMultiplePaymentWithSavedPaymentMethodRequest {
    const creditCardData = paymentMethod == PaymentMethodTypeEnum.CREDIT_CARD ? {cvv: (<CreditCardModel>paymentMethodModel).cvv} : null;
    const payments = InvoiceMultiplePaymentModelConverter.toPayments(ps);
    return {payments, surchargeAmount, creditCardData, authorizationMessage};
  }

  private static toPayments(ps: {
    invoice: InvoiceTableModel,
    paymentAmount: number
  }[]): { invoiceId: number, version: string, controlAmountDue: number, paymentAmount: number }[] {
    return ps.map(p => ({
      invoiceId: p.invoice.id,
      version: p.invoice.version,
      controlAmountDue: p.invoice.amountDue,
      paymentAmount: p.paymentAmount
    }));
  }
}
