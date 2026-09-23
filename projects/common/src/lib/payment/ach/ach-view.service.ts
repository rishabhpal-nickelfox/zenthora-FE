import {EventEmitter, Injectable} from '@angular/core';
import {PaymentMethodViewModeEnum} from "../../enums/sale/payment-method-view-mode.enum";
import {CountryISO, CountryISOEnum, CountryISOShort} from "../../enums/utils/country-iso.enum";
import {BillingAddress} from "../../models/common/address.model";
import {USStateEnum, USStateEnumValue} from "../../enums/utils/us-state.enum";
import {CAStateEnum, CAStateEnumValue} from "../../enums/utils/ca-state.enum";
import {isDefined, ObjectHelper} from "../../helpers/object.helper";
import {guessCountryByState, resolveCountry} from "../../helpers/address.helper";

@Injectable({providedIn: "root"})
export class ACHViewService {

  modeChanged: EventEmitter<void> = new EventEmitter<void>();
  saveChanged: EventEmitter<void> = new EventEmitter<void>();
  private _mode: PaymentMethodViewModeEnum;

  private _autoSavePaymentMethods = false;
  private _canManagePaymentMethods = false;

  constructor() {
  }


  get mode(): PaymentMethodViewModeEnum {
    return this._mode;
  }

  set mode(value: PaymentMethodViewModeEnum) {
    this._mode = value;
    this.modeChanged.emit();
  }

  private _save = false;

  get save(): boolean {
    return this._save;
  }

  set save(value: boolean) {
    this._save = value;
    this.saveChanged.emit();
  }

  private _isCurrentUserOwner = false;

  set isCurrentUserOwner(value: boolean) {
    this._isCurrentUserOwner = value;
  }

  private _defaultAddress: BillingAddress;

  set defaultAddress(value: BillingAddress) {
    this._defaultAddress = value;
    this._defaultCountry = this.findDefaultCountry();
    this._defaultState = this.findDefaultState(this._defaultCountry);
  }

  get hasDefaultAddress(): boolean {
    if (ObjectHelper.isDefined(this._defaultAddress)) {
      return  Object.values(this._defaultAddress).some(
        (v) => {
          return ObjectHelper.isDefined(v);
        }
      );
    }
    return false;
  }

  private _defaultCountry: CountryISOEnum;

  get defaultCountry(): CountryISOEnum {
    return this._defaultCountry;
  }

  private _defaultState: USStateEnum | CAStateEnum;

  get defaultState(): USStateEnum | CAStateEnum {
    return this._defaultState;
  }

  get countries(): CountryISOEnum[] {
    return CountryISOShort;
  }

  get defaultFirstName() {
    return this._defaultAddress.firstName;
  }

  get defaultLastName() {
    return this._defaultAddress.lastName;
  }

  get defaultCompanyName() {
    return this._defaultAddress.companyName;
  }

  get defaultAddress1() {
    return this._defaultAddress.address1;
  }

  get defaultAddress2() {
    return this._defaultAddress.address2;
  }

  get defaultCity() {
    return this._defaultAddress.city;
  }

  get defaultZip() {
    return this._defaultAddress.zip;
  }

  get defaultPhone() {
    return this._defaultAddress.phone;
  }

  get defaultEmail() {
    return this._defaultAddress.email;
  }

  findDefaultState(defaultCountry: CountryISOEnum): USStateEnum | CAStateEnum {
    if (isDefined(this._defaultAddress.state)) {
      let stateEntry;
      if (defaultCountry == CountryISOEnum.US) {
        stateEntry = Array.from(USStateEnumValue.entries()).find(([key, value]) => key.toLowerCase() == this._defaultAddress.state.toLowerCase() || value.toLowerCase() == this._defaultAddress.state.toLowerCase());
      } else if (defaultCountry == CountryISOEnum.CA) {
        stateEntry = Array.from(CAStateEnumValue.entries()).find(([key, value]) => key.toLowerCase() == this._defaultAddress.state.toLowerCase() || value.toLowerCase() == this._defaultAddress.state.toLowerCase()) ?? null;
      }
      return stateEntry ? stateEntry[0] : null;
    }
    return null;
  }

  private findDefaultCountry(): CountryISOEnum {
    if (isDefined(this._defaultAddress?.country)) {
      const isoCountry = resolveCountry(this._defaultAddress?.country, this.countries.map(code => CountryISO.findByCode(code)));
      return isoCountry?.code ?? null;
    } else if (isDefined(this._defaultAddress?.state)) {
      return guessCountryByState(this._defaultAddress?.state) ?? null;
    }
    return CountryISOEnum.US;
  }

  showPrivate(savePaymentMethod: boolean): boolean {
    return this._isCurrentUserOwner && (this.mode == PaymentMethodViewModeEnum.CREATE && savePaymentMethod || this.mode != PaymentMethodViewModeEnum.CREATE);
  }

  get showSave(): boolean {
    return this._mode == PaymentMethodViewModeEnum.CREATE && !this._autoSavePaymentMethods && this._canManagePaymentMethods;
  }

  showDefault(savePaymentMethod: boolean): boolean {
    return this.mode == PaymentMethodViewModeEnum.CREATE && savePaymentMethod || this.mode != PaymentMethodViewModeEnum.CREATE;
  }

  set autoSavePaymentMethods(value: boolean) {
    this._autoSavePaymentMethods = value;
  }

  set canManagePaymentMethods(value: boolean) {
    this._canManagePaymentMethods = value;
  }
}
