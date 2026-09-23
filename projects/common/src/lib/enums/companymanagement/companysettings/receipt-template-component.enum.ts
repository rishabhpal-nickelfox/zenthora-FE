export enum ReceiptTemplateComponentEnum {
  COMPANY_INFO = 'COMPANY_INFO',
  SALE_INFO = 'SALE_INFO',
  PAYMENT_INFO = 'PAYMENT_INFO',
  SIGNATURE = 'SIGNATURE',
  MESSAGE = 'MESSAGE',
}


export const ReceiptTemplateComponentEnumLabel: Record<ReceiptTemplateComponentEnum, string> = {
  [ReceiptTemplateComponentEnum.COMPANY_INFO]: 'Company Info',
  [ReceiptTemplateComponentEnum.SALE_INFO]: 'Sale Info',
  [ReceiptTemplateComponentEnum.PAYMENT_INFO]: 'Payment Info',
  [ReceiptTemplateComponentEnum.SIGNATURE]: 'Signature',
  [ReceiptTemplateComponentEnum.MESSAGE]: 'Message',
};
