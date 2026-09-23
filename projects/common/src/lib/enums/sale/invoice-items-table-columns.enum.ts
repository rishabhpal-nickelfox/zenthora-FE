export enum InvoiceItemsTableColumnsEnum {
  LINE_NUM = 'LINE_NUM',
  ITEM = 'ITEM',
  DESCRIPTION = 'DESCRIPTION',
  QTY = 'QTY',
  RATE = 'RATE',
  AMOUNT = 'AMOUNT',
  TAX = 'TAX',
  SKU = 'SKU',
  SERVICE_DATE = 'SERVICE_DATE',
  CATEGORY_CLASS = 'CATEGORY_CLASS',
  OTHER_1 = 'OTHER_1',
  OTHER_2 = 'OTHER_2'
}

export const InvoiceItemsTableColumnsEnumValue = new Map<string, string>([
  [InvoiceItemsTableColumnsEnum.LINE_NUM, 'Row Count'],
  [InvoiceItemsTableColumnsEnum.ITEM, 'Product/Service'],
  [InvoiceItemsTableColumnsEnum.DESCRIPTION, 'Description'],
  [InvoiceItemsTableColumnsEnum.QTY, 'QTY'],
  [InvoiceItemsTableColumnsEnum.RATE, 'Rate'],
  [InvoiceItemsTableColumnsEnum.AMOUNT, 'Amount'],
  [InvoiceItemsTableColumnsEnum.TAX, 'Tax'],
  [InvoiceItemsTableColumnsEnum.SKU, 'SKU'],
  [InvoiceItemsTableColumnsEnum.SERVICE_DATE, 'Service Date'],
  [InvoiceItemsTableColumnsEnum.CATEGORY_CLASS, 'Class'],
  [InvoiceItemsTableColumnsEnum.OTHER_1, 'Other 1'],
  [InvoiceItemsTableColumnsEnum.OTHER_2, 'Other 2']
]);

export const InvoiceItemsTableAdvancedColumns = [InvoiceItemsTableColumnsEnum.OTHER_1, InvoiceItemsTableColumnsEnum.OTHER_2, InvoiceItemsTableColumnsEnum.SERVICE_DATE, InvoiceItemsTableColumnsEnum.CATEGORY_CLASS, InvoiceItemsTableColumnsEnum.LINE_NUM];
