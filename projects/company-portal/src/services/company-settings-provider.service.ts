import {Injectable} from '@angular/core';
import {BaseConfig, BaseSettingsProvider} from "../../../common/src/lib/utils/base-settings-provider.service";
import {COMPANY_PORTAL_URL, inactivity_alert_time, inactivity_time} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable()
export class CompanySettingsProvider extends BaseSettingsProvider {

  protected config: CompanyConfig;

  get baseUrl(): string {
    return COMPANY_PORTAL_URL;
  }

  get portalName(): string {
    return this.config.companyPortalName;
  }

  get inactivityTimeoutSeconds(): number {
    return inactivity_time;
  }

  get inactivityAlertTimeSeconds(): number {
    return inactivity_alert_time;
  }

  loadConfig(): Observable<any> {
    console.log('[CompanyPortal] loadConfig() called');
    return this.http.get('../../assets/company-config.json')
      .pipe(tap(conf => (
        Object.assign(this.config, conf)
      )));
  }

}

interface CompanyConfig extends BaseConfig {
  companyPortalName: string;
}
