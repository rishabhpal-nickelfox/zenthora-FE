import {ModuleWithProviders, NgModule} from "@angular/core";
import {SETTINGS_PROVIDER_TOKEN} from "../../../common/src/lib/utils/base-settings-provider.service";
import {CompanySettingsProvider} from "./company-settings-provider.service";
import {CompanyPageMenuService} from "./company-page-menu.service";
import {AuthenticationService} from "./authentication.service";
import {CompanyCurrentDataService} from "./company-current-data.service";
import {CompanyRoutingService} from "./company-routing.service";
import {CompanyTableViewSettingsService} from "./company-table-view-settings.service";
import {CompanyUserInactivityService} from "./company-user-inactivity.service";
import {ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {AUTHENTICATION_SERVICE_TOKEN} from "../../../common/src/lib/services/base-authentication.service";
import {MENU_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-page-menu.service";

@NgModule({
})
export class CompanyCoreServiceModule {
  static forRoot(): ModuleWithProviders<CompanyCoreServiceModule> {
    return {
      ngModule: CompanyCoreServiceModule,
      providers: [
        CompanyPageMenuService,
        AuthenticationService,
        CompanyCurrentDataService,
        {
          provide: SETTINGS_PROVIDER_TOKEN,
          useClass: CompanySettingsProvider
        },
        {provide: ROUTING_SERVICE_TOKEN, useClass: CompanyRoutingService, multi: false},
        {provide: AUTHENTICATION_SERVICE_TOKEN, useClass: AuthenticationService, multi: false},
        {provide: MENU_SERVICE_TOKEN, useClass: CompanyPageMenuService, multi: false},
        CompanyTableViewSettingsService,
        CompanyUserInactivityService
      ]
    };
  }
}
