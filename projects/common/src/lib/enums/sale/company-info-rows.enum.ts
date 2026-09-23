export enum CompanyInfoRowsEnum {
  DISPLAY_NAME = 'DISPLAY_NAME',
  COUNTRY = 'COUNTRY',
  ZIP = 'ZIP',
  STATE = 'STATE',
  CITY = 'CITY',
  STREET = 'STREET',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  WEB_URL = 'WEB_URL',
}

export const CompanyInfoRowsEnumValue = new Map<string, string>([
  [CompanyInfoRowsEnum.DISPLAY_NAME, 'Display Name'],
  [CompanyInfoRowsEnum.COUNTRY, 'Country'],
  [CompanyInfoRowsEnum.ZIP, 'Zip'],
  [CompanyInfoRowsEnum.STATE, 'State'],
  [CompanyInfoRowsEnum.CITY, 'City'],
  [CompanyInfoRowsEnum.STREET, 'Street'],
  [CompanyInfoRowsEnum.EMAIL, 'Email'],
  [CompanyInfoRowsEnum.PHONE, 'Phone'],
  [CompanyInfoRowsEnum.WEB_URL, 'Website'],
]);
