import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {SETTINGS_PROVIDER_TOKEN} from "../../../common/src/lib/utils/base-settings-provider.service";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {UnderMaintenanceService} from "../../../common/src/lib/utils/under-maintenance.service";
import {HttpClient} from "@angular/common/http";
import {CustomerSettingsProvider} from "../../../customer-portal/src/services/customer-settings-provider.service";
import {CustomerRoutingService} from "../../../customer-portal/src/services/customer-routing.service";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";
import {StatusCheckService} from "../../../common/src/lib/utils/status-check.service";
import {CompanyUserInactivityService} from "../services/company-user-inactivity.service";

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit, OnDestroy {


  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: CustomerSettingsProvider,
              private titleService: Title,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: CustomerRoutingService,
              private statusCheckService: StatusCheckService,
              private underMaintenanceService: UnderMaintenanceService,
              private inactivityService: CompanyUserInactivityService,
              protected httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.titleService.setTitle(this.settingsProvider.portalName);
    if (this.settingsProvider.isRecaptchaEnabled() && !ObjectHelper.isDefined(RecaptchaService.grecaptcha)) {
      RecaptchaService.loadRecaptchaScript(this.settingsProvider.getRecaptchaSiteKey());
    }
    this.underMaintenanceService.init();
    this.inactivityService.init();

  }

  ngOnDestroy() {
  }
}
