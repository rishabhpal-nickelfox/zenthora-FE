import {Component, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {finalize, map} from 'rxjs/operators';
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {
  RecaptchaService
} from "../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {
  CustomerCompanySelectComponent,
  CustomerCompanySelectModel
} from "./companyselect/customer-company-select.component";
import {LoginComponent, LoginComponentModel} from "../../../../common/src/lib/auth/login/login.component";
import {
  ForgotPasswordComponent,
  ForgotPasswordModel
} from "../../../../common/src/lib/auth/forgotpassword/forgot-password.component";
import {
  ChangePasswordLoginComponent,
  ChangePasswordModel
} from "../../../../common/src/lib/auth/changepassword/change-password-login.component";
import {CustomerService} from "../../services/customer.service";
import {CustomerAuthLabels} from "./customer-auth-labels";
import {ComponentWithSubscriptions} from "../../../../common/src/lib/components/component-with-subscriptions";
import {CustomerCurrentDataService} from "../../services/customer-current-data.service";
import {HermesEnum} from "../../../../common/src/lib/enums/utils/hermes.enum";

import * as hermes from '../../../../common/src/assets/hermes/hermes.min';
import {CustomerThemeHelperService} from "../../services/customer-theme-helper.service";
import {UnderMaintenanceService} from "../../../../common/src/lib/utils/under-maintenance.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-customer-auth',
  templateUrl: './customer-auth-page.component.html',
  styleUrls: ['./customer-auth-page.component.scss']
})
export class CustomerAuthPageComponent extends ComponentWithSubscriptions implements OnInit {


  protected mode: CustomerAuthPageMode;
  protected Labels = CustomerAuthLabels;
  protected readonly CustomerAuthPageMode = CustomerAuthPageMode;
  @ViewChild('loginComponent', {static: true}) private loginComponent: LoginComponent;
  @ViewChild('forgotPasswordComponent', {static: true}) private forgotPasswordComponent: ForgotPasswordComponent;
  @ViewChild('companySelectComponent', {static: true}) private companySelectComponent: CustomerCompanySelectComponent;
  @ViewChild('changePasswordComponent', {static: true}) private changePasswordComponent: ChangePasswordLoginComponent;

  constructor(private authService: CustomerService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              protected currentDataService: CustomerCurrentDataService,
              private recaptchaService: RecaptchaService,
              private themeHelper: CustomerThemeHelperService,
              private underMaintenanceService: UnderMaintenanceService,
              private ngZone: NgZone) {
    super();
    hermes.on(HermesEnum.CUSTOMER_CHANGE_COMPANY, (data) => {
      this.ngZone.run(() => this.routingService.navigateAfterAuth());
    });
  }

  ngOnInit() {
    this.authService.logout();
    if (this.underMaintenanceService.isUnderMaintenance) {
      this.mode = CustomerAuthPageMode.UNDER_MAINTENANCE;
    } else {
      this.mode = CustomerAuthPageMode.SIGN_IN;
    }
    this.themeHelper.setDefaultTheme();
    this.errorService.alertService.toastrConfig.toastClass = 'ngx-toastr auth-toastr';
  }

  onLogin(e: LoginComponentModel) {
    const login = (token?: string) => {
      this.subscriptions.add(
        this.authService.loginAndGetCompanies(e.username, e.password, token)
          .pipe(finalize(() => this.loginComponent.afterSubmit()))
          .subscribe(
            response => {
              if (response.mustChangePassword) {
                this.changePasswordComponent.reInit()
                this.mode = CustomerAuthPageMode.CHANGE_PASSWORD;
              } else {
                this.companySelectComponent.reInit({email: e.username, companies: response.customerRoles});
                this.mode = CustomerAuthPageMode.SELECT_COMPANY;
              }
            }
          )
      )
    }
    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this.loginComponent, CustomerAuthPageMode.toRecaptchaAction(this.mode), login);
    } else {
      login()
    }
  }

  onForgotPassword() {
    this.forgotPasswordComponent.reInit();
    this.mode = CustomerAuthPageMode.FORGOT_PASSWORD;
  }

  backToSignIn() {
    this.authService.logout();
    this.loginComponent.reInit({});
    this.mode = CustomerAuthPageMode.SIGN_IN;
  }

  onSendNewPassword(e: ForgotPasswordModel) {
    const sendNewPassword = (token?: string) => {
      this.subscriptions.add(
        this.authService.resetPassword(e.username, token)
          .pipe(finalize(() => this.forgotPasswordComponent.afterSubmit()))
          .subscribe(
            () => {
              this.errorService.alertService.showSuccess('', this.Labels.ResetPasswordConfirmMessage);
              this.loginComponent.reInit(e.username);
              this.mode = CustomerAuthPageMode.SIGN_IN;
            }
          )
      )
    }
    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this.forgotPasswordComponent, CustomerAuthPageMode.toRecaptchaAction(this.mode), sendNewPassword);
    } else {
      sendNewPassword();
    }
  }

  onSelectCompany(e: CustomerCompanySelectModel) {
    this.subscriptions.add(
      this.authService.selectCompany(e.companyId)
        .pipe(finalize(() => this.companySelectComponent.afterSubmit()))
        .subscribe(
          () => {
            this.routingService.navigateAfterAuth();
          }
        )
    );
  }

  onChangePassword(e: ChangePasswordModel) {
    this.subscriptions.add(
      this.currentDataService.changePassword(e.oldPassword, e.newPassword)
        .pipe(finalize(() => this.changePasswordComponent.afterSubmit()))
        .pipe(map(() => {
          this.errorService.alertService.showSuccess(this.Labels.PasswordChangedMessage, null);
          this.companySelectComponent.reInit({
            email: this.currentDataService.currentCustomer.email,
            companies: this.currentDataService.currentCustomer.companyRoles
          });
          this.mode = CustomerAuthPageMode.SELECT_COMPANY;
        }))
        .subscribe(
          () => {

          }
        )
    );
  }

}


export enum CustomerAuthPageMode {
  SIGN_IN,
  REGISTER,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  SELECT_COMPANY,
  UNDER_MAINTENANCE
}

export namespace CustomerAuthPageMode {
  export function toRecaptchaAction(mode: CustomerAuthPageMode): RecaptchaActionEnum {
    switch (mode) {
      case CustomerAuthPageMode.REGISTER:
        return RecaptchaActionEnum.CUSTOMER_REGISTER;
      case CustomerAuthPageMode.SIGN_IN:
        return RecaptchaActionEnum.CUSTOMER_LOGIN;
      case CustomerAuthPageMode.FORGOT_PASSWORD:
        return RecaptchaActionEnum.SEND_NEW_PASSWORD;
      default:
        return null;
    }
  }
}
