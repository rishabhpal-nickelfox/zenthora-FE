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
import {AccountTypeEnum, AccountTypeEnumValue} from '../../enums/sale/account-type.enum';
import {CustomValidator} from '../../helpers/custom.validator';
import {FormGroupAsFormControlComponent} from "../../components/formgroup/form-group-as-form-control.component";
import {AchGroupLabels} from "./ach-group-labels";
import {ServerErrorService} from "../../utils/server-error.service";
import {Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {ACHModel} from "../../models/sale/ach.model";
import {BillingAddress} from "../../models/common/address.model";
import {ACHViewService} from "./ach-view.service";
import {PaymentMethodViewModeEnum} from "../../enums/sale/payment-method-view-mode.enum";
import {USStateEnum, USStateEnumValue} from "../../enums/utils/us-state.enum";
import {CreditCardInfoGroupLabels} from "../creditcard/credit-card-info-group-labels";
import {CAStateEnum, CAStateEnumValue} from "../../enums/utils/ca-state.enum";
import {CountryISO, CountryISOEnum, CountryISOShort} from "../../enums/utils/country-iso.enum";
import {isDefined, ObjectHelper} from "../../helpers/object.helper";
import {FormHelper} from "../../helpers/form.helper";

@Component({
  standalone: false,
  selector: 'app-ach-group',
  templateUrl: './ach-group.component.html',
  styleUrls: ['./ach-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AchGroupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AchGroupComponent,
      multi: true
    }
  ]
})
export class AchGroupComponent extends FormGroupAsFormControlComponent implements OnInit, OnDestroy {

  @Input() copyFromLabel: string;
  @Input() defaultAddress: BillingAddress;

  readonly Labels = AchGroupLabels;

  readonly AccountTypeEnum = AccountTypeEnum;
  readonly AccountTypeEnumValue = AccountTypeEnumValue;

  readonly MAX_LENGTH = {
    NAME: 255,
    ROUTING: 255,
    ACCOUNT_US: 17,
    ACCOUNT_CA: 12,
    ADDRESS: 60,
    CITY: 60,
    FIRST_NAME: 80,
    LAST_NAME: 80,
    COMPANY: 80,
    STATE: 2,
    PHONE: 12,
    EMAIL: 250,
    ZIP: 20
  }

  readonly MIN_LENGTH = {
    ACCOUNT: 5
  }

  _id = new FormControl<number>(null);
  _name = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.NameOnAccount)(c), c => CustomValidator.maxLength(this.Labels.NameOnAccount, this.MAX_LENGTH.NAME)(c)]));
  _routingNumber = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Routing)(c), c => CustomValidator.pattern(this.Labels.Routing, '^\\d{9}$|^\\d{1}\\-\\d{3}\\-\\d{5}$')(c)]));
  _accountNumber = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Account)(c), c => this.accountNumberMaxLengthValidator(this.Labels.Account)(c), c => CustomValidator.minLength(this.Labels.Account, this.MIN_LENGTH.ACCOUNT)(c)]));
  _accountType = new FormControl<AccountTypeEnum>(null, Validators.compose([c => CustomValidator.required(this.Labels.AccountType)(c)]));
  _companyName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Company, this.MAX_LENGTH.COMPANY)(c)]));
  _firstName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.FirstName, this.MAX_LENGTH.FIRST_NAME)(c)]));
  _lastName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.LastName, this.MAX_LENGTH.LAST_NAME)(c)]));
  _address1 = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Address)(c), c => CustomValidator.maxLength(this.Labels.Address, this.MAX_LENGTH.ADDRESS)(c)]))
  _address2 = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Address, this.MAX_LENGTH.ADDRESS)(c)]))
  _city = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.City)(c), c => CustomValidator.maxLength(this.Labels.City, this.MAX_LENGTH.CITY)(c)]))
  _country = new FormControl<CountryISOEnum>(null, Validators.compose([c => CustomValidator.required(this.Labels.Country)(c)]))
  _state = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.State)(c), c => CustomValidator.maxLength(this.Labels.State, this.MAX_LENGTH.STATE)(c)]))
  _zip = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Zip)(c), c => CustomValidator.countryZipValidation(this.Labels.Zip, this._country?.value)(c)]))
  _phone = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Phone, this.MAX_LENGTH.PHONE)(c)]))
  _email = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Email, this.MAX_LENGTH.EMAIL)(c)]))
  _savePaymentMethod = new FormControl<boolean>(null);
  _customerDefault = new FormControl<boolean>(null);
  _paymentDefault = new FormControl<boolean>(null);
  _batchDefault = new FormControl<boolean>(null);
  _isPrivate = new FormControl<boolean>(null);
  _isCurrentUserOwner = new FormControl<boolean>(null);

  zipMask = {
    mask: rawValue => this.MASK.COUNTRY_ZIP(rawValue, this._country.value),
    guide: false
  };
  readonly usRoutingMask = [/[0-3]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  readonly canadaRoutingMask = ['0', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
  protected readonly USStateEnum = USStateEnum;
  protected readonly CreditCardInfoGroupLabels = CreditCardInfoGroupLabels;
  protected readonly CAStateEnumValue = CAStateEnumValue;
  protected readonly USStateEnumValue = USStateEnumValue;
  protected readonly CAStateEnum = CAStateEnum;
  protected readonly CountryISOEnum = CountryISOEnum;
  protected readonly CountryISOShort = CountryISOShort;
  protected readonly CountryISO = CountryISO;
//TODO rollback address1 requirement
  private form = this._fb.group<AchFormGroupModel>({
    id: this._id,
    name: this._name,
    routingNumber: this._routingNumber,
    accountNumber: this._accountNumber,
    accountType: this._accountType,
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
    isCurrentUserOwner: this._isCurrentUserOwner
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
  private readonly accountUSNumberMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  private readonly accountCANumberMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];


  constructor(protected elementRef: ElementRef,
              protected viewService: ACHViewService,
              public errorService: ErrorService,
              public serverErrorService: ServerErrorService,
              private _fb: FormBuilder,
              private injector: Injector,
              protected ch: ChangeDetectorRef) {
    super(elementRef, errorService, ch, serverErrorService);
  }

  get accountNumberMask(): (string | RegExp)[] {
    if(this._country.enabled){
      return this._country.value == CountryISOEnum.CA ? this.accountCANumberMask : this.accountUSNumberMask;
    }else{
      return ['*', '*', '*', '*', /\d/, /\d/, /\d/, /\d/];
    }
  }

  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }

  get value(): ACHModel {
    return this.form.getRawValue();
  }

  get showCopyFromRow(): boolean {
    return ObjectHelper.isDefined(this.copyFromLabel) && this.viewService.hasDefaultAddress && this._companyName.enabled;
  }


  getWsKeys(): Map<string, FormControl<any>> {
    return new Map<string, FormControl<any>>([
      ['name', this._name],
      ['routingNumber', this._routingNumber],
      ['accountNumber', this._accountNumber],
      ['accountType', this._accountNumber],
      ['creditCardBillingAddress.companyName', this._companyName],
      ['creditCardBillingAddress.firstName', this._firstName],
      ['creditCardBillingAddress.lastName', this._lastName],
      ['creditCardBillingAddress.address1', this._address1],
      ['creditCardBillingAddress.address2', this._address2],
      ['creditCardBillingAddress.city', this._city],
      ['creditCardBillingAddress.zip', this._zip],
      ['creditCardBillingAddress.state', this._state],
      ['creditCardBillingAddress.country', this._country],
      ['creditCardBillingAddress.phone', this._phone],
      ['creditCardBillingAddress.email', this._email],
      ['customerDefault', this._customerDefault],
      ['paymentDefault', this._paymentDefault],
      ['batchDefault', this._batchDefault],
      ['isPrivate', this._isPrivate]
    ]);
  }

  onReInit(model: ACHModel) {
    this.getForm().reset(model);
  }

  getForm(): FormGroup<AchFormGroupModel> {
    return this.form;
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.viewService.modeChanged.subscribe(() => {
        switch (this.viewService.mode) {
          case PaymentMethodViewModeEnum.EDIT:
            const exceptionKeys = ['accountNumber', 'isCurrentUserOwner'];
            if (!this._isCurrentUserOwner.getRawValue()) {
              exceptionKeys.push('isPrivate');
            }
            FormHelper.getAllFormControls(this.getForm(), exceptionKeys).forEach(c => c.enable({emitEvent: false}))
            this._savePaymentMethod.setValue(true);
            break;
          case PaymentMethodViewModeEnum.VIEW:
            FormHelper.getAllFormControls(this.getForm()).forEach(c => c.disable({emitEvent: false}))
            this._savePaymentMethod.setValue(false);
            break;
        }
      })
    );

    this.subscriptions.add(
      this._savePaymentMethod.valueChanges.subscribe(
        () => {
          if (this.viewService.mode == PaymentMethodViewModeEnum.CREATE) {
            if (this.viewService.save) {
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

    this.subscriptions.add(
      this._country.valueChanges
        .pipe(distinctUntilChanged((a, b) => a === b))
        .subscribe(() => {
          this._zip.updateValueAndValidity();
          this._state.reset();
          this._routingNumber.updateValueAndValidity();
          this._accountNumber.updateValueAndValidity();
        }));
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.ch.detach();
  }

  copyFromDefaultAddress(): void {
    this._country.setValue(this.viewService.defaultCountry);
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

  protected formValueChanges(): Observable<ACHModel> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }

  protected onInit(): void {
  }

  private accountNumberMaxLengthValidator(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (this._country) {
        if (this._country.value == CountryISOEnum.US) {
          return CustomValidator.maxLength(label, this.MAX_LENGTH.ACCOUNT_US);
        } else if (this._country.value == CountryISOEnum.CA) {
          return CustomValidator.maxLength(label, this.MAX_LENGTH.ACCOUNT_CA);
        }
      }
      return null;
    }
  }

}

export class ACHViewModel extends ACHModel {
  savePaymentMethod: boolean;
}
interface AchFormGroupModel {
  id: FormControl<number>;
  name: FormControl<string>;
  routingNumber: FormControl<string>;
  accountNumber: FormControl<string>;
  accountType: FormControl<AccountTypeEnum>;
  companyName: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  address1: FormControl<string>;
  address2: FormControl<string>;
  city: FormControl<string>;
  country: FormControl<CountryISOEnum>;
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
}
