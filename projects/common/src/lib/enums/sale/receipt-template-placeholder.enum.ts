import {CompanyInfoRowsEnum, CompanyInfoRowsEnumValue} from './company-info-rows.enum';

export const ReceiptTemplatePlaceholderEnumValue = new Map<string, string>([
  ['{CustomerName}', 'Customer Name'],
  ['{CustomerNumber}', 'Customer Number'],
  ...Object.entries({
    [CompanyInfoRowsEnum.DISPLAY_NAME]: '{CompanyDisplayName}',
    [CompanyInfoRowsEnum.COUNTRY]: '{CompanyCountry}',
    [CompanyInfoRowsEnum.ZIP]: '{CompanyZip}',
    [CompanyInfoRowsEnum.STATE]: '{CompanyState}',
    [CompanyInfoRowsEnum.CITY]: '{CompanyCity}',
    [CompanyInfoRowsEnum.STREET]: '{CompanyStreet}',
    [CompanyInfoRowsEnum.EMAIL]: '{CompanyEmail}',
    [CompanyInfoRowsEnum.PHONE]: '{CompanyPhone}',
    [CompanyInfoRowsEnum.WEB_URL]: '{CompanyWebUrl}',
  }).map(([key, placeholder]) => [
    placeholder,
    `Company ${CompanyInfoRowsEnumValue.get(key as CompanyInfoRowsEnum)}`,
  ] as [string, string])
]);
