import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from '../../utils/base-settings-provider.service';
import {Observable, of} from 'rxjs';
import {CreditCardTypeResponseModel} from "../../models/sale/credit-card.model";
import {ObjectHelper} from "../../helpers/object.helper";


@Injectable()
export class CreditCardService {

  constructor(private http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  get baseUrl() {
    return this.settingsProvider.apiUrl + '/credit-cards';
  }

  getCreditCardType(cardNumber: string): Observable<CreditCardTypeResponseModel> {
    return ObjectHelper.isDefined(cardNumber) ? this.http.post<CreditCardTypeResponseModel>(this.baseUrl + '/type', {
      cardNumber
    }) : of(null);
  }

}
