export enum SaleAdditionalInfoColumnsEnum {
  DUE_DATE = 'DUE_DATE',
  TERMS = 'TERMS',
  SALES_REP = 'SALES_REP',
  SHIP_DATE = 'SHIP_DATE',
  SHIP_METHOD = 'SHIP_METHOD',
  FOB = 'FOB',
  TRACKING_NUMBER = 'TRACKING_NUMBER',
  PO_NUMBER = 'PO_NUMBER',
  OTHER = 'OTHER',
}

export const SaleAdditionalInfoColumnsEnumValue = new Map<string, string>([
  [SaleAdditionalInfoColumnsEnum.DUE_DATE, 'Due Date'],
  [SaleAdditionalInfoColumnsEnum.TERMS, 'Terms'],
  [SaleAdditionalInfoColumnsEnum.SALES_REP, 'Sales Rep'],
  [SaleAdditionalInfoColumnsEnum.SHIP_DATE, 'Ship Date'],
  [SaleAdditionalInfoColumnsEnum.SHIP_METHOD, 'Ship Method'],
  [SaleAdditionalInfoColumnsEnum.FOB, 'FOB'],
  [SaleAdditionalInfoColumnsEnum.TRACKING_NUMBER, 'Tracking Number'],
  [SaleAdditionalInfoColumnsEnum.PO_NUMBER, 'PO Number'],
  [SaleAdditionalInfoColumnsEnum.OTHER, 'Other']
]);

export const SaleAdditionalAdvancedColumns = [SaleAdditionalInfoColumnsEnum.SHIP_METHOD, SaleAdditionalInfoColumnsEnum.FOB, SaleAdditionalInfoColumnsEnum.TRACKING_NUMBER, SaleAdditionalInfoColumnsEnum.SALES_REP, SaleAdditionalInfoColumnsEnum.SHIP_DATE, SaleAdditionalInfoColumnsEnum.OTHER];
