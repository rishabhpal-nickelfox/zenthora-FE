export enum TransactionPaymentMethodEnum {
  CREDIT_CARD = 'CREDIT_CARD',
  ACH = 'ACH',
  CASH = 'CASH',
  CHECK = 'CHECK',
  GIFT_CARD = 'GIFT_CARD',
  OTHER = 'OTHER'
}

export const TransactionPaymentMethodEnumValue = new Map<string, string>([
  [TransactionPaymentMethodEnum.CREDIT_CARD, 'Credit Card'],
  [TransactionPaymentMethodEnum.ACH, 'ACH'],
  [TransactionPaymentMethodEnum.CASH, 'Cash'],
  [TransactionPaymentMethodEnum.CHECK, 'Check'],
  [TransactionPaymentMethodEnum.GIFT_CARD, 'Gift Card'],
  [TransactionPaymentMethodEnum.OTHER, 'Other']
]);
