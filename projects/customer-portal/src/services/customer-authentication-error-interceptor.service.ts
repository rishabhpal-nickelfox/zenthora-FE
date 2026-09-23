import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ErrorService} from "../../../common/src/lib/utils/errorhandler/error.service";
import {DEFAULT_ERROR_HEADER, ErrorMessageEnum} from "../../../common/src/lib/enums/error-message.enum";
import {getMessage} from "../../../common/src/lib/helpers/string.helper";
import {
  AuthenticationErrorInterceptorService
} from "../../../common/src/lib/utils/errorhandler/authentication-error-interceptor.service";
import {CustomerServiceUrl} from "./customer-service-url";
import {HttpCodeDescriptions} from "../../../common/src/lib/enums/utils/http-code-description";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {
  AUTHENTICATION_SERVICE_TOKEN,
  BaseAuthenticationService
} from "../../../common/src/lib/services/base-authentication.service";

@Injectable()
export class CustomerAuthenticationErrorInterceptorService extends AuthenticationErrorInterceptorService {
  constructor(protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService) {
    super(errorService, settingsProvider, modalService, routingService, authService);
  }

  get interceptUrls(): string[] {
    return CustomerServiceUrl.urls.map(url => `${this.settingsProvider.apiUrl}/${url}`);
  }

  protected process401Error(error: HttpErrorResponse) {
    this.errorService.showError(getMessage(DEFAULT_ERROR_HEADER, [error.status, HttpCodeDescriptions.get(error.status)]), ErrorMessageEnum.authentication_error);
    this.authService.logout();
  }
}
