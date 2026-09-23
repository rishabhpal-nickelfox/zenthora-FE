import {PaymentMethodTypeEnum} from "../../enums/sale/payment-method-type.enum";
import {CreditCardEnum} from "../../enums/sale/credit-card.enum";
import {AccountTypeEnum} from "../../enums/sale/account-type.enum";
import {BillingAddress} from "../common/address.model";
import {PaymentMethodErrorEnum} from "../../enums/sale/payment-method-error.enum";
import {CreditCardModel} from "../sale/credit-card.model";
import {ACHModel} from "../sale/ach.model";
import {isDefined} from "../../helpers/object.helper";

export class CustomerPaymentMethod {
  id:                       number;
  type:                     PaymentMethodTypeEnum.ACH | PaymentMethodTypeEnum.CREDIT_CARD;
  customerDefault:          boolean;
  paymentDefault:           boolean;
  batchDefault:             boolean;
  isPrivate:                boolean;
  isCurrentUserOwner:       boolean;
  cardType?:                CreditCardEnum;
  isCredit?:                boolean;
  accountType?:             AccountTypeEnum;
  last4:                    string;
  expiryMonth?:             number;
  expiryYear?:              number;
  secCode?:                 string;
  name:                     string;
  billingAddress:           BillingAddress;
  routingNumber?:           string;
  errors:                   PaymentMethodErrorEnum[];


  static fromJSON(json): (CreditCardModel | ACHModel)[] {
    return (json ?? []).map(pm => <CustomerPaymentMethod>pm).map(pm => {
      if (isDefined(pm.cardType)) {
        return CreditCardModel.fromCustomerPaymentMethod(pm);
      } else if (isDefined(pm.accountType)) {
        return ACHModel.fromPayerPaymentMethod(pm);
      }
      return pm;
    });
  }
}
