import {Inject, Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {EPSAuthInterceptor} from "../../../../common/src/lib/services/interceptors/eps-auth-interceptor.service";
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {AuthenticationService} from "../authentication.service";
import {CompanyServiceUrl} from "../company-service-url";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class CompanyAuthInterceptorService extends EPSAuthInterceptor {

  constructor(protected cookieService: CookieService,
              protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              protected authService: AuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(cookieService, errorService, settingsProvider, authService, routingService);
  }

  get COOKIE_LOGGED_IN(): string {
    return "TOKEN_2";
  }

  get interceptUrls(): string[] {
    return CompanyServiceUrl.urls.map(url => `${this.settingsProvider.apiUrl}/${url}`);
  }


}
