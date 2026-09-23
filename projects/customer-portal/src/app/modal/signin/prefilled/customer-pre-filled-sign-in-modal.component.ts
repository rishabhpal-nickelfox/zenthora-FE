import {Component, ElementRef, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomerPreFilledSignInModalLabels} from "./customer-pre-filled-sign-in-modal-labels";
import {FormPageComponent} from "../../../../../../common/src/lib/pages/form-page.component";
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {RecaptchaService} from "../../../../../../common/src/lib/utils/recaptcha.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../../services/customer.service";
import {catchError, finalize, map, mergeMap} from "rxjs/operators";
import {CustomValidator} from "../../../../../../common/src/lib/helpers/custom.validator";
import {
  FormValidatorMustBeTheSameErrorModel
} from "../../../../../../common/src/lib/models/common/form-validator-error.model";
import {PasswordValidator} from "../../../../../../common/src/lib/helpers/password.validator";
import {AccountTypeEnum, AccountTypeEnumValue} from "../../../../../../common/src/lib/enums/sale/account-type.enum";
import {AchGroupLabels} from "../../../../../../common/src/lib/payment/ach/ach-group-labels";
import {ObjectHelper} from "../../../../../../common/src/lib/helpers/object.helper";
import {RecaptchaActionEnum} from "../../../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {of} from "rxjs";
import {CustomerCurrentDataService} from "../../../../services/customer-current-data.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../../common/src/lib/utils/base-settings-provider.service";


@Component({
  standalone: false,
  selector: 'app-customer-pre-filled-sign-in-modal',
  templateUrl: './customer-pre-filled-sign-in-modal.component.html',
  styleUrls: ['../../../../../../common/src/lib/modals/external-modal.scss', './customer-pre-filled-sign-in-modal.component.scss']
})
export class CustomerPreFilledSignInModalComponent extends FormPageComponent implements OnInit, OnDestroy {

  _saleKey = new FormControl<string>(null);
  _companyId = new FormControl<number>(null);
  _email = new FormControl<string>(null);
  _oldPassword = new FormControl<string>(null);
  _password = new FormControl<string>(null);
  _confirmPassword = new FormControl<string>(null);
  _registrationAllowed = new FormControl<boolean>(false);
  readonly Labels = CustomerPreFilledSignInModalLabels;
  readonly MAX_LENGTH = {
    PASSWORD: PasswordValidator.MAX_LENGTH
  }
  readonly MIN_LENGTH = {
    PASSWORD: PasswordValidator.MIN_LENGTH
  }
  readonly PayerSignInModalMode = PayerSignInModalMode;
  protected mode: PayerSignInModalMode = PayerSignInModalMode.SIGN_IN;
  protected emails: string[];
  protected readonly AccountTypeEnumValue = AccountTypeEnumValue;
  protected readonly AchGroupLabels = AchGroupLabels;
  protected readonly AccountTypeEnum = AccountTypeEnum;
  private form = this._fb.group<CustomerPreFilledSignInFormGroupModel>({
    saleKey: this._saleKey,
    companyId: this._companyId,
    email: this._email,
    password: this._password,
    confirmPassword: this._confirmPassword,
    registrationAllowed: this._registrationAllowed
  });
  protected registrationConfirmationLifeTimeInMinutes: number;

  constructor(public formPageStateService: FormPageStateService, protected element: ElementRef, protected _fb: FormBuilder, protected activeModal: NgbActiveModal, protected customerService: CustomerService,
              private currentDataService: CustomerCurrentDataService,
              public errorService: ErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, private recaptchaService: RecaptchaService) {
    super(formPageStateService, element, errorService);
  }

  getForm(): FormGroup<CustomerPreFilledSignInFormGroupModel> {
    return this.form;
  }

  ngOnInit() {
    this._oldPassword.setValidators(Validators.compose([c => CustomValidator.required(this.Labels.OldPassword)(c), c => CustomValidator.maxLength(this.Labels.OldPassword, this.MAX_LENGTH.PASSWORD)(c)]));

    this._password.setValidators(Validators.compose([c => CustomValidator.required(this.Labels.Password)(c), c => CustomValidator.maxLength(this.Labels.Password, this.MAX_LENGTH.PASSWORD)(c),
      c => {
        return this.mode == PayerSignInModalMode.REGISTER || this.mode == PayerSignInModalMode.CHANGE_PASSWORD ? PasswordValidator.validateStrength(this.Labels.Password)(c) : null
      }]));

    this._confirmPassword.setValidators(Validators.compose([c => CustomValidator.required(this.Labels.ConfirmPassword)(c), c => CustomValidator.maxLength(this.Labels.ConfirmPassword, this.MAX_LENGTH.PASSWORD)(c),
      c => {
        return this._password && this._password.value !== c.value ? {'mustBeTheSame': new FormValidatorMustBeTheSameErrorModel(this.Labels.ConfirmPassword, this.Labels.Password)} : null;
      }]));

    this.subscriptions.add(
      this._password.valueChanges.subscribe(result => {
        this._confirmPassword.updateValueAndValidity();
      })
    );
  }

  changeMode(mode: PayerSignInModalMode): void {
    this.reInit(new CustomerPreFilledSignInModel(mode, this._saleKey.value, this._companyId.value, this._email.value, this.emails, this.registrationConfirmationLifeTimeInMinutes, this._registrationAllowed.getRawValue()));
  }

  protected onReInit(newData: CustomerPreFilledSignInModel) {
    this.mode = newData.mode;
    this.emails = newData.emails;
    this.registrationConfirmationLifeTimeInMinutes = newData.registrationConfirmationLifeTimeInMinutes;
    this._saleKey.reset({value: newData.saleKey, disabled: true});
    this._companyId.reset({value: newData.companyId, disabled: true});
    if (ObjectHelper.isDefined(newData.email)) {
      this._email.reset(newData.email ?? null);
    } else if (this.emails.length == 1) {
      this._email.reset(this.emails[0]);
    } else {
      this._email.reset(null);
    }
    this._password.reset({
      value: null,
      disabled: this.mode == PayerSignInModalMode.FORGOT_PASSWORD || this.mode == PayerSignInModalMode.CONFIRM_REGISTRATION
    });
    this._password.markAsPristine();

    this._confirmPassword.reset({
      value: null,
      disabled: this.mode != PayerSignInModalMode.REGISTER && this.mode != PayerSignInModalMode.CHANGE_PASSWORD
    });
    this._confirmPassword.markAsPristine();

    this._oldPassword.reset({
      value: null,
      disabled: this.mode != PayerSignInModalMode.CHANGE_PASSWORD
    });
    this._oldPassword.markAsPristine();

    this._registrationAllowed.reset({value: newData.registrationAllowed, disabled: true});
  }

  protected onSubmit({value}: { value: CustomerPreFilledSignInFormGroupModel }) {
    let action;
    let isRecaptchaEnabled;
    switch (this.mode) {
      case PayerSignInModalMode.SIGN_IN:
        action = this.signIn;
        isRecaptchaEnabled = this.settingsProvider.isRecaptchaEnabled();
        break;
      case PayerSignInModalMode.REGISTER:
        action = this.register;
        isRecaptchaEnabled = this.settingsProvider.isRecaptchaEnabled();
        break;
      case PayerSignInModalMode.CONFIRM_REGISTRATION:
        action = this.confirmRegistration;
        isRecaptchaEnabled = this.settingsProvider.isRecaptchaEnabled();
        break;
      case PayerSignInModalMode.FORGOT_PASSWORD:
        action = this.forgotPassword;
        isRecaptchaEnabled = this.settingsProvider.isRecaptchaEnabled();
        break;
      case PayerSignInModalMode.CHANGE_PASSWORD:
        action = this.changePassword;
        isRecaptchaEnabled = false;
        break;
    }
    if (isRecaptchaEnabled) {
      this.recaptchaService.recaptchaAndContinue(this, PayerSignInModalMode.toRecaptchaAction(this.mode), action);
    } else {
      action();
    }
  }

  private forgotPassword = (recaptchaToken?: string) => {
    this.subscriptions.add(
      this.customerService.resetPassword(this._email.value, recaptchaToken)
        .pipe(finalize(() => this.afterSubmit()))
        .subscribe(
          () => {
            this.errorService.alertService.showSuccess('', this.Labels.ResetPasswordConfirmMessage);
            this.reInit(new CustomerPreFilledSignInModel(PayerSignInModalMode.SIGN_IN, this._saleKey.value, this._companyId.value, this._email.value, this.emails, this.registrationConfirmationLifeTimeInMinutes, this._registrationAllowed.getRawValue()));
          }
        )
    )
  }

  private signIn = (recaptchaToken?: string) => {
    this.subscriptions.add(
      this.customerService.loginFromEmailSale(this._saleKey.value, this._email.value, this._password.value, recaptchaToken)
        .pipe(finalize(() => this.afterSubmit()))
        .pipe(mergeMap(response => {
          if (response.mustChangePassword) {
            this.reInit(new CustomerPreFilledSignInModel(PayerSignInModalMode.CHANGE_PASSWORD, this._saleKey.value, this._companyId.value, this._email.value, this.emails, this.registrationConfirmationLifeTimeInMinutes, this._registrationAllowed.getRawValue()));
            return of(response);
          } else {
            return this.customerService.selectCompany(this._companyId.value).pipe(map(() => this.activeModal.close()));
          }
        }))
        .subscribe(
          response => {

          }
        )
    )
  }

  private register = (token?: string) => {
    this.subscriptions.add(
      this.customerService.register(this._saleKey.value, this._email.value, this._password.value, token)
        .pipe(finalize(() => this.afterSubmit()))
        .subscribe(
          () => {
            this.reInit(new CustomerPreFilledSignInModel(PayerSignInModalMode.CONFIRM_REGISTRATION, this._saleKey.value, this._companyId.value, this._email.value, this.emails, this.registrationConfirmationLifeTimeInMinutes, true));
          }
        )
    )
  }

  private changePassword = () => {
    this.subscriptions.add(
      this.currentDataService.changePassword(this._oldPassword.value, this._password.value)
        .pipe(finalize(() => this.afterSubmit()))
        .pipe(mergeMap(result => {
          this.errorService.alertService.showSuccess(this.Labels.PasswordChangedMessage, null);
          return this.customerService.selectCompany(this._companyId.value).pipe(map(() => this.activeModal.close()))
            .pipe(catchError(error => {
              this.reInit(new CustomerPreFilledSignInModel(PayerSignInModalMode.SIGN_IN, this._saleKey.value, this._companyId.value, this._email.value, this.emails, this.registrationConfirmationLifeTimeInMinutes, true));
              return error;
            }))
        }))
        .subscribe()
    )
  }

  private confirmRegistration = () => {
    this.afterSubmit();
    this.reInit(new CustomerPreFilledSignInModel(PayerSignInModalMode.SIGN_IN, this._saleKey.value, this._companyId.value, this._email.value, this.emails, this.registrationConfirmationLifeTimeInMinutes, true));
  }

  get canRegister(): boolean {
    return this._registrationAllowed.getRawValue();
  }
}

export class CustomerPreFilledSignInModel {
  saleKey: string;
  companyId: number;
  email: string;
  emails: string[];
  password: string;
  confirmPassword: string;
  registrationAllowed: boolean;
  mode: PayerSignInModalMode;
  registrationConfirmationLifeTimeInMinutes: number;

  constructor(mode: PayerSignInModalMode, saleKey: string, companyId: number, email: string, emails: string[], registrationConfirmationLifeTimeInMinutes: number, registrationEnabled: boolean) {
    this.mode = mode;
    this.saleKey = saleKey;
    this.companyId = companyId;
    this.email = email;
    this.emails = emails;
    this.registrationConfirmationLifeTimeInMinutes = registrationConfirmationLifeTimeInMinutes;
    this.registrationAllowed = registrationEnabled;
  }
}

interface CustomerPreFilledSignInFormGroupModel {
  saleKey: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  companyId: FormControl<number>;
  confirmPassword: FormControl<string>;
  registrationAllowed: FormControl<boolean>
}


export enum PayerSignInModalMode {
  SIGN_IN,
  REGISTER,
  CONFIRM_REGISTRATION,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD
}

export namespace PayerSignInModalMode {
  export function toRecaptchaAction(mode: PayerSignInModalMode): RecaptchaActionEnum {
    switch (mode) {
      case PayerSignInModalMode.REGISTER:
        return RecaptchaActionEnum.CUSTOMER_REGISTER;
      case PayerSignInModalMode.SIGN_IN:
        return RecaptchaActionEnum.CUSTOMER_LOGIN;
      case PayerSignInModalMode.FORGOT_PASSWORD:
        return RecaptchaActionEnum.SEND_NEW_PASSWORD;
      default:
        return null;
    }
  }
}
