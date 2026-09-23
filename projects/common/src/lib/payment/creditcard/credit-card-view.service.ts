import {EventEmitter, Injectable} from '@angular/core';
import {PaymentMethodViewModeEnum} from "../../enums/sale/payment-method-view-mode.enum";
import {CountryISO, CountryISOEnum, CountryISOShort, CountryISOValues} from "../../enums/utils/country-iso.enum";
import {BillingAddress} from "../../models/common/address.model";
import {USStateEnum, USStateEnumValue} from "../../enums/utils/us-state.enum";
import {CAStateEnum, CAStateEnumValue} from "../../enums/utils/ca-state.enum";
import {deepEqual, isDefined, ObjectHelper} from "../../helpers/object.helper";
import {guessCountryByState, resolveCountry} from "../../helpers/address.helper";

@Injectable({providedIn: "root"})
export class CreditCardViewService {


  constructor() {
  }

  modeChanged: EventEmitter<void> = new EventEmitter<void>();
  saveChanged: EventEmitter<void> = new EventEmitter<void>();

  private _mode: PaymentMethodViewModeEnum;

  private _autoSavePaymentMethods = false;
  private _canManagePaymentMethods = false;

  get mode(): PaymentMethodViewModeEnum {
    return this._mode;
  }

  set mode(value: PaymentMethodViewModeEnum) {
    this._mode = value;
    this.modeChanged.emit();
  }


  showDefault(savePaymentMethod: boolean): boolean {
    return this.mode == PaymentMethodViewModeEnum.CREATE && savePaymentMethod || this.mode != PaymentMethodViewModeEnum.CREATE;
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

  showPrivate(savePaymentMethod: boolean): boolean {
    return this._isCurrentUserOwner && (this.mode == PaymentMethodViewModeEnum.CREATE && savePaymentMethod || this.mode != PaymentMethodViewModeEnum.CREATE);
  }

  private _globalPaymentsEnabled: boolean;

  get globalPaymentsEnabled(): boolean {
    return this._globalPaymentsEnabled;
  }

  set globalPaymentsEnabled(value: boolean) {
    this._globalPaymentsEnabled = value;
  }

  get countries(): CountryISO[] {
    if (this._globalPaymentsEnabled) {
      return CountryISOValues;
    } else {
      return CountryISOShort.map(c => {
        const countryIso = CountryISOValues.find(country => c == country.code);
        return {
          code: countryIso?.code,
          code3: countryIso?.code3,
          name: countryIso?.name
        }
      });
    }
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

  private _defaultCountry: CountryISO;

  get defaultCountry(): CountryISO {
    return this._defaultCountry;
  }

  private _defaultState: USStateEnum | CAStateEnum;

  get defaultState(): USStateEnum | CAStateEnum {
    return this._defaultState;
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

  get defaultPhone(): string {
    return this._defaultAddress.phone;
  }

  get defaultEmail(): string {
    return this._defaultAddress.email;
  }

  private _showCvv: boolean;

  get showCvv(): boolean {
    return this._showCvv;
  }

  set showCvv(value: boolean) {
    this._showCvv = value;
  }

  private findDefaultCountry(): CountryISO {
    let country;
    if (isDefined(this._defaultAddress?.country)) {
      return resolveCountry(this._defaultAddress?.country, this.countries);
    } else if (isDefined(this._defaultAddress?.state)) {
      return CountryISO.findByCode(guessCountryByState(this._defaultAddress.state)) ?? null;
    }
    return CountryISO.findByCode(CountryISOEnum.US);
  }

  private findDefaultState(defaultCountry: CountryISO): USStateEnum | CAStateEnum {
    if (isDefined(this._defaultAddress.state)) {
      let stateEntry;
      if(deepEqual(defaultCountry, CountryISO.findByCode(CountryISOEnum.US))) {
        stateEntry = Array.from(USStateEnumValue.entries()).find(([key, value]) => key.toLowerCase() == this._defaultAddress.state.toLowerCase() || value.toLowerCase() == this._defaultAddress.state.toLowerCase());
      } else if (deepEqual(defaultCountry, CountryISO.findByCode(CountryISOEnum.CA))) {
        stateEntry = Array.from(CAStateEnumValue.entries()).find(([key, value]) => key.toLowerCase() == this._defaultAddress.state.toLowerCase() || value.toLowerCase() == this._defaultAddress.state.toLowerCase()) ?? null;
      }
      return stateEntry ? stateEntry[0] : null;
    }
    return null;
  }

  get showSave(): boolean {
    return this._mode == PaymentMethodViewModeEnum.CREATE && !this._autoSavePaymentMethods && this._canManagePaymentMethods;
  }

  set autoSavePaymentMethods(value: boolean) {
    this._autoSavePaymentMethods = value;
  }

  set canManagePaymentMethods(value: boolean) {
    this._canManagePaymentMethods = value;
  }
}
