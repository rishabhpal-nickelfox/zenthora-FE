import {Injectable} from '@angular/core';
import {BaseConfig, BaseSettingsProvider} from "../../../common/src/lib/utils/base-settings-provider.service";
import {CUSTOMER_PORTAL_URL, inactivity_alert_time, inactivity_time} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable()
export class CustomerSettingsProvider extends BaseSettingsProvider {
  protected config: CustomerConfig;

  get baseUrl(): string {
    return CUSTOMER_PORTAL_URL;
  }

  get portalName(): string {
    return this.config.customerPortalName;
  }

  get inactivityTimeoutSeconds(): number {
    return inactivity_time;
  }

  get inactivityAlertTimeSeconds(): number {
    return inactivity_alert_time;
  }

  loadConfig(): Observable<any> {
    console.log('[CustomerPortal] loadConfig() called');
    return this.http.get('../../assets/customer-config.json')
      .pipe(tap(conf => (
        Object.assign(this.config, conf)
      )));
  }

}

interface CustomerConfig extends BaseConfig {
  customerPortalName: string;
}
