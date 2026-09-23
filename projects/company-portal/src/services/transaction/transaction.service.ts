import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ObjectOperatingService} from "../../../../common/src/lib/utils/object-operating.service";
import {CompanyServiceUrl} from "../company-service-url";
import {getQueryParams} from "../../../../common/src/lib/helpers/url.helper";
import {TransactionModel} from "../../app/models/transactions/transaction.model";
import moment from "moment";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class TransactionService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.TRANSACTION}`;
  }

  create(object: any, ...additional: any): Observable<any> {
    throw new Error("Method not implemented.");
  }

  getAdditionalInfo(id) {
    throw new Error("Method not implemented.");
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(json => TransactionModel.fromJSON(json));
  }

  update(object: any, ...additional: any): Observable<any> {
    throw new Error("Method not implemented.");
  }

  export(filters: Map<string, string>, sortField?: string, sortDirection?: string) {
    return this.http.get<any>(`${this.baseUrl}/export?tzOffset=${moment().utcOffset()}&tzName=${moment.tz.guess()}`, {params: getQueryParams(filters, sortField, sortDirection)});
  }
}
