export enum PaymentStatusEnum {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export const PaymentStatusEnumValue = new Map<string, string>([
  [PaymentStatusEnum.PAID, 'Paid'],
  [PaymentStatusEnum.PARTIALLY_PAID, 'Partially Paid'],
  [PaymentStatusEnum.UNPAID, 'Unpaid'],
  [PaymentStatusEnum.CANCELLED, 'Cancelled'],
]);
