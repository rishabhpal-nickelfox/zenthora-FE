import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DEFAULT_ERROR_MSG} from '../../../../common/src/lib/enums/error-message.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {CompanyCurrentDataService} from '../../services/company-current-data.service';
import * as hermes from '../../../../common/src/assets/hermes/hermes.min.js';
import {catchError, finalize, map} from 'rxjs/operators';
import {HermesEnum} from '../../../../common/src/lib/enums/utils/hermes.enum';
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {
  FieldValidationErrorService
} from "../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {RecaptchaService} from "../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {RoleSelectComponent} from "./roleselect/role-select.component";
import {LoginComponent, LoginComponentModel} from "../../../../common/src/lib/auth/login/login.component";
import {ForgotPasswordComponent} from "../../../../common/src/lib/auth/forgotpassword/forgot-password.component";
import {
  ChangePasswordLoginComponent,
  ChangePasswordModel
} from "../../../../common/src/lib/auth/changepassword/change-password-login.component";
import {throwError} from "rxjs";
import {ComponentWithSubscriptions} from "../../../../common/src/lib/components/component-with-subscriptions";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {UnderMaintenanceComponent} from "../../../../common/src/lib/auth/undermaintenance/under-maintenance.component";
import {UnderMaintenanceService} from "../../../../common/src/lib/utils/under-maintenance.service";

@Component({
  standalone: false,
  selector: 'app-company-auth',
  templateUrl: './company-auth-page.component.html',
  styleUrls: ['./company-auth-page.component.scss']
})
export class CompanyAuthPageComponent extends ComponentWithSubscriptions implements OnInit {

  showLogin = true;
  showForgotPassword = false;
  showChangePassword = false;
  showRoleSelect = false;
  showEula = false;
  @ViewChild('loginComponent', {static: true}) private loginComponent: LoginComponent;
  @ViewChild('forgotPasswordComponent', {static: true}) private forgotPasswordComponent: ForgotPasswordComponent;
  @ViewChild('roleSelectComponent', {static: true}) private roleSelectComponent: RoleSelectComponent;
  @ViewChild('changePasswordComponent', {static: true}) private changePasswordComponent: ChangePasswordLoginComponent;
  @ViewChild('underMaintenanceComponent') private underMaintenanceComponent: UnderMaintenanceComponent;
  showUnderMaintenance = false;

  constructor(@Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, private authenticationService: AuthenticationService, private currentDataService: CompanyCurrentDataService, public errorService: ErrorService, private fieldValidationErrorService: FieldValidationErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) public settingsProvider: BaseSettingsProvider, private recaptchaService: RecaptchaService,
              private underMaintenanceService: UnderMaintenanceService) {
    super();
  }

  ngOnInit() {
    this.authenticationService.logout();
    if (this.underMaintenanceService.isUnderMaintenance) {
      this.showUnderMaintenanceForm();
    } else {
      this.showLoginForm();
    }
    this.errorService.alertService.toastrConfig.toastClass = 'ngx-toastr auth-toastr';
  }


  onLogin(user: LoginComponentModel) {
    const login = (token?: string) => {
      this.subscriptions.add(this.authenticationService.login(user.username, user.password, user.rememberMe, token)
        .pipe(finalize(() => this.loginComponent.afterSubmit()))
        .subscribe(u => {
          this.continueUserWorkflow(u);
        }, error => {
          this.fieldValidationErrorService.error(error, this.loginComponent);
        }));
    };

    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this.loginComponent, RecaptchaActionEnum.LOGIN, login);
    } else {
      login();
    }
  }

  continueUserWorkflow(user) {
    if (user.mustChangePassword) {
      this.onChangePassword();
    } else {
      this.onGetRoles();
    }
  }

  onChangePassword() {
    this.changePasswordComponent.reInit();
    this.showChangePasswordForm();
  }

  onForgotPassword() {
    this.forgotPasswordComponent.reInit();
    this.showForgotPasswordForm();
  }

  backToSignIn() {
    this.authenticationService.logout();
    this.loginComponent.reInit({});
    this.showLoginForm();
  }

  onSendNewPassword(data) {
    const sendNewPassword = (token?: string) => {
      this.subscriptions.add(this.authenticationService.sendNewPassword(data.username, token)
        .pipe(finalize(() => this.forgotPasswordComponent.afterSubmit()))
        .subscribe(() => {
          this.errorService.alertService.showSuccess('Success', 'Password Reset email has been sent');
          this.backToSignIn();
        }, error => {
          this.fieldValidationErrorService.error(error, this.forgotPasswordComponent);
        }));
    };

    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this.forgotPasswordComponent, RecaptchaActionEnum.SEND_NEW_PASSWORD, sendNewPassword);
    } else {
      sendNewPassword();
    }
  }

  onRoleSelected(role) {
    this.getPermissionsForSelectedRoleAndNavigate(role);
  }

  onPasswordChange(e: ChangePasswordModel) {
    this.subscriptions.add(
      this.currentDataService.changePasswordForCurrentUser(e.oldPassword, e.newPassword)
        .pipe(finalize(() =>
          this.changePasswordComponent.afterSubmit()))
        .pipe(catchError(err => {
          this.fieldValidationErrorService.error(err, this.changePasswordComponent);
          return throwError(err);
        }))
        .pipe(map(() => {
          this.errorService.alertService.showSuccess('Success', 'Password Changed');
          const user = this.currentDataService.getCurrentUser();
          user.mustChangePassword = false;
          this.currentDataService.changePassword(user);
          this.continueUserWorkflow(user);
        }))
        .subscribe());
  }

  private getPermissionsForSelectedRoleAndNavigate(role) {
    this.authenticationService.selectRole(role)
      .pipe(finalize(() => this.roleSelectComponent.afterSubmit())).subscribe(() => {
      hermes.send(HermesEnum.CHANGE_ROLE, true, true);
      this.routingService.navigateAfterAuth();
    });
  }

  private onGetRoles() {
    this.authenticationService.updateCurrentUserRoles().subscribe(result => {
      const user = this.currentDataService.getCurrentUser();
      if (user.roles && user.roles.length) {
        if (user.roles.length > 1) {
          this.roleSelectComponent.reInit(user.username, user.roles);
          this.showSpecificForm(false, true, false, false, false);
        } else {
          this.getPermissionsForSelectedRoleAndNavigate(user.roles[0]);
        }
      } else {
        this.errorService.alertService.showError('No roles for user', DEFAULT_ERROR_MSG);
      }
    });

  }

  private showForgotPasswordForm() {
    this.showSpecificForm(false, false, true, false, false);
  }

  private showLoginForm() {
    this.showSpecificForm(true, false, false, false, false);
  }

  private showChangePasswordForm() {
    this.showSpecificForm(false, false, false, true, false);
  }

  private showEulaForm() {
    this.showSpecificForm(false, false, false, false, false);
  }

  private showUnderMaintenanceForm() {
    this.showSpecificForm(false, false, false, false, true);
  }


  private showSpecificForm(login, roleSelect, forgotPassword, changePassword, underMaintenance) {
    this.showLogin = login;
    this.showRoleSelect = roleSelect;
    this.showForgotPassword = forgotPassword;
    this.showChangePassword = changePassword;
    this.showUnderMaintenance = underMaintenance;
  }


}
