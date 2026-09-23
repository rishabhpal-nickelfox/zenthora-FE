export enum SecCodeEnum {
  PPD = 'PPD',
  CCD = 'CCD',
  TEL = 'TEL'
}

export const SecCodeEnumValue = new Map<string, string>([
  [SecCodeEnum.PPD, 'PPD'],
  [SecCodeEnum.CCD, 'CCD'],
  [SecCodeEnum.TEL, 'TEL'],
]);
