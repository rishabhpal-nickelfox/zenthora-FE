export enum DocTypeEnum {
  INVOICE = 'INVOICE',
  SALES_ORDER = 'SALES_ORDER',
  DEPOSIT = 'DEPOSIT',
  PAYMENT_FORM = 'PAYMENT_FORM'
}

export const DocTypeEnumValue = new Map<string, string>([
  [DocTypeEnum.INVOICE, 'Invoice'],
  [DocTypeEnum.SALES_ORDER, 'Sales Order'],
  [DocTypeEnum.DEPOSIT, 'Deposit'],
  [DocTypeEnum.PAYMENT_FORM, 'Payment Form']
]);
