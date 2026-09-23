import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {AuditBaseService} from "./audit.base.service";
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class AuditCompanyService extends AuditBaseService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.AUDIT}`;
  }

}
