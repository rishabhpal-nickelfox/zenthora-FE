export enum VaultFeatureAvailabilityEnum {
  AVAILABLE_BY_DEFAULT = 'AVAILABLE_BY_DEFAULT',
  REQUIRES_VAULT_FEATURE_NAME = 'REQUIRES_VAULT_FEATURE_NAME'
}


export const VaultFeatureAvailabilityEnumValue = new Map<string, string>([
  [VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT, 'Available by Default'],
  [VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME, 'Requires Vault Feature']
]);
