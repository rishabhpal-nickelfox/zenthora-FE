import {BillingAddress} from "../../common/address.model";

export interface PayWithPaymentDataRequest {
  paymentAmount:        number;
  surchargeAmount:      number;
  paymentMethod:        string;
  version:              number;
  creditCardData:       CreditCardData;
  achData:              AchData;
  authorizationMessage: string;
  controlAmountDue:       number;
}

export interface PayWithSavedPaymentMethodRequest {
  paymentAmount:        number;
  surchargeAmount:      number;
  version:              number;
  creditCardData:       ShortCreditCardData,
  authorizationMessage: string;
  controlAmountDue:     number;
}

export interface ShortCreditCardData {
  cvv:          string;
}

export interface CreditCardData {
  cardFullName:             string;
  cardNumber:               string;
  expiryMonth:              string;
  expiryYear:               string;
  cvv:                      string;
  creditCardBillingAddress: BillingAddress;
}

export interface AchData {
  nameOnAccount:            string;
  routing:                  string;
  account:                  string;
  billingAddress:           BillingAddress;
  accountType:              string;
}
