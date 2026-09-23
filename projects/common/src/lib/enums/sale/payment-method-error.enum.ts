export enum PaymentMethodErrorEnum {
  DOES_NOT_CURRENTLY_SUPPORT_GLOBAL_PAYMENTS = 'DOES_NOT_CURRENTLY_SUPPORT_GLOBAL_PAYMENTS',
  SOMETHING_WENT_WRONG = 'SOMETHING_WENT_WRONG'
}

export const PaymentMethodErrorEnumValue = new Map<PaymentMethodErrorEnum, (any?) => string>([
  [PaymentMethodErrorEnum.DOES_NOT_CURRENTLY_SUPPORT_GLOBAL_PAYMENTS, (companyName) => `${companyName} does not currently support Global Payments.
Please use a card issued in US or Canada.`],
  [PaymentMethodErrorEnum.SOMETHING_WENT_WRONG, () => 'Something went wrong']]);
