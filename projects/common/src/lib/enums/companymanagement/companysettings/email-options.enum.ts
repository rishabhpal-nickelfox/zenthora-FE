export enum EmailOptionsEnum {
  SALES = 'SALES',
  RECEIPTS = 'RECEIPTS'
}

export const EmailOptionsEnumValue = new Map<string, string>([
  [EmailOptionsEnum.SALES, 'Email Sales (Invoices, Sales Orders, Deposit)'],
  [EmailOptionsEnum.RECEIPTS, 'Email Receipt Upon Payment']
]);
