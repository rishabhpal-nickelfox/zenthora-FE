import {Inject, Injectable} from '@angular/core';
import {BaseCurrentDataService} from "../../../common/src/lib/utils/base-current-data.service";
import {
  CurrentCustomerAdditionalInfoModel,
  CurrentCustomerModel
} from "../../../common/src/lib/models/payer/current-customer.model";
import {CustomerCompanyRoleModel} from "../../../common/src/lib/models/payer/customer-company-role.model";
import {CustomerPermissionEnum} from "../enums/customer-permission.enum";
import {DocTypeEnum} from "@eps/common";
import {SYSTEM_PREFIX} from "../../../../environments/environment";
import * as hermes from '../../../common/src/assets/hermes/hermes.min.js';
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import {HttpClient} from "@angular/common/http";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {Observable} from "rxjs";
import {CustomerServiceUrl} from "./customer-service-url";
import {ChangePasswordRequestModel} from "../../../common/src/lib/models/password/change-password-request.model";

@Injectable()
export class CustomerCurrentDataService extends BaseCurrentDataService {

  private readonly CURRENT_CUSTOMER = 'CURRENT_CUSTOMER';
  private readonly DEFAULT_THEME = 'DEFAULT_THEME';

  constructor(private http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super();
  }


  get currentCustomer(): CurrentCustomerModel {
    const currentPayerStringValue = localStorage.getItem(this.CURRENT_CUSTOMER);
    return currentPayerStringValue ? JSON.parse(currentPayerStringValue) : null;
  }

  set currentCustomer(customer: CurrentCustomerModel) {
    localStorage.setItem(this.CURRENT_CUSTOMER, JSON.stringify(customer));
  }

  private _inactivityTime: number;

  get inactivityTime(): number {
    return this._inactivityTime;
  }

  set inactivityTime(value: number) {
    this._inactivityTime = value;
  }

  get companyRole(): CustomerCompanyRoleModel {
    return this.currentCustomer.companyRole;
  }

  set companyRole(company: CustomerCompanyRoleModel) {
    const currentCustomer = this.currentCustomer;
    currentCustomer.companyRole = company;
    this.currentCustomer = currentCustomer;
  }

  get permissions(): CustomerPermissionEnum[] {
    return this.currentCustomer?.permissions ?? [];
  }

  set permissions(permissions: CustomerPermissionEnum[]) {
    const currentCustomer = this.currentCustomer;
    currentCustomer.permissions = permissions;
    this.currentCustomer = currentCustomer;
  }

  get saleTypes(): DocTypeEnum[] {
    return this.currentCustomer?.saleTypes ?? [];
  }

  set saleTypes(saleTypes: DocTypeEnum[]) {
    const currentCustomer = this.currentCustomer;
    currentCustomer.saleTypes = saleTypes;
    this.currentCustomer = currentCustomer;
  }

  removeCurrentCustomer(): void {
    localStorage.removeItem(this.CURRENT_CUSTOMER);
  }

  isLoggedIn(): boolean {
    return null !== localStorage.getItem(this.CURRENT_CUSTOMER);
  }

  setCompanyRoleById(companyId: number) {
    this.companyRole = this.currentCustomer.companyRoles.find(company => company.customerId == companyId);
  }

  setCompanySettings(companyName: string, companyLogo: { type: string, value: string }, companyFavicon: { type: string, value: string }, globalPaymentsEnabled: boolean) {
    const currentCustomer = this.currentCustomer;
    currentCustomer.companyName = companyName;
    currentCustomer.companyLogo = companyLogo;
    currentCustomer.companyFavicon = companyFavicon;
    currentCustomer.companyGlobalPaymentsEnabled = globalPaymentsEnabled;
    this.currentCustomer = currentCustomer;
  }

  get companyName(): string {
    return this.currentCustomer?.companyName;
  }

  get companyLogo(): string {
    const logo = this.currentCustomer?.companyLogo;
    return logo && logo.value ? 'data:' + logo.type + ';base64,' + logo.value : null;
  }

  get prefix(): string {
    return SYSTEM_PREFIX + this.currentCustomer.email + '_' + this.currentCustomer.companyRole.customerId;
  }

  get defaultTheme(): Map<string, string> {
    const themeArray = JSON.parse(localStorage.getItem(this.DEFAULT_THEME));
    return themeArray ? new Map(themeArray) : new Map<string, string>();
  }

  set defaultTheme(value: Map<string, string>) {
    localStorage.setItem(this.DEFAULT_THEME, JSON.stringify(Array.from(value.entries())));
  }

  get theme(): Map<string, string> {
    return this.currentCustomer?.theme ? new Map(this.currentCustomer.theme) : new Map<string, string>();
  }

  set theme(value: Map<string, string>) {
    const currentCustomer = this.currentCustomer;
    currentCustomer.theme = Array.from(this.mergeWithDefaultTheme(value).entries());
    this.currentCustomer = currentCustomer;
    setTimeout(() => { //TODO fix
      hermes.send(HermesEnum.CUSTOMER_CHANGE_THEME, true, this.theme);
    }, 10)
  }

  private mergeWithDefaultTheme(value: Map<string, string>): Map<string, string> {
    const mergedTheme = new Map(this.defaultTheme);

    if (!value) {
      return mergedTheme;
    }

    Array.from(value.entries()).forEach(([key, themeValue]) => {
      if (themeValue !== null && themeValue !== undefined && `${themeValue}`.trim() !== '') {
        mergedTheme.set(key, themeValue);
      }
    });

    return mergedTheme;
  }

  get companyFavicon(): string {
    const favicon = this.currentCustomer?.companyFavicon;
    return favicon && favicon.value ? 'data:' + favicon.type + ';base64,' + favicon.value : null;
  }

  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.CUSTOMER_CURRENT}`;
  }

  getAdditionalInfo(): Observable<CurrentCustomerAdditionalInfoModel> {
    return this.http.get<CurrentCustomerAdditionalInfoModel>(`${this.baseUrl}/info`);
  }

  updateAdditionalInfo(info: CurrentCustomerAdditionalInfoModel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/info`, info);
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post<any>(`${this.baseUrl}/password/change`,
      new ChangePasswordRequestModel(oldPassword, newPassword));
  }

  unregister(): Observable<void>{
    return this.http.post<void>(`${this.baseUrl}/unregister`, null);
  }
}
