import {EventEmitter, Inject, Injectable, Output} from '@angular/core';
import {Router} from '@angular/router';
import * as hermes from '../../../common/src/assets/hermes/hermes.min.js';
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import {BaseRoutingService} from "../../../common/src/lib/utils/base-routing.service";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";
import {CompanyPageMenuService} from "./company-page-menu.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {BasePageMenuService, MENU_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-page-menu.service";

@Injectable()
export class CompanyRoutingService extends BaseRoutingService {

  @Output() refreshAfterNavigate: EventEmitter<any> = new EventEmitter();

  constructor(protected router: Router, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, @Inject(MENU_SERVICE_TOKEN) protected pageMenuService: BasePageMenuService) {
    super(router, settingsProvider);
  }


  get adminHomePagePath() {
    return this.path('admin');
  }

  get userHomePagePath() {
    return this.path('home');
  }

  get homePagePath() {
    return this.path('');
  }

  get roleChangePagePath() {
    return this.path('roleselect');
  }

  get personalInfoPath() {
    return this.path('personal-info');
  }

  get loginPagePath() {
    return this.path('login');
  }

  get emailPagePath() {
    return this.path('email');
  }

  get salePagePath() {
    return this.path('sale');
  }

  navigateAfterAuth() {
    this.pageMenuService.reInit();
    this.navigateFirstUrl();
  }

  navigateFirstUrl() {
    const url = this.pageMenuService.getFirstUrl(this.pageMenuService.menu, this.personalInfoPath);
    this.navigateWithoutRouteReuse(url);
    this.refreshAfterNavigate.emit(url);
  }

  navigateAfterUpdatingCurrentRole() {
    this.pageMenuService.reInit();
    const hasCurrentMenuNode = ObjectHelper.isDefined(this.pageMenuService.findMenuItem(this.currentUrl.replace(/^\/|\/$/g, ''), this.pageMenuService.menu));
    if (!hasCurrentMenuNode) {
      this.navigateFirstUrl();
    }
  }

  navigateLoginPageAndBroadcast() {
    hermes.send(HermesEnum.LOGOUT_AND_REDIRECT, true, true);
    this.navigateLoginPage();
  }

  navigateLoginPage() {
    this.router.navigate([this.loginPagePath]);
  }

  navigateAdminHomePage() {
    this.router.navigate([this.adminHomePagePath]);

  }


  navigateToPersonalInfoPage() {
    this.router.navigate([this.personalInfoPath]);
  }

}
