import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../../common/src/lib/utils/object-operating.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../common/src/lib/utils/base-settings-provider.service";
import {Observable, throwError} from "rxjs";
import {CompanyServiceUrl} from "../../../services/company-service-url";
import {ApiAuditModel} from "../../models/apiaudit/api-audit.model";

@Injectable()
export class ApiAuditService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.API_AUDIT}`;
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(auditResult => ApiAuditModel.fromJSON(auditResult));
  }

  create(object: any): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(object: any): Observable<never> {
    return throwError('Unsupported operation');
  }

  getAdditionalInfo(id): Observable<never> {
    return throwError('Unsupported operation');
  }
}
