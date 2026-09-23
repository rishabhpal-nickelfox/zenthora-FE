
import {SaleAddressTemplateData} from "../sale/template/sale-email-template-data.model";
import {BillingAddress} from "./address.model";

export class AddressConverterModel {

  static convertSaleAddressTemplateDataToBillingAddress(addr: SaleAddressTemplateData): BillingAddress {
    return {
      firstName: addr?.firstName,
      lastName: addr?.lastName,
      companyName: addr?.companyName,
      address1: addr?.address1,
      address2: addr?.address2,
      city: addr?.city,
      zip: addr?.zip,
      state: addr?.state,
      country: addr?.country,
      phone: null,
      email: null
    }
  }
}
