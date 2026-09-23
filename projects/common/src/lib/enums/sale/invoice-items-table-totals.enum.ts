export enum InvoiceItemsTableTotalsEnum {
    SUBTOTAL = 'SUBTOTAL',
    TAX = 'TAX',
    DISCOUNT = 'DISCOUNT',
    SHIPPING_COST = 'SHIPPING_COST',
    TOTAL = 'TOTAL',
    APPLIED_AMOUNT = 'APPLIED_AMOUNT',
    AMOUNT_DUE = 'AMOUNT_DUE',
    TIP = 'TIP'
}

export const InvoiceItemsTableTotalsEnumValue = new Map<string, string>([
    [InvoiceItemsTableTotalsEnum.SUBTOTAL, 'Subtotal'],
    [InvoiceItemsTableTotalsEnum.TAX, 'Tax'],
    [InvoiceItemsTableTotalsEnum.DISCOUNT, 'Discount'],
    [InvoiceItemsTableTotalsEnum.SHIPPING_COST, 'Shipping Cost'],
    [InvoiceItemsTableTotalsEnum.TOTAL, 'Total'],
    [InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT, 'Applied Amount'],
    [InvoiceItemsTableTotalsEnum.AMOUNT_DUE, 'Amount Due'],
    [InvoiceItemsTableTotalsEnum.TIP, 'Tip']
]);

export const InvoiceItemsTableTotalsField = new Map<InvoiceItemsTableTotalsEnum, string>([
  [InvoiceItemsTableTotalsEnum.SUBTOTAL, 'subTotal'],
  [InvoiceItemsTableTotalsEnum.TAX, 'taxAmount'],
  [InvoiceItemsTableTotalsEnum.DISCOUNT, 'discount'],
  [InvoiceItemsTableTotalsEnum.SHIPPING_COST, 'shippingCost'],
  [InvoiceItemsTableTotalsEnum.TIP, 'tip'],
  [InvoiceItemsTableTotalsEnum.TOTAL, 'total'],
  [InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT, 'appliedAmount'],
  [InvoiceItemsTableTotalsEnum.AMOUNT_DUE, 'amountDue']
]);

export const InvoiceItemsTableTotalsOrdered: InvoiceItemsTableTotalsEnum[] = [
  InvoiceItemsTableTotalsEnum.SUBTOTAL,
  InvoiceItemsTableTotalsEnum.TAX,
  InvoiceItemsTableTotalsEnum.DISCOUNT,
  InvoiceItemsTableTotalsEnum.SHIPPING_COST,
  InvoiceItemsTableTotalsEnum.TIP,
  InvoiceItemsTableTotalsEnum.TOTAL,
  InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT,
  InvoiceItemsTableTotalsEnum.AMOUNT_DUE
];

export const InvoiceItemsTableTotalsLegacyOrdered: InvoiceItemsTableTotalsEnum[] = [
  InvoiceItemsTableTotalsEnum.SUBTOTAL,
  InvoiceItemsTableTotalsEnum.SHIPPING_COST,
  InvoiceItemsTableTotalsEnum.TIP,
  InvoiceItemsTableTotalsEnum.TAX,
  InvoiceItemsTableTotalsEnum.DISCOUNT,
  InvoiceItemsTableTotalsEnum.TOTAL,
  InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT,
  InvoiceItemsTableTotalsEnum.AMOUNT_DUE
];
