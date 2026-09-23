import {Inject, Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {
  WebhookTestConfigurationRequestModel,
  WebhookTestConfigurationResponseModel
} from "../../app/models/webhook/webhook-test-configuration.model";
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class WebhookService {

  constructor(private http: HttpClient,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.WEBHOOK}`;
  }

  testWebhookConfiguration(model: WebhookTestConfigurationRequestModel): Observable<boolean> {
    return this.http.post<any>(`${this.baseUrl}/test`,
      WebhookTestConfigurationRequestModel.toJSON(model)
    ).pipe(map(response =>
      WebhookTestConfigurationResponseModel.fromJSON(response).valid
    ));
  }
}
