import {AddressModel, convertJSONToAddress} from './address.model';
import {Mask} from '../../helpers/mask';
import {CountryISOEnum} from "../../enums/utils/country-iso.enum";

export class ContactInfoModel {
  mainPhone: string;
  workPhone: string;
  mobile: string;
  fax: string;
  ccEmail: string;
  billingAddress: AddressModel = new AddressModel(CountryISOEnum.US);
  isMailingAddressSameAsBilling = false;
  mailingAddress: AddressModel = new AddressModel(CountryISOEnum.US);
}


export function convertContactInfoToJSON(contactInfo: ContactInfoModel) {
  return {
    mainPhone: contactInfo && contactInfo.mainPhone ? Mask.unmaskPhone(contactInfo.mainPhone) : null,
    workPhone: contactInfo && contactInfo.workPhone ? Mask.unmaskPhone(contactInfo.workPhone) : null,
    mobile: contactInfo && contactInfo.mobile ? Mask.unmaskPhone(contactInfo.mobile) : null,
    fax: contactInfo && contactInfo.fax ? Mask.unmaskPhone(contactInfo.fax) : null,
    ccEmail: contactInfo.ccEmail,
    billingAddress: convertJSONToAddress(contactInfo.billingAddress),
    isMailingAddressSameAsBilling: contactInfo.isMailingAddressSameAsBilling,
    mailingAddress: contactInfo.isMailingAddressSameAsBilling ? null : convertJSONToAddress(contactInfo.mailingAddress)
  };
}

export function convertJSONToContactInfo(json) {
  const contactInfo = Object.assign(new ContactInfoModel(), json);
  if (contactInfo.isMailingAddressSameAsBilling) {
    contactInfo.mailingAddress = Object.assign({}, contactInfo.billingAddress);
  }
  return contactInfo;

}

