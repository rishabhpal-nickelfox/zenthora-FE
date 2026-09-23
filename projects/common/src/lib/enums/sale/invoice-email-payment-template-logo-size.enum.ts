export enum InvoiceEmailPaymentTemplateLogoSizeEnum {
  REAL = 'REAL',
  S = 'S',
  M = 'M',
  L = 'L'
}

export const InvoiceEmailPaymentTemplateLogoSizeEnumName = new Map<string, string>([
  [InvoiceEmailPaymentTemplateLogoSizeEnum.REAL, 'Real'],
  [InvoiceEmailPaymentTemplateLogoSizeEnum.S, 'Small'],
  [InvoiceEmailPaymentTemplateLogoSizeEnum.M, 'Medium'],
  [InvoiceEmailPaymentTemplateLogoSizeEnum.L, 'Large']
]);

export function getInvoiceEmailPaymentTemplateLogoWidth(
  value?: InvoiceEmailPaymentTemplateLogoSizeEnum | string
): string {
  switch (value) {
    case InvoiceEmailPaymentTemplateLogoSizeEnum.REAL:
      return '100%';
    case InvoiceEmailPaymentTemplateLogoSizeEnum.M:
      return '300px';
    case InvoiceEmailPaymentTemplateLogoSizeEnum.L:
      return '600px';
    case InvoiceEmailPaymentTemplateLogoSizeEnum.S:
      return '185px';
    default:
      return '100%';
  }
}
