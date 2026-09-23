export enum PaymentSourceEnum {
  EPS = 'EPS',
  MERCHANT = 'MERCHANT',
  CUSTOMER_PORTAL = 'CUSTOMER_PORTAL',
  BY_EMAIL_CHECKOUT_PAGE = 'BY_EMAIL_CHECKOUT_PAGE',
  PAYMENT_FORM = 'PAYMENT_FORM'
}

export const PaymentSourceEnumValue = new Map<string, string>([
  [PaymentSourceEnum.EPS, 'Online'],
  [PaymentSourceEnum.MERCHANT, 'Merchant'],
  [PaymentSourceEnum.CUSTOMER_PORTAL, 'Customer Portal'],
  [PaymentSourceEnum.BY_EMAIL_CHECKOUT_PAGE, 'Email'],
  [PaymentSourceEnum.PAYMENT_FORM, 'Payment Form']
]);
