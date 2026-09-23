export enum CurrencyEnum {
  USD = 'USD',
  CAD = 'CAD'
}

export const CurrencyEnumValue = new Map<string, string>([
  [CurrencyEnum.USD, '$'],
  [CurrencyEnum.CAD, 'CAD ']
]);
