import {Inject, Injectable} from "@angular/core";
import {ObjectOperatingService} from "../../../../common/src/lib/utils/object-operating.service";
import {HttpClient} from "@angular/common/http";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {CompanyServiceUrl} from "../company-service-url";
import {SendgridSettingsModel} from "../../app/models/sendgrid/sendgrid-settings.model";
import {Observable, of} from "rxjs";
import {isDefined} from "../../../../common/src/lib/helpers/object.helper";
import {map} from "rxjs/operators";
import {BrandingModel} from "../../app/models/branding/branding.model";

@Injectable()
export class BrandingService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl(): any {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.BRANDING}`
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(settings => BrandingModel.fromJSON(settings));
  }

  create(brandingModel: BrandingModel) {
    return this.http.post<any>(this.baseUrl,
      JSON.stringify(BrandingModel.toJSON(brandingModel)));
  }

  update(brandingModel: BrandingModel) {
    return this.http.put<any>(`${this.baseUrl}/${brandingModel.id}`,
      JSON.stringify(BrandingModel.toJSON(brandingModel)));
  }


  getAdditionalInfo(id) {
  }

  enable(id) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/enable`, null);
  }

  disable(id) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/disable`, null);
  }

}
