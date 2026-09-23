export enum SaleTotalsRowsEnum {
  DUE_DATE = 'DUE_DATE',
  SUBTOTAL = 'SUBTOTAL',
  TAX = 'TAX',
  DISCOUNT = 'DISCOUNT',
  SHIPPING_COST = 'SHIPPING_COST',
  TIP = 'TIP',
  APPLIED_AMOUNT = 'APPLIED_AMOUNT',
  AMOUNT_DUE = 'AMOUNT_DUE'
}

export const SaleTotalsRowsEnumValue = new Map<string, string>([
  [SaleTotalsRowsEnum.DUE_DATE, 'Due Date'],
  [SaleTotalsRowsEnum.SUBTOTAL, 'Subtotal'],
  [SaleTotalsRowsEnum.TAX, 'Tax'],
  [SaleTotalsRowsEnum.DISCOUNT, 'Discount'],
  [SaleTotalsRowsEnum.SHIPPING_COST, 'Shipping Cost'],
  [SaleTotalsRowsEnum.TIP, 'Tip'],
  [SaleTotalsRowsEnum.APPLIED_AMOUNT, 'Applied Amount'],
  [SaleTotalsRowsEnum.AMOUNT_DUE, 'Amount Due']
]);
