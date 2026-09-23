export enum TextSearchTypeEnum {
  STARTS_WITH = 'STARTS_WITH',
  EQUALS = 'EQUALS',
  CONTAINS = 'CONTAINS'
}

export const TextSearchTypeEnumValue = new Map<string, string>([
  [TextSearchTypeEnum.STARTS_WITH, 'Starts with'],
  [TextSearchTypeEnum.EQUALS, 'Equals'],
  [TextSearchTypeEnum.CONTAINS, 'Contains'],
]);
