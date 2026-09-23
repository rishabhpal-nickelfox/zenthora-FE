export enum CAStateEnum {
  'NL' = 'NL',
  'PE' = 'PE',
  'NS' = 'NS',
  'NB' = 'NB',
  'QC' = 'QC',
  'ON' = 'ON',
  'MB' = 'MB',
  'SK' = 'SK',
  'AB' = 'AB',
  'BC' = 'BC',
  'YT' = 'YT',
  'NT' = 'NT',
  'NU' = 'NU'
}

export const CAStateEnumValue = new Map<string, string>([
  [CAStateEnum.NL, 'Newfoundland and Labrador'],
  [CAStateEnum.PE, 'Prince Edward Island'],
  [CAStateEnum.NS, 'Nova Scotia'],
  [CAStateEnum.NB, 'New Brunswick'],
  [CAStateEnum.QC, 'Quebec'],
  [CAStateEnum.ON, 'Ontario'],
  [CAStateEnum.MB, 'Manitoba'],
  [CAStateEnum.SK, 'Saskatchewan'],
  [CAStateEnum.AB, 'Alberta'],
  [CAStateEnum.BC, 'British Columbia'],
  [CAStateEnum.YT, 'Yukon'],
  [CAStateEnum.NT, 'Northwest Territories'],
  [CAStateEnum.NU, 'Nunavut']
]);
