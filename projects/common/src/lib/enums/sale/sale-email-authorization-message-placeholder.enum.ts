export enum SaleEmailAuthorizationMessagePlaceholderEnum {
  PAYER_FIRST_NAME = "PAYER_FIRST_NAME",
  PAYER_LAST_NAME = "PAYER_LAST_NAME",
  PAYER_COMPANY_NAME = "PAYER_COMPANY_NAME",
  PAYMENT_AMOUNT = "PAYMENT_AMOUNT",
  SURCHARGE_AMOUNT = "SURCHARGE_AMOUNT",
  TOTAL_INCLUDING_SURCHARGE = "TOTAL_INCLUDING_SURCHARGE",
  NAME_ON_ACCOUNT = "NAME_ON_ACCOUNT",
  ROUTING_NUMBER = "ROUTING_NUMBER",
  NAME_ON_CARD = "NAME_ON_CARD",
  EXP_DATE = "EXP_DATE",
  LAST_4 = "LAST_4",
  SUBMIT_BUTTON_NAME = "SUBMIT_BUTTON_NAME",
  TERMS_OF_SERVICE = "TERMS_OF_SERVICE",
  PRIVACY_STATEMENT = "PRIVACY_STATEMENT"
}

export const SaleEmailAuthorizationMessagePlaceholderEnumValue = new Map<string, string>([
  [SaleEmailAuthorizationMessagePlaceholderEnum.PAYER_FIRST_NAME, "{PayerFirstName}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.PAYER_LAST_NAME, "{PayerLastName}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.PAYER_COMPANY_NAME, "{PayerCompanyName}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.PAYMENT_AMOUNT, "{PaymentAmount}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.SURCHARGE_AMOUNT, "{SurchargeAmount}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.TOTAL_INCLUDING_SURCHARGE, "{TotalIncludingSurcharge}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.NAME_ON_ACCOUNT, "{NameOnAccount}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.ROUTING_NUMBER, "{RoutingNumber}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.NAME_ON_CARD, "{NameOnCard}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.EXP_DATE, "{ExpDate}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.LAST_4, "{Last4}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.SUBMIT_BUTTON_NAME, "{SubmitButtonName}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.TERMS_OF_SERVICE, "{TermsOfService}"],
  [SaleEmailAuthorizationMessagePlaceholderEnum.PRIVACY_STATEMENT, "{PrivacyStatement}"],
])
