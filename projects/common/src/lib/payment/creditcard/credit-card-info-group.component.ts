import {ChangeDetectorRef, Component, ElementRef, forwardRef, Injector, Input, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ErrorService} from '../../utils/errorhandler/error.service';
import * as moment from 'moment';
import {CustomValidator} from '../../helpers/custom.validator';
import {CreditCardEnum} from '../../enums/sale/credit-card.enum';
import {CreditCardService} from "./credit-card.service";
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import {CreditCardInfoGroupLabels} from "./credit-card-info-group-labels";
import {FormGroupAsFormControlComponent} from "../../components/formgroup/form-group-as-form-control.component";
import {ServerErrorService} from "../../utils/server-error.service";
import {
  FormValidatorErrorModel,
  FormValidatorExactLengthErrorModel, FormValidatorMaxLengthErrorModel,
  FormValidatorMinLengthErrorModel
} from "../../models/common/form-validator-error.model";
import {filter, Observable, of} from "rxjs";
import {CreditCardModel} from "../../models/sale/credit-card.model";
import {CreditCardViewService} from "./credit-card-view.service";
import {PaymentMethodViewModeEnum} from "../../enums/sale/payment-method-view-mode.enum";
import {USStateEnum, USStateEnumValue} from "../../enums/utils/us-state.enum";
import {CAStateEnum, CAStateEnumValue} from "../../enums/utils/ca-state.enum";
import {CountryISO, CountryISOEnum, CountryISOShort} from "../../enums/utils/country-iso.enum";
import {AchGroupLabels} from "../ach/ach-group-labels";
import {PaymentMethodLabels} from "../paymentmethod/payment-method-labels";
import {FormHelper} from "../../helpers/form.helper";
import {isCCExpired, luhnAlgorithmCheck} from '../../helpers/credit-card.helper';
import {isDefined, ObjectHelper} from "../../helpers/object.helper";
import {Mask} from "../../helpers/mask";

@Component({
  standalone: false,
  selector: 'app-credit-card-info-component',
  templateUrl: './credit-card-info-group.component.html',
  styleUrls: ['./credit-card-info-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditCardInfoGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CreditCardInfoGroupComponent,
      multi: true
    }
  ]
})
export class CreditCardInfoGroupComponent extends FormGroupAsFormControlComponent implements OnInit, OnDestroy {
  readonly Labels = CreditCardInfoGroupLabels;
  readonly USStateEnum = USStateEnum;
  readonly USStateEnumValue = USStateEnumValue;
  readonly CAStateEnum = CAStateEnum;
  readonly CAStateEnumValue = CAStateEnumValue;
  readonly MAX_LENGTH = {
    NUMBER: 23,
    HOLDER: 26,
    ADDRESS: 60,
    CITY: 60,
    FIRST_NAME: 80,
    LAST_NAME: 80,
    COMPANY: 80,
    STATE: 2,
    PHONE: 12,
    EMAIL: 250,
    CVV: (cardType: CreditCardEnum) => cardType === CreditCardEnum.AMERICAN_EXPRESS ? 4 : 3,
    ZIP: 20
  }

  readonly MIN_LENGTH = {
    NUMBER: 15,
    CVV: 3
  }
  readonly MM_YYYY = [/[01]/, /\d/, '/', /\d/, /\d/];
  private readonly CREDIT_CARD_MASK = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
  _id = new FormControl<number>(null);
  _number = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.CardNumber)(c), c => this.creditCardValidation(this.Labels.CardNumber)(c)]));
  _cardType = new FormControl<CreditCardEnum>(null, Validators.compose([]));
  _holder = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Holder)(c), c => CustomValidator.maxLength(this.Labels.Holder, this.MAX_LENGTH.HOLDER)(c)]));
  _date = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.ExpiryDate)(c), c => this.dateValidation(this.Labels.ExpiryDate)(c)]));
  _cvv = new FormControl<string>(null, Validators.compose([c => this.cvvLengthValidation(this.Labels.CVV)(c)]));
  _companyName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Company, this.MAX_LENGTH.COMPANY)(c)]));
  _firstName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.FirstName, this.MAX_LENGTH.FIRST_NAME)(c)]));
  _lastName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.LastName, this.MAX_LENGTH.LAST_NAME)(c)]));
  _address1 = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Address)(c), c => CustomValidator.maxLength(this.Labels.Address, this.MAX_LENGTH.ADDRESS)(c)]))
  _address2 = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Address, this.MAX_LENGTH.ADDRESS)(c)]))
  _city = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.City)(c), c => CustomValidator.maxLength(this.Labels.City, this.MAX_LENGTH.CITY)(c)]))
  _country = new FormControl<CountryISO>(null, Validators.compose([c => CustomValidator.required(this.Labels.Country)(c)]))
  readonly zipMask = {
    mask: (rawValue: string) => this.MASK.COUNTRY_ZIP(rawValue, this._country.value?.code),
    guide: false
  };
  _state = new FormControl<string>(null, c => this.stateValidation(this.Labels.State)(c))
  _zip = new FormControl<string>(null, c => this.zipValidation(this.Labels.Zip)(c))
  _phone = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Phone, this.MAX_LENGTH.PHONE)(c)]))
  _email = new FormControl<string>(null, c => this.emailValidation(this.Labels.Email)(c))
  _savePaymentMethod = new FormControl<boolean>(null);
  _customerDefault = new FormControl<boolean>(null);
  _paymentDefault = new FormControl<boolean>(null);
  _batchDefault = new FormControl<boolean>(null);
  _isPrivate = new FormControl<boolean>(null);
  _isCurrentUserOwner = new FormControl<boolean>(null);
  _isCredit = new FormControl<boolean>(null);
  countries;

  @Input() copyFromLabel: string;
  @Input() requiredEmail = false;
  creditCardLogoURL: string = null;
  protected readonly CountryISOEnum = CountryISOEnum;
  protected readonly CountryISOShort = CountryISOShort;
  protected readonly AchGroupLabels = AchGroupLabels;
  protected readonly PaymentMethodLabels = PaymentMethodLabels;
  private form = this._fb.group<CreditCardFormGroupModel>({
    id: this._id,
    number: this._number,
    cardType: this._cardType,
    holder: this._holder,
    date: this._date,
    cvv: this._cvv,
    companyName: this._companyName,
    firstName: this._firstName,
    lastName: this._lastName,
    address1: this._address1,
    address2: this._address2,
    city: this._city,
    country: this._country,
    state: this._state,
    zip: this._zip,
    phone: this._phone,
    email: this._email,
    savePaymentMethod: this._savePaymentMethod,
    customerDefault: this._customerDefault,
    paymentDefault: this._paymentDefault,
    batchDefault: this._batchDefault,
    isPrivate: this._isPrivate,
    isCurrentUserOwner: this._isCurrentUserOwner,
    isCredit: this._isCredit
  });
  private readonly addressControls = [
    this._country,
    this._state,
    this._city,
    this._zip,
    this._companyName,
    this._firstName,
    this._lastName,
    this._address1,
    this._address2
  ];

  constructor(protected elementRef: ElementRef,
              private creditCardService: CreditCardService,
              public viewService: CreditCardViewService,
              public errorService: ErrorService,
              public serverErrorService: ServerErrorService,
              protected ch: ChangeDetectorRef,
              private injector: Injector,
              private _fb: FormBuilder) {
    super(elementRef, errorService, ch, serverErrorService);
  }

  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }

  get value(): CreditCardViewModel {
    return this.form.getRawValue();
  }

  get countryCode(): CountryISOEnum {
    return this.getForm()?.controls.country.value?.code ?? null;
  }

  get showCopyFromRow(): boolean {
    return ObjectHelper.isDefined(this.copyFromLabel) && this.viewService.hasDefaultAddress && this._companyName.enabled;
  }

  getWsKeys(): Map<string, FormControl<any>> {
    return new Map<string, FormControl<any>>([
      ['cardFullName', this._holder],
      ['cardNumber', this._number],
      ['expiryMonth', this._date],
      ['expiryYear', this._date],
      ['cvv', this._cvv],
      ['creditCardBillingAddress.companyName', this._companyName],
      ['creditCardBillingAddress.firstName', this._firstName],
      ['creditCardBillingAddress.lastName', this._lastName],
      ['creditCardBillingAddress.address1', this._address1],
      ['creditCardBillingAddress.address2', this._address2],
      ['creditCardBillingAddress.city', this._city],
      ['creditCardBillingAddress.zip', this._zip],
      ['creditCardBillingAddress.state', this._state],
      ['creditCardBillingAddress.phone', this._phone],
      ['creditCardBillingAddress.email', this._email],
      ['creditCardBillingAddress.country', this._country],
      ['customerDefault', this._customerDefault],
      ['paymentDefault', this._paymentDefault],
      ['batchDefault', this._batchDefault],
      ['isPrivate', this._isPrivate]
    ]);
  }

  get creditCardMask(): (string | RegExp)[] {
    return this._number.enabled ? this.CREDIT_CARD_MASK : ['*', '*', '*', '*', /\d/, /\d/, /\d/, /\d/];
  }

  onReInit(model: CreditCardViewModel) {
    this.countries = this.viewService.countries;
    const country = ObjectHelper.isDefined(model.country) ? this.countries.find(c => c.code == model.country.code) : null;

    this.getForm().reset({
      id: model.id,
      number: model.number,
      cardType: model.cardType,
      holder: model.holder,
      date: model.date,
      cvv: model.cvv,
      companyName: model.companyName,
      firstName: model.firstName,
      lastName: model.lastName,
      address1: model.address1,
      address2: model.address2,
      city: model.city,
      country: country,
      state: model.state,
      zip: model.zip,
      phone: model.phone,
      email: model.email,
      savePaymentMethod: model.savePaymentMethod,
      customerDefault: model.customerDefault,
      paymentDefault: model.paymentDefault,
      batchDefault: model.batchDefault,
      isPrivate: model.isPrivate,
      isCurrentUserOwner: model.isCurrentUserOwner,
      isCredit: model.isCredit
    });
  }

  getForm(): FormGroup<CreditCardFormGroupModel> {
    return this.form;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.viewService.modeChanged.subscribe(() => {
        switch (this.viewService.mode) {
          case PaymentMethodViewModeEnum.EDIT:
            const exceptionKeys = ['cvv', 'number', 'isCurrentUserOwner'];
            if (!this._isCurrentUserOwner.getRawValue()) {
              exceptionKeys.push('isPrivate');
            }
            FormHelper.getAllFormControls(this.getForm(), exceptionKeys).forEach(c => c.enable({emitEvent: false}))
            this._savePaymentMethod.setValue(true);
            break;
          case PaymentMethodViewModeEnum.VIEW:
            FormHelper.getAllFormControls(this.getForm(), ['cvv']).forEach(c => c.disable({emitEvent: false}));
            this._savePaymentMethod.setValue(false);
            this.ch.detectChanges();
            break;
        }
      })
    );

    this.subscriptions.add(
      this._savePaymentMethod.valueChanges.subscribe(
        () => {
          if (this.viewService.mode == PaymentMethodViewModeEnum.CREATE) {
            if (this._savePaymentMethod.value) {
              if (this.viewService.showDefault) {
                this._batchDefault.enable();
                this._customerDefault.enable();
                this._paymentDefault.enable();
              }
              if (this.viewService.showPrivate) {
                this._isPrivate.reset({value: true, disabled: false});
              }
            } else {
              this._batchDefault.reset({value: false, disabled: true});
              this._customerDefault.reset({value: false, disabled: true});
              this._paymentDefault.reset({value: false, disabled: true});
              this._isPrivate.reset({value: false, disabled: true});
            }
          }
        }
      )
    );

    this._country.valueChanges
      .pipe(distinctUntilChanged((a, b) => a?.code === b?.code))
      .subscribe(() => {
        this._zip.updateValueAndValidity();
        this._state.reset();
      });

    this.subscriptions.add(
      this._number.valueChanges.pipe(
        debounceTime(300),
        filter(() => this.viewService.mode !== PaymentMethodViewModeEnum.VIEW),
        map(value => Mask.unmaskNumber(value)),
        filter(() => {
          const numberControl = this.getForm().controls.number;
          return !numberControl.hasError('required') && !numberControl.hasError('minlength');
        }),
        filter(value => luhnAlgorithmCheck(value)),
        switchMap(value =>
          this.creditCardService.getCreditCardType(value).pipe(
            tap(result => {
              const cardType = result?.creditCardType ?? CreditCardEnum.UNKNOWN;
              this._cardType.setValue(cardType);
              this.creditCardLogoURL =
                cardType !== CreditCardEnum.UNKNOWN ? `${cardType}.png` : null;
              this._isCredit.setValue(result?.isCredit);
            })
          )
        )
      ).subscribe()
    );

    this._cvv.addValidators(
      c => {
        return this.viewService.showCvv ? CustomValidator.required(this.Labels.CVV)(c) : null;
      }
    )

  }

  holderMask = rawValue => {
    const mask = [];
    for (let i = 0; i < this.MAX_LENGTH.HOLDER - 1; i++) {
      mask.push(/[a-zA-Z0-9\s]/);
    }
    return mask;
  }

  isCCExpired(): boolean {
    return isCCExpired(this._date.value);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.ch.detach();
  }

  copyFromDefaultAddress(): void {
    if (ObjectHelper.isDefined(this.viewService.defaultCountry)) {
      const defaultCountry = this.countries.find(c => c.code == this.viewService.defaultCountry.code)
      this._country.setValue(defaultCountry);
    } else {
      this._country.setValue(null);
    }
    this._state.setValue(this.viewService.defaultState);
    this._city.setValue(this.viewService.defaultCity);
    this._zip.setValue(this.viewService.defaultZip);
    this._companyName.setValue(this.viewService.defaultCompanyName);
    this._firstName.setValue(this.viewService.defaultFirstName);
    this._lastName.setValue(this.viewService.defaultLastName);
    this._address1.setValue(this.viewService.defaultAddress1);
    this._address2.setValue(this.viewService.defaultAddress2);
    this.addressControls.forEach(c => {
      c.markAsDirty();
      c.updateValueAndValidity();
    });

    this.ch.detectChanges();
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      FormHelper.getAllFormControls(this.getForm()).forEach(c => c.disable({emitEvent: false}));
    } else {
      FormHelper.getAllFormControls(this.getForm()).forEach(c => c.enable({emitEvent: false}));
    }
  }

  findCountry = (search: string) => {
    return of(this.viewService.countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase())));
  }

  formatCountry = (value: CountryISO) => value.name;

  protected onInit(): void {
  }

  protected formValueChanges(): Observable<CreditCardViewModel> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }

  private dateValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (isDefined(control.value)) {
        const regexp = new RegExp('^\\d{2}\\/\\d{2}$');
        const m = moment(control.value, 'MM/YYYY');
        return m.isValid() && regexp.test(control.value) ? null : {date: new FormValidatorErrorModel(label)};
      }
      return null;
    }
  }

  private creditCardValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (isDefined(control.value)) {
        if (Mask.removeMask(control.value).length < this.MIN_LENGTH.NUMBER) {
          return {minlength: new FormValidatorMinLengthErrorModel(label, this.MIN_LENGTH.NUMBER)};
        }
        if (Mask.removeMask(control.value).length > this.MAX_LENGTH.NUMBER) {
          return {maxlength: this.MAX_LENGTH.NUMBER};
        }
        return luhnAlgorithmCheck(Mask.unmaskNumber(control.value)) ? null : {pattern: new FormValidatorErrorModel(label)};
      }
      return null;
    }
  }

  private cvvLengthValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      const valueLength = control.value?.length ?? 0;

      if (valueLength > 0) {
        if (valueLength < this.MIN_LENGTH.CVV) {
          return this._cardType.value === CreditCardEnum.AMERICAN_EXPRESS ? {minlength: new FormValidatorMinLengthErrorModel(label, this.MIN_LENGTH.CVV)} : {exactLength: new FormValidatorExactLengthErrorModel(label, this.MIN_LENGTH.CVV)};
        } else if (valueLength > this.MAX_LENGTH.CVV(this._cardType.value)) {
          return this._cardType.value === CreditCardEnum.AMERICAN_EXPRESS ? {maxlength: new FormValidatorMinLengthErrorModel(label, this.MAX_LENGTH.CVV(this._cardType.value))} : {exactLength: new FormValidatorExactLengthErrorModel(label, this.MIN_LENGTH.CVV)};
        }
        return null;
      }
      return null;
    }
  }

  private zipValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (isDefined(this.getForm() && isDefined(this.getControls().country))) {
        const validators: ValidatorFn[] = [];
        if (this.countryCode == CountryISOEnum.US || this.countryCode == CountryISOEnum.CA) {
          validators.push(c => CustomValidator.required(label)(c));
        }
        validators.push(c => CustomValidator.countryZipValidation(label, this.countryCode)(c));
        return Validators.compose(validators)(control);
      }
      return null;
    }
  }

  private emailValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      const validators: ValidatorFn[] = [];
      if (this.requiredEmail) {
        validators.push(c => CustomValidator.required(label)(c));
      }
      validators.push(c => CustomValidator.emailValidation(label)(c));
      validators.push(c => CustomValidator.maxLength(label, this.MAX_LENGTH.EMAIL)(c));
      return Validators.compose(validators)(control);
    }
  }


  private stateValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (this.countryCode == CountryISOEnum.US || this.countryCode == CountryISOEnum.CA) {
        return Validators.compose([c => CustomValidator.required(label)(c)])(control);
      } else {
        return CustomValidator.maxLength(label, this.MAX_LENGTH.STATE)(control);
      }
    }
  }

}

export class CreditCardViewModel extends CreditCardModel {
  savePaymentMethod: boolean;
}

interface CreditCardFormGroupModel {
  id: FormControl<number>
  number: FormControl<string>;
  cardType: FormControl<CreditCardEnum>;
  holder: FormControl<string>;
  date: FormControl<string>;
  cvv: FormControl<string>;
  companyName: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  address1: FormControl<string>;
  address2: FormControl<string>;
  city: FormControl<string>;
  country: FormControl<CountryISO>;
  state: FormControl<string>;
  zip: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  savePaymentMethod: FormControl<boolean>;
  customerDefault: FormControl<boolean>;
  paymentDefault: FormControl<boolean>;
  batchDefault: FormControl<boolean>;
  isPrivate: FormControl<boolean>;
  isCurrentUserOwner: FormControl<boolean>;
  isCredit: FormControl<boolean>;
}
