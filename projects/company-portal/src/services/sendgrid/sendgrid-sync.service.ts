import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {convertJSONToSendgridSync, SendgridSyncModel} from "../../app/models/sendgrid/sendgrid-sync.model";
import {Observable, throwError} from "rxjs";
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class SendgridSyncService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.SENDGRID_AUDIT}`;
  }

  getFromResponse(requestResult) {
    const sendgridSyncs = [];
    requestResult.content.forEach(sendgridSyncResult => {
      sendgridSyncs.push(convertJSONToSendgridSync(sendgridSyncResult));
    });
    return sendgridSyncs;
  }

  create(vaultError: SendgridSyncModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(vaultError: SendgridSyncModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  getAdditionalInfo(id): Observable<never> {
    return throwError('Unsupported operation');
  }
}
