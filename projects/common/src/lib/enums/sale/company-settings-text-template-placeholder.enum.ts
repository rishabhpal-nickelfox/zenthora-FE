import {CompanyInfoRowsEnum, CompanyInfoRowsEnumValue} from "./company-info-rows.enum";

enum CompanySettingsTextTemplatePlaceholderEnum {
  CUSTOMER_NAME = "{CustomerName}",
  TOTAL = "{Total}",
  TERMS = "{Terms}",
  DUE_DATE = "{DueDate}",
  SHIPPING_COST = "{ShippingCost}",
  SHIP_DATE = "{ShipDate}",
  AMOUNT_DUE = "{AmountDue}",
  SHIP_METHOD = "{ShipMethod}",
  FOB = "{FOB}",
  PO_NUMBER = "{PoNumber}",
  CUSTOMER_NUMBER = "{CustomerNumber}"
}

const COMPANY_INFO_PLACEHOLDERS = Object.values(CompanyInfoRowsEnum).reduce(
  (acc, key) => {
    acc[key] = `{Company${key.charAt(0)}${key.slice(1).toLowerCase()}}`;
    return acc;
  },
  {} as Record<CompanyInfoRowsEnum, string>
);

export const ExtendedCompanySettingsTextTemplatePlaceholderEnum = {
  ...CompanySettingsTextTemplatePlaceholderEnum,
  ...COMPANY_INFO_PLACEHOLDERS,
} as const;


export const ExtendedCompanySettingsTextTemplatePlaceholderEnumValue = new Map<string, string>([
  [CompanySettingsTextTemplatePlaceholderEnum.CUSTOMER_NAME, "Customer Name"],
  [CompanySettingsTextTemplatePlaceholderEnum.TOTAL, "Total"],
  [CompanySettingsTextTemplatePlaceholderEnum.TERMS, "Terms"],
  [CompanySettingsTextTemplatePlaceholderEnum.DUE_DATE, "Due Date"],
  [CompanySettingsTextTemplatePlaceholderEnum.SHIPPING_COST, "Shipping Cost"],
  [CompanySettingsTextTemplatePlaceholderEnum.SHIP_DATE, "Ship Date"],
  [CompanySettingsTextTemplatePlaceholderEnum.AMOUNT_DUE, "Amount Due"],
  [CompanySettingsTextTemplatePlaceholderEnum.SHIP_METHOD, "Ship Method"],
  [CompanySettingsTextTemplatePlaceholderEnum.FOB, "FOB"],
  [CompanySettingsTextTemplatePlaceholderEnum.PO_NUMBER, "PO Number"],
  [CompanySettingsTextTemplatePlaceholderEnum.CUSTOMER_NUMBER, "Customer Number"],
  ...Object.entries(COMPANY_INFO_PLACEHOLDERS).map(([key, placeholder]) => [
    placeholder,
    `Company ${CompanyInfoRowsEnumValue.get(key as CompanyInfoRowsEnum)}`,
  ] as [string, string])
]);
