import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {of} from 'rxjs';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {ApiTokenModel} from "../../app/models/apitoken/api-token.model";
import {map} from "rxjs/operators";
import {isDefined} from '../../../../common/src/lib/helpers/object.helper';
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class ApiTokenService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.API_TOKEN}`;
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(apiTokenResult => ApiTokenModel.fromJSON(apiTokenResult));
  }

  create(apiToken: ApiTokenModel) {
    return this.http.post<any>(this.baseUrl,
      JSON.stringify(
        ApiTokenModel.toJSON(apiToken)
      )
    );
  }

  update(apiToken: ApiTokenModel) {
    return this.http.put<any>(`${this.baseUrl}/${apiToken.id}`,
      JSON.stringify(
        ApiTokenModel.toJSON(apiToken)
      )
    );
  }

  getAdditionalInfo(id) {
    return isDefined(id) ? this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(requestResults =>
      ApiTokenModel.fromJSON(requestResults))) : of(new ApiTokenModel());
  }

  revoke(id) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/revoke`, null);
  }
}
