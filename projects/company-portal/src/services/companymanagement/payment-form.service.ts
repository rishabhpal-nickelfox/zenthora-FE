import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {CompanyServiceUrl} from '../company-service-url';
import {PaymentFormModel} from '../../app/models/companymanage/payment-form.model';

@Injectable()
export class PaymentFormService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.PAYMENT_FORMS}`;
  }

  create(object: any, ...additional: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, JSON.stringify(PaymentFormModel.toJSON(object)));
  }

  get(id: number): Observable<PaymentFormModel> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(json => PaymentFormModel.fromJSON(json)));
  }

  getAdditionalInfo(id) {
    throw new Error('Method not implemented.');
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(json => PaymentFormModel.fromJSON(json));
  }

  update(object: any, ...additional: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${object.id}`, JSON.stringify(PaymentFormModel.toJSON(object)));
  }

  activate(id: number) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/activate`, null);
  }

  deactivate(id: number) {
    return this.http.patch<any>(`${this.baseUrl}/${id}/deactivate`, null);
  }
}
