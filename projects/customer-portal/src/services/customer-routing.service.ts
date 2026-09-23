import {EventEmitter, Inject, Injectable, Output} from '@angular/core';
import {Router} from '@angular/router';
import * as hermes from '../../../common/src/assets/hermes/hermes.min.js';
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import {BaseRoutingService} from "../../../common/src/lib/utils/base-routing.service";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";
import {CustomerPortalPagePath} from "../app/portal-page/customer-portal-page-path";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {BasePageMenuService, MENU_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-page-menu.service";

@Injectable()
export class CustomerRoutingService extends BaseRoutingService {

  private static readonly PORTAL_PAGE_PATHS = [
    CustomerPortalPagePath.PERSONAL_INFO,
    CustomerPortalPagePath.PAYMENT_METHODS,
    CustomerPortalPagePath.INVOICES,
    CustomerPortalPagePath.SALES_ORDERS,
    CustomerPortalPagePath.DEPOSITS,
    CustomerPortalPagePath.TRANSACTIONS,
    CustomerPortalPagePath.USERS
  ];

  @Output() refreshAfterNavigate: EventEmitter<any> = new EventEmitter();

  constructor(protected router: Router, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, @Inject(MENU_SERVICE_TOKEN) protected pageMenuService: BasePageMenuService) {
    super(router, settingsProvider);
  }

  get homePagePath() {
    return '/';
  }

  get loginPagePath() {
    return this.path(CustomerPortalPagePath.LOGIN);
  }

  get homePath() {
    return this.path("");
  }

  get paymentFormPagePath() {
    return this.path(CustomerPortalPagePath.PAYMENT_FORMS);
  }

  get isPortalPageOpened(): boolean {
    return CustomerRoutingService.PORTAL_PAGE_PATHS.some(pagePath => this.isPathOpened(this.path(pagePath)));
  }

  navigateAfterAuth() {
    this.pageMenuService.reInit();
    this.navigateFirstUrl();
  }

  navigateFirstUrl() {
    const url = this.pageMenuService.getFirstUrl(this.pageMenuService.menu, this.homePath);
    this.navigateWithoutRouteReuse(url);
    this.refreshAfterNavigate.emit(url);
  }

  navigateAfterUpdatingCurrentRole() {
    this.pageMenuService.reInit();
    const hasCurrentMenuNode = ObjectHelper.isDefined(this.pageMenuService.findMenuItem('/', this.pageMenuService.menu));
    if (!hasCurrentMenuNode) {
      this.navigateFirstUrl();
    }
  }

  navigateLoginPageAndBroadcast() {
    hermes.send(HermesEnum.CUSTOMER_LOGOUT_AND_REDIRECT, true, true);
    this.navigateLoginPage();
  }

  navigateLoginPage() {
    this.router.navigate([this.loginPagePath]);
  }

  get invoicePagePath() {
    return this.path(CustomerPortalPagePath.INVOICES);
  }


  get salesOrderPagePath() {
    return this.path(CustomerPortalPagePath.SALES_ORDERS);
  }


  get depositSalesPath() {
    return this.path(CustomerPortalPagePath.DEPOSITS);
  }

  get personalInfoPath() {
    return this.path(CustomerPortalPagePath.PERSONAL_INFO);
  }


  navigateCustomerPortalUnavailablePath() {
    this.router.navigate([this.path(CustomerPortalPagePath.UNAVAILABLE)]);
  }

  navigateToPersonalInfoPage() {
    this.router.navigate([this.personalInfoPath]);
  }
}
