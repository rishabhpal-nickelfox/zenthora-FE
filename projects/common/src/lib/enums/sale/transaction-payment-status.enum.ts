export enum TransactionPaymentStatusEnum {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export const TransactionPaymentStatusEnumValue = new Map<string, string>([
  [TransactionPaymentStatusEnum.SUCCESS, 'Success'],
  [TransactionPaymentStatusEnum.FAILED, 'Failed']
]);

