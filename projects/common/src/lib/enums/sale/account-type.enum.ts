export enum AccountTypeEnum {
  PERSONAL_CHECKING = 'PERSONAL_CHECKING',
  PERSONAL_SAVINGS = 'PERSONAL_SAVINGS',
  BUSINESS_CHECKING = 'BUSINESS_CHECKING',
  BUSINESS_SAVINGS = 'BUSINESS_SAVINGS',
}

export const AccountTypeEnumValue = new Map<string, string>([
  [AccountTypeEnum.PERSONAL_CHECKING, 'Personal Checking'],
  [AccountTypeEnum.PERSONAL_SAVINGS, 'Personal Savings'],
  [AccountTypeEnum.BUSINESS_CHECKING, 'Business Checking'],
  [AccountTypeEnum.BUSINESS_SAVINGS, 'Business Savings'],
]);
