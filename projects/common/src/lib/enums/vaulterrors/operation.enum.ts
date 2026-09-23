export enum OperationEnum {
  PAY_INVOICE = 'PAY_INVOICE',
  BRANDING = 'BRANDING'
}

export const OperationName = new Map<string, string>([
  [OperationEnum.PAY_INVOICE, 'Payment'],
  [OperationEnum.BRANDING, 'Branding']
]);
