import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {CustomerEmailChangePasswordLabels} from "./customer-email-change-password-labels";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {PasswordValidator} from "../../../../../common/src/lib/helpers/password.validator";
import {
  FormValidatorMustBeTheSameErrorModel
} from "../../../../../common/src/lib/models/common/form-validator-error.model";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";
import {CustomerRoutingService} from "../../../services/customer-routing.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {CustomerService} from "../../../services/customer.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../common/src/lib/utils/base-settings-provider.service";
import {RecaptchaService} from "../../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {
  EmailChangePasswordRequestModel
} from "../../../../../common/src/lib/models/password/email-change-password-request.model";
import {CustomerCompanyInvitationLabels} from "../registration/company/customer-company-invitation-labels";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-payer-reset-password',
  templateUrl: './customer-email-change-password.component.html',
  styleUrls: ['./customer-email-change-password.component.scss'],
  providers: [FormPageStateService]
})
export class CustomerResetPasswordComponent extends AutoScrollingFormPageComponent implements OnInit {
  readonly MAX_LENGTH = {
    PASSWORD: PasswordValidator.MAX_LENGTH,
    SECRET_KEY: 100
  }
  readonly MIN_LENGTH = {
    PASSWORD: PasswordValidator.MIN_LENGTH
  }
  protected readonly Labels = CustomerEmailChangePasswordLabels;
  _password = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Password)(c), c => PasswordValidator.validateStrength(this.Labels.Password)(c)]));
  _confirmPassword = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.ConfirmPassword)(c), c => CustomValidator.maxLength(this.Labels.ConfirmPassword, this.MAX_LENGTH.PASSWORD)(c), c => {
    return this._password && this._password.value !== c.value ? {'mustBeTheSame': new FormValidatorMustBeTheSameErrorModel(this.Labels.ConfirmPassword, this.Labels.Password)} : null;
  }]));
  _secretKey = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.SecretKey)(c), c => CustomValidator.maxLength(this.Labels.SecretKey, this.MAX_LENGTH.SECRET_KEY)(c)]));
  private token: string;
  private form = this._fb.group<PayerResetPasswordFormGroupModel>({
    password: this._password, confirmPassword: this._confirmPassword
  });

  protected customerPortalEnabled = false;

  constructor(formPageStateService: FormPageStateService, protected elementRef: ElementRef, protected router: ActivatedRoute, @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService, errorService: ErrorService, private alertService: AlertService, private customerService: CustomerService, private _fb: FormBuilder, @Inject(SETTINGS_PROVIDER_TOKEN) public settingsProvider: BaseSettingsProvider, private recaptchaService: RecaptchaService) {
    super(formPageStateService, elementRef, errorService);
  }

  private _showSuccessMessage = false;

  get showSuccessMessage(): boolean {
    return this._showSuccessMessage;
  }

  get showResetForm(): boolean {
    return !this._showSuccessMessage;
  }

  ngOnInit(): void {
    this.token = this.router.snapshot.paramMap.get('token');
    this.customerPortalEnabled = this.router.snapshot.queryParamMap.get('customerPortalEnabled') == 'true';

    this.subscriptions.add(this._password.valueChanges.subscribe(result => {
      this._confirmPassword.updateValueAndValidity();
    }));
  }

  getForm(): FormGroup {
    return this.form;
  }

  protected onReInit() {
    this.form.reset();
  }

  protected onSubmit({value}: { value: any }) {
    const setNewPassword = (token?: string) => this.subscriptions.add(this.customerService.emailChangePassword(this.token, new EmailChangePasswordRequestModel(this._password.value, this._secretKey.value), token)
      .pipe(finalize(() => {
        this.afterSubmit();
      }))
      .subscribe(() => {
        this._showSuccessMessage = true;
        this.errorService.showSuccess('', this.Labels.PasswordChangedMessage);
      }));

    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.CUSTOMER_CHANGE_PASSWORD, setNewPassword);
    } else {
      setNewPassword();
    }
    return false;
  }

  protected redirect() {
    this.routingService.navigateLoginPageAndBroadcast();
  }

}


interface PayerResetPasswordFormGroupModel {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}
