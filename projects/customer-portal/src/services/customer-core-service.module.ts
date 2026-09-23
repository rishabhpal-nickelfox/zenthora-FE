import {ModuleWithProviders, NgModule} from "@angular/core";
import {SETTINGS_PROVIDER_TOKEN} from "../../../common/src/lib/utils/base-settings-provider.service";
import {CustomerSettingsProvider} from "./customer-settings-provider.service";
import {ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {CustomerRoutingService} from "./customer-routing.service";
import {AUTHENTICATION_SERVICE_TOKEN} from "../../../common/src/lib/services/base-authentication.service";
import {CustomerAuthenticationService} from "./customer-authentication.service";
import {MENU_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-page-menu.service";
import {CustomerPageMenuService} from "./customer-page-menu.service";
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {CustomerPermissionService} from "./customer-permission.service";
import {CustomerTableViewSettingsService} from "./customer-table-view-settings.service";
import {CustomerUserInactivityService} from "./customer-user-inactivity.service";

@NgModule({
})
export class CustomerCoreServiceModule {
  static forRoot(): ModuleWithProviders<CustomerCoreServiceModule> {
    return {
      ngModule: CustomerCoreServiceModule,
      providers: [
        CustomerSettingsProvider,
        {provide: SETTINGS_PROVIDER_TOKEN, useExisting: CustomerSettingsProvider},
        CustomerRoutingService,
        {provide: ROUTING_SERVICE_TOKEN, useExisting: CustomerRoutingService},
        CustomerAuthenticationService,
        {provide: AUTHENTICATION_SERVICE_TOKEN, useExisting: CustomerAuthenticationService},
        CustomerPageMenuService,
        {provide: MENU_SERVICE_TOKEN, useExisting: CustomerPageMenuService},
        CustomerCurrentDataService,
        CustomerPermissionService,
        CustomerTableViewSettingsService,
        CustomerUserInactivityService
      ]
    };
  }
}
