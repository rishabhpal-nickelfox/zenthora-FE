import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concatMap} from 'rxjs';
import {COOKIE_LOGGED_IN, SYSTEM_PREFIX} from '../../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {CompanyCurrentDataService} from './company-current-data.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../common/src/lib/utils/base-settings-provider.service';
import {CurrentRoleModel, CurrentUserModel} from "../app/models/usermanagement/current.model";
import {map} from "rxjs/operators";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {isDefined} from "../../../common/src/lib/helpers/object.helper";
import {BaseAuthenticationService} from "../../../common/src/lib/services/base-authentication.service";
import {CompanyServiceUrl} from "./company-service-url";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";


@Injectable()
export class AuthenticationService extends BaseAuthenticationService {

  static readonly REMEMBER_ME_KEY = 'REMEMBER_ME';

  constructor(protected http: HttpClient,
              protected currentDataService: CompanyCurrentDataService,
              protected cookieService: CookieService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(http, currentDataService, cookieService, settingsProvider);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.AUTH}`;
  }

  get refreshUrl(): string {
    return `${this.baseUrl}/refresh`
  }

  isLoggedIn() {
    return null !== this.currentDataService.getCurrentUser();
  }

  isRoleSelected(): boolean {
    return this.isLoggedIn() && isDefined(this.currentDataService.getCurrentUser().currentRole);
  }

  login(username: string, password: string, rememberMe?: boolean, recaptchaToken?: string) {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.LOGIN);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<any>(this.baseUrl + '/login',
      JSON.stringify({username: username, password: password}),
      {headers: headers}
    ).pipe(map(result => {
      const user = new CurrentUserModel();
      user.username = username;
      this.currentDataService.login(user);
      this.currentDataService.removeInactivityRoleFromStorage();
      if (isDefined(rememberMe)) {
        this.updateRememberMe(username, rememberMe);
      }
      user.mustChangePassword = result.mustChangePassword;
      return user;
    }));
  }

  sendNewPassword(username: string, recaptchaToken?: string) {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});
    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.SEND_NEW_PASSWORD);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }
    return this.http.post<any>(this.baseUrl + '/new-password',
      {email: username},
      {headers: headers}
    );
  }

  selectRole(role: CurrentRoleModel) {
    return this.http.post<any>(this.baseUrl + '/selectRole',
      JSON.stringify({roleId: role.id})).pipe(concatMap(result => {
      const user = this.currentDataService.getCurrentUser();

      return this.currentDataService.getCurrentRolePermissions().pipe(map(permissions => {
          role.permissions = permissions;
        })
      ).pipe(map(r => {
        user.currentRole = role;
        this.currentDataService.selectRole(user);
        return user;
      }));
    }));
  }

  updateCurrentUserRoles() {
    return this.currentDataService.updateCurrentUserRoles();
  }

  logout() {
    this.cookieService.delete(COOKIE_LOGGED_IN,
      '/',
      window.location.hostname);
    this.currentDataService.logout();
  }

  updateRememberMe(username: string, rememberMe: boolean) {
    if (rememberMe) {
      this.rememberMe(username);
    } else {
      this.removeRememberMe();
    }
  }

  getRememberMeValue() {
    return localStorage.getItem(SYSTEM_PREFIX + AuthenticationService.REMEMBER_ME_KEY);
  }

  rememberMe(username) {
    localStorage.setItem(SYSTEM_PREFIX + AuthenticationService.REMEMBER_ME_KEY, username);
  }

  removeRememberMe() {
    localStorage.removeItem(SYSTEM_PREFIX + AuthenticationService.REMEMBER_ME_KEY);
  }

  updateCurrentPermissions() {
    const currentUser = this.currentDataService.getCurrentUser();
    if (currentUser?.currentRole) {
      this.currentDataService.getCurrentRolePermissions().subscribe(
        permissions => {
          const currentUser = this.currentDataService.getCurrentUser();
          currentUser.currentRole.permissions = permissions;
          this.currentDataService.updateCurrentRole(currentUser);
          this.routingService.navigateAfterUpdatingCurrentRole();
        }
      );
    }
  }

}
