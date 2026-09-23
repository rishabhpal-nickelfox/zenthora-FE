import {Inject, Injectable, NgZone} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {Observable, of} from "rxjs";
import {map, mergeMap} from "rxjs/operators";
import {CookieService} from "ngx-cookie-service";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {COOKIE_CUSTOMER_LOGGED_IN} from "../../../../environments/environment";
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import * as hermes from '../../../common/src/assets/hermes/hermes.min.js';
import {CustomerSignInResponseModel} from "../../../common/src/lib/models/payer/customer-sign-in-response.model";
import {
  CustomerSignInPortalResponseModel
} from "../../../common/src/lib/models/payer/customer-sign-in-portal-response.model";
import {CurrentCustomerModel} from "../../../common/src/lib/models/payer/current-customer.model";
import {BaseAuthenticationService} from "../../../common/src/lib/services/base-authentication.service";
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {CustomerServiceUrl} from "./customer-service-url";
import {CustomerSelectCompanyResponseModel} from "../models/customer-select-company-response.model";
import {DocTypeEnum} from "@eps/common";
import {CustomerUpdatePermissionsResponseModel} from "../models/customer-update-permissions-response.model";

@Injectable()
export class CustomerAuthenticationService extends BaseAuthenticationService {

  constructor(protected http: HttpClient,
              protected currentDataService: CustomerCurrentDataService,
              protected cookieService: CookieService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              protected ngZone: NgZone) {
    super(http, currentDataService, cookieService, settingsProvider);
  }


  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.CUSTOMER}`;
  }

  get refreshUrl(): string {
    return `${this.baseUrl}/refresh`
  }

  get loginUrl(): string {
    return `${this.baseUrl}/login`;
  }

  registerFromEmailSale(token: string, email: string, password: string, recaptchaToken?: string): Observable<void> {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_REGISTER);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<any>(`${this.settingsProvider.apiUrl}/${CustomerServiceUrl.EMAIL_SALE}/${token}/customer-registration`,
      JSON.stringify({email: email, password: password}),
      {headers: headers}
    );
  }

  loginFromEmailSale(token: string,
                                     email: string,
                                     password: string,
                                     recaptchaToken?: string): Observable<CustomerSignInResponseModel> {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_LOGIN);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<CustomerSignInPortalResponseModel>(`${this.settingsProvider.apiUrl}/${CustomerServiceUrl.EMAIL_SALE}/${token}/login`,
      JSON.stringify({email: email, password: password}),
      {headers: headers}
    ).pipe(map(response => {
      this.finishCustomerLoginAndBroadcast(new CurrentCustomerModel(email, response.customerRoles));
      return response;
    }));
  }

  loginFromEmailSaleAndSelectCompany(token: string,
                                     email: string,
                                     password: string,
                                     companyId: number,
                                     recaptchaToken?: string): Observable<CustomerSignInResponseModel> {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_LOGIN);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<CustomerSignInPortalResponseModel>(`${this.settingsProvider.apiUrl}/${CustomerServiceUrl.EMAIL_SALE}/${token}/login`,
      JSON.stringify({email: email, password: password}),
      {headers: headers}
    ).pipe(map(response => {
      this.finishCustomerLoginAndBroadcast(new CurrentCustomerModel(email, response.customerRoles));
      return response;
    }))
      .pipe(mergeMap(response => this.selectCompany(companyId)
      .pipe(mergeMap(() => of(response)))));
  }

  loginAndGetCompanies(email: string, password: string, recaptchaToken?: string): Observable<CustomerSignInPortalResponseModel> {
    let headers = new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'});

    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CUSTOMER_LOGIN);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }

    return this.http.post<CustomerSignInPortalResponseModel>(this.loginUrl,
      JSON.stringify({email: email, password: password}),
      {headers: headers}
    ).pipe(map(response => {
      this.finishCustomerLoginAndBroadcast(new CurrentCustomerModel(email, response.customerRoles));
      return response;
    }));
  }

  finishCustomerLogin(customer: CurrentCustomerModel) {
    this.currentDataService.currentCustomer = customer;
  }

  finishCustomerLoginAndBroadcast(customer: CurrentCustomerModel) {
    this.finishCustomerLogin(customer)
    hermes.send(HermesEnum.CUSTOMER_LOGIN, true, true);
  }

  logout() {
    this.cookieService.delete(COOKIE_CUSTOMER_LOGGED_IN,
      '/',
      window.location.hostname);
    this.currentDataService.removeCurrentCustomer();
    hermes.send(HermesEnum.CUSTOMER_LOGOUT, true, true);
  }

  isLoggedIn(): boolean {
    return this.currentDataService.isLoggedIn();
  }

  selectCompany(companyId: number): Observable<any> {
    return this.http.post<CustomerSelectCompanyResponseModel>(`${this.baseUrl}/select-role`, {customerId: companyId}).pipe(map(response => CustomerSelectCompanyResponseModel.fromJSON(response)))
      .pipe(map(response => {
        this.currentDataService.setCompanyRoleById(companyId);
        this.currentDataService.permissions = response.permissions;
        this.currentDataService.setCompanySettings(response.legalName, response.logo, response.favicon, response.globalPaymentsEnabled);
        const saleTypes = [];

        if (response.hasInvoices) {
          saleTypes.push(DocTypeEnum.INVOICE);
        }
        if (response.hasSalesOrders) {
          saleTypes.push(DocTypeEnum.SALES_ORDER);
        }
        if (response.hasDeposits) {
          saleTypes.push(DocTypeEnum.DEPOSIT);
        }

        this.currentDataService.saleTypes = saleTypes;
        if (response.theme) {
          this.currentDataService.theme = response.theme;
        } else {
          this.currentDataService.theme = this.currentDataService.defaultTheme;
        }
          hermes.send(HermesEnum.CUSTOMER_CHANGE_COMPANY, true, true);

    }));
  }

  updateCurrentPermissions() {
    return this.http.get<CustomerUpdatePermissionsResponseModel>(`${this.baseUrl}/current/permissions`).pipe(map(response => {
      this.currentDataService.permissions = response.permissions;
      hermes.send(HermesEnum.CUSTOMER_UPDATE_PERMISSIONS, true, true);
    })).subscribe();
  }
}
