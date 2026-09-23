export enum CreditCardEnum {
  UNKNOWN = 'UNKNOWN',
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  DISCOVER = 'DISCOVER',
  DINERS_CLUB = 'DINERS_CLUB',
  AMERICAN_DINERS_CLUB = 'AMERICAN_DINERS_CLUB',
  CARTE_BLANCHE = 'CARTE_BLANCHE',
  EN_ROUTE = 'EN_ROUTE',
  JCB = 'JCB'
}

export const CreditCardEnumValue = new Map<string, string>([
  [CreditCardEnum.UNKNOWN, 'Unknown'],
  [CreditCardEnum.MASTERCARD, 'MasterCard'],
  [CreditCardEnum.VISA, 'Visa'],
  [CreditCardEnum.AMERICAN_EXPRESS, 'American Express'],
  [CreditCardEnum.DISCOVER, 'Discover'],
  [CreditCardEnum.DINERS_CLUB, 'Diners Club'],
  [CreditCardEnum.AMERICAN_DINERS_CLUB, 'American Diners Club'],
  [CreditCardEnum.CARTE_BLANCHE, 'Carte Blanche'],
  [CreditCardEnum.EN_ROUTE, 'EnRoute'],
  [CreditCardEnum.JCB, 'JCB']
]);
