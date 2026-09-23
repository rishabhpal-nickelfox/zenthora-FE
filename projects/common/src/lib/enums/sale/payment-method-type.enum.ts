export enum PaymentMethodTypeEnum {
    CREDIT_CARD = 'CREDIT_CARD',
    ACH = 'ACH'
}

export const PaymentMethodTypeEnumValue = new Map<string, string>([
  [PaymentMethodTypeEnum.CREDIT_CARD, 'Credit Card'],
  [PaymentMethodTypeEnum.ACH, 'ACH']
]);

