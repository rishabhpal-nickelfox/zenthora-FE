export enum EmailAddressTypeEnum {
  TO = 'TO', CC = 'CC', BCC = 'BCC'
}

export const EmailAddressTypeEnumValue = new Map<string, string>([
  [EmailAddressTypeEnum.TO, 'To'],
  [EmailAddressTypeEnum.CC, 'CC'],
  [EmailAddressTypeEnum.BCC, 'BCC']]);
