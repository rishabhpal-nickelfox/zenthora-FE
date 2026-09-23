import {Component, ElementRef, Inject} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {FormPageStateService} from '../../../../../common/src/lib/utils/form-page-state.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../../services/usermanagement/user.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  EmailChangePasswordRequestModel
} from '../../../../../common/src/lib/models/password/email-change-password-request.model';
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../common/src/lib/utils/base-settings-provider.service";
import {RecaptchaService} from "../../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {PasswordValidator} from "../../../../../common/src/lib/helpers/password.validator";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-email-change-password',
  templateUrl: './email-change-password.component.html',
  styleUrls: ['./email-change-password.component.scss'],
  providers: [FormPageStateService]
})
export class EmailChangePasswordComponent extends AutoScrollingFormPageComponent {
  readonly MIN_LENGTH = PasswordValidator.MIN_LENGTH;
  readonly MAX_LENGTH = PasswordValidator.MAX_LENGTH;
  private token: string;
  private form: FormGroup;

  constructor(@Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, protected router: ActivatedRoute, protected userService: UserService, public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService,
              private fieldValidationService: FieldValidationErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) public settingsProvider: BaseSettingsProvider, private recaptchaService: RecaptchaService) {
    super(formPageStateService, elementRef, errorService);
  }

  ngOnInit(): void {
    this.token = this.router.snapshot.paramMap.get('token');
    this.onReInit();
    this.wsKeyFormControlNameMap = new Map([
      ['password', 'password'],
      ['secretKey', 'secretKey']
    ]);
  }

  getForm(): FormGroup {
    return this.form;
  }

  protected onReInit() {
    this.form = new FormGroup({
      newPassword: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH),
        c => PasswordValidator.validatePasswordFieldStrength(c)])),
      confirmNewPassword: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH),
        c => {
          return this.form && this.form.controls.newPassword.value !== c.value ? {'mustBeTheSame': [c.value, this.form.controls.newPassword.value]} : null;
        }])),
      secretKey: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(100)]))
    });

    this.subscriptions.add(
      this.form.controls.newPassword.valueChanges.subscribe(result => {
        this.form.controls.confirmNewPassword.updateValueAndValidity();
      })
    );
  }

  protected onSubmit(value) {
    const changePassword = (recaptchaToken?: string) =>
      this.subscriptions.add(
        this.userService.changePassword(this.token, new EmailChangePasswordRequestModel(value.newPassword, value.secretKey), recaptchaToken)
          .pipe(finalize(() =>
            this.afterSubmit()))
          .subscribe(
            success => {
              this.routingService.navigateLoginPage();
              this.errorService.alertService.showSuccess('Success', 'Password Changed');
            }, error => {
              this.fieldValidationService.error(error, this);
            }
          )
      );
    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.CHANGE_PASSWORD, changePassword);
    } else {
      changePassword();
    }
  }
}
