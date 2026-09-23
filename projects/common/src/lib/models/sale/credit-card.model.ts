import * as moment from 'moment';
import {CustomerPaymentMethod} from "../payer/payer-payment-method.model";
import {CountryISO} from "../../enums/utils/country-iso.enum";
import {PaymentMethodErrorEnum} from "../../enums/sale/payment-method-error.enum";
import {Mask} from "../../helpers/mask";
import { isDefined } from '../../helpers/object.helper';
import {getValueOrNull, isEmptyString} from "../../helpers/string.helper";
import {CreditCardEnum} from "../../enums/sale/credit-card.enum";

export class CreditCardModel {
  number: string = null;
  holder: string = null
  date: string = null
  cvv: string = null
  cardType = CreditCardEnum.UNKNOWN
  companyName: string = null
  firstName: string = null
  lastName: string = null
  address1: string = null
  address2: string = null
  city: string = null
  state: string = null
  zip: string = null
  country: CountryISO = null
  phone: string = null
  email: string = null
  id?: number = null
  customerDefault = false;
  paymentDefault = false;
  batchDefault = false;
  isPrivate = true;
  isCurrentUserOwner = false;
  isCredit = false;
  errors?: PaymentMethodErrorEnum[] = [];

  constructor() {
  }

  static toJSON(creditCard: CreditCardModel) {
    const json: any = {
      id: creditCard.id,
      cardFullName: creditCard.holder,
      cardNumber: Mask.unmaskCreditCardNumber(creditCard.number),
      expiryMonth: moment(creditCard.date, 'MM/YY').format('MM'),
      expiryYear: moment(creditCard.date, 'MM/YY').format('YY'),
      cvv: getValueOrNull(creditCard.cvv),
      cardType: creditCard.cardType,
      isCredit: creditCard.isCredit,
      creditCardBillingAddress: {
        companyName: getValueOrNull(creditCard.companyName),
        firstName: getValueOrNull(creditCard.firstName),
        lastName: getValueOrNull(creditCard.lastName),
        address1: getValueOrNull(creditCard.address1),
        address2: getValueOrNull(creditCard.address2),
        city: getValueOrNull(creditCard.city),
        zip: getValueOrNull(creditCard.zip),
        state: getValueOrNull(creditCard.state),
        country: getValueOrNull(creditCard.country.code),
        phone: getValueOrNull(creditCard.phone),
        email: getValueOrNull(creditCard.email)
      },
      customerDefault: creditCard.customerDefault,
      paymentDefault: creditCard.paymentDefault,
      batchDefault: creditCard.batchDefault
    };
    if (creditCard.isCurrentUserOwner) {
      json.isPrivate = creditCard.isPrivate;
    }
    return json;
  }

  static fromCustomerPaymentMethod(paymentMethod: CustomerPaymentMethod): CreditCardModel {
    const creditCard = new CreditCardModel();

    creditCard.id = paymentMethod.id;
    creditCard.number = `****${paymentMethod.last4}`;

    creditCard.holder = paymentMethod.name;
    creditCard.date = paymentMethod.expiryYear ? moment(paymentMethod.expiryYear, 'YY').month(paymentMethod.expiryMonth - 1).format('MM/YY') : null;
    creditCard.cardType = paymentMethod.cardType;
    creditCard.isCredit = paymentMethod.isCredit;

    creditCard.companyName = paymentMethod.billingAddress.companyName;
    creditCard.firstName= paymentMethod.billingAddress.firstName;
    creditCard.lastName = paymentMethod.billingAddress.lastName;
    creditCard.address1= paymentMethod.billingAddress.address1;
    creditCard.address2= paymentMethod.billingAddress.address2;
    creditCard.city= paymentMethod.billingAddress.city;
    creditCard.state= paymentMethod.billingAddress.state;
    creditCard.zip= paymentMethod.billingAddress.zip;
    creditCard.country = CountryISO.findByCode(paymentMethod.billingAddress.country);
    creditCard.phone = paymentMethod.billingAddress.phone;
    creditCard.email= paymentMethod.billingAddress.email;
    creditCard.errors = paymentMethod.errors;

    creditCard.customerDefault = paymentMethod.customerDefault;
    creditCard.paymentDefault = paymentMethod.paymentDefault;
    creditCard.batchDefault = paymentMethod.batchDefault;
    creditCard.isPrivate = paymentMethod.isPrivate;
    creditCard.isCurrentUserOwner = paymentMethod.isCurrentUserOwner;
    return creditCard;
  }

}

export class CreditCardTypeResponseModel {
  creditCardType: CreditCardEnum;
  isCredit: boolean;
}
