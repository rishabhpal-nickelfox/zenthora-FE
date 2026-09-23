export enum InvoiceEmailPaymentLineStyleEnum {
  SOLID = 'SOLID',
  DOTTED = 'DOTTED',
  DASHED = 'DASHED',
  DOUBLE = 'DOUBLE'
}

export const InvoiceEmailPaymentLineStyleEnumValue = new Map<string, string>([
  [InvoiceEmailPaymentLineStyleEnum.SOLID, 'Solid'],
  [InvoiceEmailPaymentLineStyleEnum.DOTTED, 'Dotted'],
  [InvoiceEmailPaymentLineStyleEnum.DASHED, 'Dashed'],
  [InvoiceEmailPaymentLineStyleEnum.DOUBLE, 'Double']
]);
