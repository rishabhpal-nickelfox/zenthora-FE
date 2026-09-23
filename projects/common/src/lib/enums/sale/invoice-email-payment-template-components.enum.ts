export enum InvoiceEmailPaymentTemplateComponentsEnum {
  COMPANY_INFO = 'COMPANY_INFO',
  BILLING_ADDRESS = 'BILLING_ADDRESS',
  SHIPPING_ADDRESS = 'SHIPPING_ADDRESS',
  SHIPPING_INFO = 'SHIPPING_INFO',
  LOGO = 'LOGO',
  SALE_SHORT_INFO = 'SALE_SHORT_INFO',
  SALE_ADDITIONAL = 'SALE_ADDITIONAL',
  ITEMS = 'ITEMS',
  ITEMS_ROWS = 'ITEMS_ROWS',
  TOTALS = 'TOTALS',
  CUSTOM_FIELDS = 'CUSTOM_FIELDS',
  SALE_FULL_INFO = 'SALE_FULL_INFO',
  CUSTOMER_MEMO = 'CUSTOMER_MEMO',
  CUSTOMER_NAME = 'CUSTOMER_NAME',
  TEXT = 'TEXT',
  LINE = 'LINE'
}

export const InvoiceEmailPaymentTemplateComponentsEnumValue = new Map<string, string>([
  [InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO, 'Company Info'],
  [InvoiceEmailPaymentTemplateComponentsEnum.BILLING_ADDRESS, 'Billing Address'],
  [InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS, 'Shipping Address'],
  [InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO, 'Shipping Info'],
  [InvoiceEmailPaymentTemplateComponentsEnum.SALE_FULL_INFO, 'Full Info'],
  [InvoiceEmailPaymentTemplateComponentsEnum.SALE_SHORT_INFO, 'Short Info'],
  [InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL, 'Additional Info'],
  [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS, 'Items Table'],
  [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS, 'Items Rows'],
  [InvoiceEmailPaymentTemplateComponentsEnum.TOTALS, 'Items Totals'],
  [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS, 'Custom Fields'],
  [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_MEMO, 'Customer Memo'],
  [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME, 'Customer Name'],
  [InvoiceEmailPaymentTemplateComponentsEnum.LOGO, 'Logo'],
  [InvoiceEmailPaymentTemplateComponentsEnum.TEXT, 'Text'],
  [InvoiceEmailPaymentTemplateComponentsEnum.LINE, 'Line']
]);

export const InvoiceEmailPaymentTemplateComponentsWithDynamicHeight = [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS, InvoiceEmailPaymentTemplateComponentsEnum.ITEMS, InvoiceEmailPaymentTemplateComponentsEnum.TOTALS];
export const InvoiceEmailPaymentTemplateComponentsMultiple = [InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO,
  InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL,
  InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME,
  InvoiceEmailPaymentTemplateComponentsEnum.LINE,
  InvoiceEmailPaymentTemplateComponentsEnum.TEXT];
