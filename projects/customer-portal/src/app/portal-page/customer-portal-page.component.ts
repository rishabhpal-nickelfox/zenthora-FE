import {ChangeDetectorRef, Component, Inject, NgZone} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {TermService} from "../../../../common/src/lib/services/eula/term.service";
import {BasePortalPageComponent} from "../../../../common/src/lib/pages/base-portal-page-component.service";
import {CustomerCurrentDataService} from "../../services/customer-current-data.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {BasePageMenuService, MENU_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-page-menu.service";
import {TableViewSettingsService} from "../../../../common/src/lib/utils/table-view-settings.service";
import {CustomerTableViewSettingsService} from "../../services/customer-table-view-settings.service";
import {CustomerThemeHelperService} from "../../services/customer-theme-helper.service";
import {HermesEnum} from "../../../../common/src/lib/enums/utils/hermes.enum";
import * as hermes from "../../../../common/src/assets/hermes/hermes.min";
import {CustomerTitleHelperService} from "../../services/customer-title-helper.service";
import {ObjectHelper} from "../../../../common/src/lib/helpers/object.helper";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {HtmlSanitizerService} from "../../../../common/src/lib/utils/html-sanitizer.service";
import {SidebarToggleService} from "../../services/sidebar-toggle.service";

@Component({
  standalone: false,
  selector: 'app-customer-portal-page',
  templateUrl: './customer-portal-page.component.html',
  styleUrls: ['./customer-portal-page.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CustomerTableViewSettingsService,
      multi: false
    }
  ]
})
export class CustomerPortalPageComponent extends BasePortalPageComponent {

  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(MENU_SERVICE_TOKEN) protected pageMenuService: BasePageMenuService,
              protected currentDataService: CustomerCurrentDataService,
              protected termService: TermService,
              protected modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected themeService: NbThemeService,
              private titleService: CustomerTitleHelperService,
              protected htmlSanitizer: HtmlSanitizerService,
              protected errorService: ErrorService,
              protected cd: ChangeDetectorRef,
              protected themeHelper: CustomerThemeHelperService,
              protected sidebarToggleService: SidebarToggleService,
              protected ngZone: NgZone) {
    super(pageMenuService, currentDataService, termService, modalService, routingService, themeService, htmlSanitizer, errorService, cd);
  }

  ngOnInit() {
    super.ngOnInit();
    this.themeHelper.setTheme();

    this.subscriptions.add(
      this.sidebarToggleService.toggle$.subscribe(() => this.toggleSidebar())
    );

    hermes.on(HermesEnum.CUSTOMER_CHANGE_THEME, () => {
      if (ObjectHelper.isDefined(this.currentDataService.companyName)) {
        this.titleService.setTitle(`${this.currentDataService.companyName} Customer Portal`, this.currentDataService.companyFavicon);
      } else {
        this.titleService.setTitle(this.settingsProvider.portalName, null);
      }
      this.themeHelper.setTheme();
    });

    hermes.on(HermesEnum.CUSTOMER_LOGOUT, () => {
      this.ngZone.run(() => this.titleService.setTitle(this.settingsProvider.portalName, null));
    });

    hermes.on(HermesEnum.CUSTOMER_LOGOUT_AND_REDIRECT, () => {
      this.ngZone.run(() => this.titleService.setTitle(this.settingsProvider.portalName, null));
    });
  }

}
