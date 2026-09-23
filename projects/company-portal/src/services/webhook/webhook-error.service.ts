import {Inject, Injectable} from "@angular/core";
import {ObjectOperatingService} from "../../../../common/src/lib/utils/object-operating.service";
import {HttpClient} from "@angular/common/http";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {VaultErrorModel} from "../../app/models/vaulterrors/vault-errors.model";
import {Observable, throwError} from "rxjs";
import {WebhookErrorModel} from "../../app/models/webhook/webhook-error.model";
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class WebhookErrorService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.WEBHOOK_ERROR}`;
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(webhookError => WebhookErrorModel.fromJSON(webhookError));
  }

  create(vaultError: VaultErrorModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(vaultError: VaultErrorModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  getAdditionalInfo(id): Observable<never> {
    return throwError('Unsupported operation');
  }
}
