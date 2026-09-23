import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CustomerServiceUrl} from "./customer-service-url";
import {ObjectOperatingService} from "../../../common/src/lib/utils/object-operating.service";
import {Observable} from "rxjs";
import {CustomerTransactionTableModel} from "../models/customer-transaction.model";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class CustomerTransactionService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.TRANSACTION}`;
  }

  create(object: any, ...additional: any): Observable<any> {
    throw new Error("Method not implemented.");
  }

  getAdditionalInfo(id) {
    throw new Error("Method not implemented.");
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(json => CustomerTransactionTableModel.fromJSON(json));
  }

  update(object: any, ...additional: any): Observable<any> {
    throw new Error("Method not implemented.");
  }
}
