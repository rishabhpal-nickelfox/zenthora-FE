export enum ApiTokenRevokeStatusEnum {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED'
}

export const ApiTokenRevokeStatusName = new Map<string, string>([
  [ApiTokenRevokeStatusEnum.ACTIVE, 'Active'],
  [ApiTokenRevokeStatusEnum.REVOKED, 'Revoked']
]);
