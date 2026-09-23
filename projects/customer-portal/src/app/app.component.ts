import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {ErrorService} from "../../../common/src/lib/utils/errorhandler/error.service";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import * as hermes from "../../../common/src/assets/hermes/hermes.min";
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import {CustomerCurrentDataService} from "../services/customer-current-data.service";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";
import {UnderMaintenanceService} from "../../../common/src/lib/utils/under-maintenance.service";
import {CustomerThemeHelperService} from "../services/customer-theme-helper.service";
import {CustomerTitleHelperService} from "../services/customer-title-helper.service";
import {StatusCheckService} from "../../../common/src/lib/utils/status-check.service";
import {CustomerUserInactivityService} from "../services/customer-user-inactivity.service";


@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit {

  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              private titleService: CustomerTitleHelperService,
              private currentDataService: CustomerCurrentDataService,
              private errorService: ErrorService,
              protected ngZone: NgZone,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              private underMaintenanceService: UnderMaintenanceService,
              private themeHelper: CustomerThemeHelperService,
              private statusCheckService: StatusCheckService,
              private inactivityService: CustomerUserInactivityService) {

  }

  ngOnInit(): void {
    if (ObjectHelper.isDefined(this.currentDataService.companyName)) {
      this.titleService.setTitle(`${this.currentDataService.companyName ? this.currentDataService.companyName : ''} ${this.settingsProvider.portalName}`, this.currentDataService.companyFavicon);
    } else {
      this.titleService.setTitle(this.settingsProvider.portalName, null);
    }
    if (this.settingsProvider.isRecaptchaEnabled() && !ObjectHelper.isDefined(RecaptchaService.grecaptcha)) {
      RecaptchaService.loadRecaptchaScript(this.settingsProvider.getRecaptchaSiteKey());
    }

    this.underMaintenanceService.init();
    this.inactivityService.init();

    this.themeHelper.saveDefaultTheme();
  }

}
