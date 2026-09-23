interface SaleEmailAuthorizationRequestModel {
  payerFirstName: string;
  payerLastName: string;
  payerCompanyName: string;
  paymentAmount: number;
}

export interface SaleEmailCCAuthorizationRequestModel extends SaleEmailAuthorizationRequestModel {
  cardNumber: string;
  nameOnCard: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface SaleEmailACHAuthorizationRequestModel extends SaleEmailAuthorizationRequestModel {
  nameOnAccount: string;
  routing: string;
  account: string;
}

export class SaleEmailAuthorizationMessageModel {
  PAYER_FIRST_NAME: string;
  PAYER_LAST_NAME: string;
  PAYER_COMPANY_NAME: string;
  PAYMENT_AMOUNT: string;
  SURCHARGE_AMOUNT: string;
  TOTAL_INCLUDING_SURCHARGE: string;
  NAME_ON_ACCOUNT: string;
  ROUTING_NUMBER: string;
  NAME_ON_CARD: string;
  EXP_DATE: string;
  LAST_4: string;
  SUBMIT_BUTTON_NAME: string;
  TERMS_OF_SERVICE: string;
  PRIVACY_STATEMENT: string;
}
