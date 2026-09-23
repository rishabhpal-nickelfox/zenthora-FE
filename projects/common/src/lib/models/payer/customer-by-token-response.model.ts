import {PaymentMethodTypeEnum} from "../../enums/sale/payment-method-type.enum";

export interface CustomerByTokenResponseModel {
  customer: { id: number; email: string}
  companyInfo: {
    globalPaymentsEnabled: boolean;
    allowedPaymentMethods: PaymentMethodTypeEnum[];
  }
}
