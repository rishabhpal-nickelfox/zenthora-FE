export enum ReceiptPrintWidthEnum {
  PX185 = 'PX185',
  LETTER = 'LETTER'
}

export const ReceiptPrintWidthEnumLabel = new Map<string, string>([
  [ReceiptPrintWidthEnum.PX185, '185px width'],
  [ReceiptPrintWidthEnum.LETTER, 'Letter']
]);

export const ReceiptPrintWidthEnumValue = new Map<string, string>([
  [ReceiptPrintWidthEnum.PX185, '185px'],
  [ReceiptPrintWidthEnum.LETTER, '8.5in']
]);
