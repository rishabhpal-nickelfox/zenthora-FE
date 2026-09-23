import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../../utils/base-settings-provider.service";
import {Observable} from "rxjs";
import {TermEnum} from "../../enums/term.enum";
import {map} from "rxjs/operators";

@Injectable()
export class TermService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  get baseUrl() {
    return this.settingsProvider.apiUrl + '/term';
  }

  getTerm(termType: TermEnum){
    return this.http.get<any>(`${this.baseUrl}?termType=${termType}`).pipe(map(result => result.termBase64));
  }

  getTermsOfService(): Observable<string> {
    return this.getTerm(TermEnum.TERMS_OF_SERVICE);
  }

  getPrivacyStatement(): Observable<string> {
    return this.getTerm(TermEnum.PRIVACY_STATEMENT);
  }

  getEULA(): Observable<string> {
    return this.getTerm(TermEnum.EULA);
  }
}
