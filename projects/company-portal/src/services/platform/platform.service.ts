import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {PlatformModel, PlatformTemplateSettings} from "../../app/models/platform/platform.model";
import {CompanyServiceUrl} from "../company-service-url";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {Page} from '../../../../common/src/lib/models/common/page.model';

@Injectable()
export class PlatformService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.PLATFORM}`;
  }

  getCandidates(name: string, page: number, size = 5): Observable<Page<PlatformModel>> {
    const params = new HttpParams({
      fromObject: {
        name,
        page: page,
        size: size,
      },
    });

    return this.http
      .get<Page<PlatformModel>>(`${this.baseUrl}/candidates`, {params})
      .pipe(
        map((resp) => ({
          ...resp,
          content: (resp.content).map((p) => PlatformModel.fromJSON(p)),
        }))
      );
  }


  getFromResponse(response: Page<unknown>): PlatformModel[] {
    return (response.content as unknown[]).map((p) => PlatformModel.fromJSON(p));
  }

  create(platform: PlatformModel): Observable<void> {
    return this.http.post<void>(this.baseUrl, PlatformModel.toJSON(platform));
  }

  update(platform: PlatformModel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${platform.id}`, PlatformModel.toJSON(platform));
  }

  generateToken(platform: PlatformModel): Observable<{ refreshToken: string }> {
    return this.http.post<{ refreshToken: string }>(`${this.baseUrl}/${platform.id}/generate-token`, {
      name: platform.name,
    });
  }

  enable(platformId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${platformId}/enable`, null);
  }

  disable(platformId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${platformId}/disable`, null);
  }

  delete(platformId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${platformId}`);
  }

  getAdditionalInfo(id: number): void {
  }

  getEmailTemplateSettings(id: number): Observable<PlatformTemplateSettings> {
    return this.http.get<any>(`${this.baseUrl}/${id}/templates`).pipe(map(response => PlatformTemplateSettings.fromJSON(response)))
  }

  getDefaultEmailTemplateSettings(): Observable<PlatformTemplateSettings> {
    return this.http.get<PlatformTemplateSettings>(`${this.baseUrl}/templates`).pipe(map(response => PlatformTemplateSettings.fromJSON(response)))
  }

  getDictionaries() {
    return this.http.get<any>(this.baseUrl + '/dictionaries');
  }
}
