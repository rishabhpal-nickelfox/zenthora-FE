import {AccountTypeEnum} from "../../enums/sale/account-type.enum";
import {CustomerPaymentMethod} from "../payer/payer-payment-method.model";
import {CountryISOEnum} from "../../enums/utils/country-iso.enum";
import {PaymentMethodErrorEnum} from "../../enums/sale/payment-method-error.enum";
import {Mask} from "../../helpers/mask";
import {getValueOrNull} from "../../helpers/string.helper";

export class ACHModel {
  name: string = null;
  routingNumber: string = null
  accountNumber: string = null
  accountType: AccountTypeEnum = null
  secCode?: string = null
  companyName: string = null
  firstName: string = null
  lastName: string = null
  address1: string = null
  address2: string = null
  city: string = null
  state: string = null
  zip: string = null
  country: CountryISOEnum = null
  phone: string = null
  email: string = null
  id?: number = null
  customerDefault = false;
  paymentDefault = false;
  batchDefault = false;
  isPrivate = true;
  isCurrentUserOwner = false;
  errors?: PaymentMethodErrorEnum[] = [];

  constructor() {
  }

  static toJSON(ach: ACHModel) {
    const json: any = {
      id: ach.id,
      nameOnAccount: ach.name,
      routing: ach.country == CountryISOEnum.CA ? Mask.removeMask(ach.routingNumber) : ach.routingNumber,
      account: ach.accountNumber,
      billingAddress: {
        companyName: getValueOrNull(ach.companyName),
        firstName: getValueOrNull(ach.firstName),
        lastName: getValueOrNull(ach.lastName),
        address1: getValueOrNull(ach.address1),
        address2: getValueOrNull(ach.address2),
        city: getValueOrNull(ach.city),
        zip: getValueOrNull(ach.zip),
        state: getValueOrNull(ach.state),
        country: getValueOrNull(ach.country),
        phone: getValueOrNull(ach.phone),
        email: getValueOrNull(ach.email)
      },
      secCode: 'WEB',
      accountType: ach.accountType,
      customerDefault: ach.customerDefault,
      paymentDefault: ach.paymentDefault,
      batchDefault: ach.batchDefault
    };
    if (ach.isCurrentUserOwner) {
      json.isPrivate = ach.isPrivate;
    }
    return json;
  }


  static fromPayerPaymentMethod(paymentMethod: CustomerPaymentMethod): ACHModel {
    const ach = new ACHModel();

    ach.id = paymentMethod.id;
    ach.name = paymentMethod.name;
    ach.accountNumber = `****${paymentMethod.last4}`;
    ach.routingNumber = Mask.removeMask(paymentMethod.routingNumber);
    ach.accountType = paymentMethod.accountType;

    ach.companyName = paymentMethod.billingAddress.companyName;
    ach.firstName = paymentMethod.billingAddress.firstName;
    ach.lastName = paymentMethod.billingAddress.lastName;
    ach.address1 = paymentMethod.billingAddress.address1;
    ach.address2 = paymentMethod.billingAddress.address2;
    ach.city = paymentMethod.billingAddress.city;
    ach.state = paymentMethod.billingAddress.state;
    ach.zip = paymentMethod.billingAddress.zip;
    ach.country = paymentMethod.billingAddress.country;
    ach.phone = paymentMethod.billingAddress.phone;
    ach.email = paymentMethod.billingAddress.email;
    ach.errors = paymentMethod.errors;

    ach.customerDefault = paymentMethod.customerDefault;
    ach.paymentDefault = paymentMethod.paymentDefault;
    ach.batchDefault = paymentMethod.batchDefault;
    ach.isPrivate = paymentMethod.isPrivate;
    ach.isCurrentUserOwner = paymentMethod.isCurrentUserOwner;
    return ach;
  }
}

