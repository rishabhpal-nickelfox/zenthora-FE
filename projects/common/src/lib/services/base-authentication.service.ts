import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {BaseWebService} from "./base-web.service";
import {BaseCurrentDataService} from "../utils/base-current-data.service";
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../utils/base-settings-provider.service";
import {Observable} from "rxjs";

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<BaseAuthenticationService>(
  'AUTHENTICATION_SERVICE_TOKEN'
);

@Injectable()
export abstract class BaseAuthenticationService implements BaseWebService {

  constructor(protected http: HttpClient,
              protected currentDataService: BaseCurrentDataService,
              protected cookieService: CookieService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  abstract get baseUrl();

  refreshToken(): Observable<void> {
    return this.http.post<any>(this.refreshUrl, null);
  }

  abstract isLoggedIn();

  abstract logout();

  abstract updateCurrentPermissions();

  abstract get refreshUrl();

}
