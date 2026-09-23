import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  AuthenticationErrorInterceptorService
} from "../../../../common/src/lib/utils/errorhandler/authentication-error-interceptor.service";
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {AuthenticationService} from "../authentication.service";
import {getMessage} from "../../../../common/src/lib/helpers/string.helper";
import {ErrorMessageEnum} from "../../../../common/src/lib/enums/error-message.enum";
import {CompanyServiceUrl} from "../company-service-url";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";


@Injectable()
export class CompanyAuthenticationErrorInterceptorService extends AuthenticationErrorInterceptorService {

  constructor(protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              private authenticationService: AuthenticationService) {
    super(errorService, settingsProvider, modalService, routingService, authenticationService);
  }

  get interceptUrls(): string[] {
    return CompanyServiceUrl.urls.map(url => `${this.settingsProvider.apiUrl}/${url}`);
  }

  protected process401Error(serverError: HttpErrorResponse) {
    if (serverError.error.attempts) {
      this.showServerError(serverError, getMessage(`${ErrorMessageEnum.authentication_error} ${ErrorMessageEnum.attempts_left}`, [serverError.error.attempts]));
    } else if (this.errorService.isEntityDisabledError(serverError) || this.errorService.isAccountDisabledError(serverError)) {
      const errorMessage = this.errorService.isEntityDisabledError(serverError) ? ErrorMessageEnum.company_disabled : ErrorMessageEnum.account_disabled;
      this.showServerError(serverError, errorMessage);
      this.logoutAndRedirectToLoginPage(serverError);
    } else {
      this.showServerError(serverError, ErrorMessageEnum.authentication_error);
      this.logoutAndRedirectToLoginPage(serverError);
    }
  }

  private get loginUrl(): string {
    return `${this.authenticationService.baseUrl}/login`;
  }

  private logoutAndRedirectToLoginPage(serverError: HttpErrorResponse) {
    this.authenticationService.logout();
    if (serverError.url !== this.loginUrl && !this.routingService.isLoginPageOpened) {
      this.routingService.navigateLoginPageAndBroadcast();
    }
  }


}
