export enum PaymentFormControlType {
  LOGO = 'LOGO',
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  INPUT = 'INPUT',
  DATE = 'DATE',
  SELECT = 'SELECT',
  TEXTAREA = 'TEXTAREA'
}

export const PaymentFormControlTypeValue = new Map<PaymentFormControlType, string>([
  [PaymentFormControlType.LOGO, 'Logo'],
  [PaymentFormControlType.IMAGE, 'Image'],
  [PaymentFormControlType.TEXT, 'Text'],
  [PaymentFormControlType.INPUT, 'Input'],
  [PaymentFormControlType.DATE, 'Date'],
  [PaymentFormControlType.SELECT, 'Select'],
  [PaymentFormControlType.TEXTAREA, 'Textarea']
]);
