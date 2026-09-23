import {CountryISOEnum} from "../../enums/utils/country-iso.enum";

export class AddressModel {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: CountryISOEnum;

  constructor(country?: CountryISOEnum, zip?: string, state?: string, city?: string, street?: string) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
  }
}


export function convertJSONToAddress(json) {
  return Object.assign(new AddressModel(), json);
}

export function convertAddressToJSON(address: AddressModel) {
  return {
    street: address.street,
    city: address.city,
    state: address.state,
    zip: address.zip,
    country: address.country
  };
}


export interface BillingAddress {
  firstName:          string;
  lastName:           string;
  companyName:        string;
  address1:           string;
  address2:           string;
  city:               string;
  zip:                string;
  state:              string;
  country:            CountryISOEnum;
  phone:              string;
  email:              string;
}
