import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {Observable} from "rxjs";
import {SalePreviewViewModel} from "../../../../common/src/lib/models/sale/preview/sale-preview-view.model";
import {map} from "rxjs/operators";
import {SalePreviewModelConverter} from "../../../../common/src/lib/models/sale/preview/sale-preview-model-converter";

@Injectable()
export class SalePdfService {
  constructor(protected http: HttpClient,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/pdf`;
  }

  getByKey(key): Observable<SalePreviewViewModel> {
    return this.http.get<any>(`${this.baseUrl}/${key}`).pipe(map(result => SalePreviewModelConverter.toViewModel(result)));
  }
}
