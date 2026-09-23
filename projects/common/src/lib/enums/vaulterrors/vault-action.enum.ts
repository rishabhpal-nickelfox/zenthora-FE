export enum VaultActionEnum {
  CLIENT_ADD = 'CLIENT_ADD',
  UPDATE_CLIENT_INFO = 'UPDATE_CLIENT_INFO',
  PAYMENT_TYPE_GET_FULL = 'PAYMENT_TYPE_GET_FULL',
  CC_SALE = 'CC_SALE',
  EMAILPAYCC = 'EMAILPAYCC',
  CC_PAYMENT_BY_ID = 'CC_PAYMENT_BY_ID',
  CLIENT_CC_ADD = 'CLIENT_CC_ADD',
  UPDATE_PAYMENT_CC = 'UPDATE_PAYMENT_CC',
  CC_PAYMENT_DEACTIVATE = 'CC_PAYMENT_DEACTIVATE',
  CHECK_REQUEST = 'CHECK_REQUEST',
  CHECK_PAYMENT_BY_ID = 'CHECK_PAYMENT_BY_ID',
  EMAILPAYACH = 'EMAILPAYACH',
  CHECK_PAYMENT_ADD = 'CHECK_PAYMENT_ADD',
  UPDATE_PAYMENT_CHECK = 'UPDATE_PAYMENT_CHECK',
  CHECK_PAYMENT_DEACTIVATE = 'CHECK_PAYMENT_DEACTIVATE',
  BRANDING = 'BRANDING'
}

export const VaultActionName = new Map<string, string>([
  [VaultActionEnum.CLIENT_ADD,              'Add Customer Info'],
  [VaultActionEnum.UPDATE_CLIENT_INFO,      'Update Customer Info'],
  [VaultActionEnum.PAYMENT_TYPE_GET_FULL,   'Get Payment Methods'],
  [VaultActionEnum.CC_SALE,                 'CC Payment'],
  [VaultActionEnum.CC_PAYMENT_BY_ID,        'CC Payment by ID'],
  [VaultActionEnum.EMAILPAYCC,              'CC Email Payment'],
  [VaultActionEnum.CLIENT_CC_ADD,           'Add CC Payment Method'],
  [VaultActionEnum.UPDATE_PAYMENT_CC,       'Update CC Payment Method'],
  [VaultActionEnum.CC_PAYMENT_DEACTIVATE,   'Delete CC Payment Method'],
  [VaultActionEnum.CHECK_REQUEST,           'ACH/EFT Payment'],
  [VaultActionEnum.CHECK_PAYMENT_BY_ID,     'ACH/EFT Payment by ID'],
  [VaultActionEnum.EMAILPAYACH,             'ACH Email Payment'],
  [VaultActionEnum.CHECK_PAYMENT_ADD,       'Add ACH/EFT Payment Method'],
  [VaultActionEnum.UPDATE_PAYMENT_CHECK,    'Update ACH/EFT Payment Method'],
  [VaultActionEnum.CHECK_PAYMENT_DEACTIVATE,'Delete ACH/EFT Payment Method'],
  [VaultActionEnum.BRANDING,                'Branding']
]);
