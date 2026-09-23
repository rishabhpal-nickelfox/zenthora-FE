import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {convertJSONToSale, SaleModel} from '../../../../common/src/lib/models/sale/sale-model';
import {Observable, throwError} from "rxjs";
import {SalePreviewModelConverter} from "../../../../common/src/lib/models/sale/preview/sale-preview-model-converter";
import {SalePreviewViewModel} from "../../../../common/src/lib/models/sale/preview/sale-preview-view.model";
import {map} from "rxjs/operators";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class SaleService extends ObjectOperatingService {
  constructor(protected http: HttpClient,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/sales`;
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(json => convertJSONToSale(json));
  }

  getAdditionalInfo(id): Observable<SalePreviewViewModel> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(result => SalePreviewModelConverter.toViewModel(result)));
  }

  create(saleModel: SaleModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(saleModel: SaleModel): Observable<never> {
    return throwError('Unsupported operation');
  }
}
