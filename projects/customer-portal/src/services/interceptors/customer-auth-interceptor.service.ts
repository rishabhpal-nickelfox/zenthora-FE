import {Inject, Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {EPSAuthInterceptor} from "../../../../common/src/lib/services/interceptors/eps-auth-interceptor.service";
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {CustomerServiceUrl} from "../customer-service-url";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {
  AUTHENTICATION_SERVICE_TOKEN,
  BaseAuthenticationService
} from "../../../../common/src/lib/services/base-authentication.service";

@Injectable()
export class CustomerAuthInterceptorService extends EPSAuthInterceptor {

  constructor(protected cookieService: CookieService,
              protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(cookieService, errorService, settingsProvider, authService, routingService);
  }

  get interceptUrls(): string[] {
    return CustomerServiceUrl.urls.map(url => `${this.settingsProvider.apiUrl}/${url}`);
  }

  get COOKIE_LOGGED_IN(): string {
    return "CUSTOMER_TOKEN_2";
  }
}
