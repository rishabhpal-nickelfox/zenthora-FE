export enum VaultPaymentRequestTypeEnum {
  CCSALE_CHECKREQUEST = 'CCSALE_CHECKREQUEST',
  EMAILPAYCC_EMAILPAYACH = 'EMAILPAYCC_EMAILPAYACH',
}

export const VaultPaymentRequestTypeEnumValue = new Map<string, string>([
  [VaultPaymentRequestTypeEnum.CCSALE_CHECKREQUEST, 'ccsale and checkrequest'],
  [VaultPaymentRequestTypeEnum.EMAILPAYCC_EMAILPAYACH, 'emailpaycc and emailpayach'],
]);
