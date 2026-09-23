import {Component, Inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ComponentWithSubscriptions} from "../../../../../common/src/lib/components/component-with-subscriptions";
import {SidebarToggleService} from "../../../services/sidebar-toggle.service";
import {CustomerAuthenticationService} from "../../../services/customer-authentication.service";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {CurrentCustomerModel} from "../../../../../common/src/lib/models/payer/current-customer.model";

import * as hermes from '../../../../../common/src/assets/hermes/hermes.min';
import {HermesEnum} from "../../../../../common/src/lib/enums/utils/hermes.enum";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {finalize, map} from "rxjs/operators";
import {CustomerCompanyRoleModel} from "../../../../../common/src/lib/models/payer/customer-company-role.model";
import {CustomerPageMenuService} from "../../../services/customer-page-menu.service";
import {
  AUTHENTICATION_SERVICE_TOKEN,
  BaseAuthenticationService
} from "../../../../../common/src/lib/services/base-authentication.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../common/src/lib/utils/base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";
import {BasePageMenuService, MENU_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-page-menu.service";

@Component({
  standalone: false,
  selector: 'app-customer-portal-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends ComponentWithSubscriptions implements OnInit, OnDestroy {

  protected customer: CurrentCustomerModel;
  protected changingCompany = false;
  private companyName: string;
  protected companyLogo: string;


  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) private settingsProvider: BaseSettingsProvider,
              private sidebarToggleService: SidebarToggleService,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) private authService: BaseAuthenticationService,
              protected currentDataService: CustomerCurrentDataService,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService,
              @Inject(MENU_SERVICE_TOKEN) private pageMenuService: BasePageMenuService,
              private errorService: ErrorService,
              private ngZone: NgZone) {
    super();
  }

  get customerAuthService(): CustomerAuthenticationService {
    return this.authService as CustomerAuthenticationService;
  }

  get title(): string {
    return `${this.companyName ? this.companyName : ''} ${this.settingsProvider.portalName}`;
  }

  get showCompanySelect(): boolean {
    return this.currentDataService.isLoggedIn() && ObjectHelper.isDefined(this.customer.companyRole);
  }

  ngOnInit() {
    this.customer = this.currentDataService.currentCustomer;
    this.companyName = this.currentDataService.companyName;
    this.companyLogo = this.currentDataService.companyLogo;

    hermes.on(HermesEnum.CUSTOMER_LOGIN, (data) => {
      this.ngZone.run(() => this.updateCurrentCustomer());
    });
    hermes.on(HermesEnum.CUSTOMER_LOGOUT, (data) => {
      this.ngZone.run(() => this.updateCurrentCustomer());
    });
    hermes.on(HermesEnum.CUSTOMER_LOGOUT_AND_REDIRECT, (data) => {
      this.updateCurrentCustomer();
      this.ngZone.run(() => this.routingService.navigateLoginPage());
    });
    hermes.on(HermesEnum.CUSTOMER_CHANGE_COMPANY, (data) => {
      this.updateCurrentCustomer();
      this.ngZone.run(() => this.routingService.navigateAfterAuth());
    });
    hermes.on(HermesEnum.CUSTOMER_UPDATE_PERMISSIONS, (data) => {
      this.updateCurrentCustomer();
      this.ngZone.run(() => this.pageMenuService.reInit());
    });
  }

  toggleSidebar(): boolean {
    this.sidebarToggleService.toggle();
    return false;
  }

  onLogout(): boolean {
    this.customerAuthService.logout();
    this.routingService.navigateLoginPageAndBroadcast();
    return false;
  }

  changeCompany(company: CustomerCompanyRoleModel): void {
    this.changingCompany = true;

    this.subscriptions.add(
      this.customerAuthService.selectCompany(company.customerId)
        .pipe(finalize(() => {
          this.changingCompany = false;
        }))
        .pipe(map(() => {
          this.routingService.navigateAfterAuth();
          this.updateCurrentCustomer();
          hermes.send(HermesEnum.CUSTOMER_CHANGE_COMPANY, true, true);
        }))
        .subscribe(() => {
        }, error => {
          this.routingService.reloadPage();
        })
    );
  }

  updateCurrentCustomer() {
    this.customer = this.currentDataService.currentCustomer;
    this.companyName = this.currentDataService.companyName;
    this.companyLogo = this.currentDataService.companyLogo;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    hermes.off(HermesEnum.CUSTOMER_LOGIN);
    hermes.off(HermesEnum.CUSTOMER_LOGOUT);
    hermes.off(HermesEnum.CUSTOMER_LOGOUT_AND_REDIRECT);
    hermes.off(HermesEnum.CUSTOMER_CHANGE_COMPANY);
  }

  get companyRole(): CustomerCompanyRoleModel {
    return this.customer.companyRoles.find(company => company.customerId == this.customer.companyRole.customerId)
  }

  get companyRolesWithCustomerPortalEnabled(): CustomerCompanyRoleModel[] {
    return this.customer.companyRoles.filter(company => company.customerPortalEnabled);
  }

  onShowPersonalInfoPage() {
    this.routingService.navigateToPersonalInfoPage();
  }

}
