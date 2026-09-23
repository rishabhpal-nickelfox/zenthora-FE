import {map} from 'rxjs/operators';
import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {BaseWebService} from "../../../../common/src/lib/services/base-web.service";
import {ObjectHelper} from "../../../../common/src/lib/helpers/object.helper";
import {VaultFeatures} from "../../app/models/companymanage/entity.model";
import {Observable} from "rxjs";

@Injectable()
export class VaultService implements BaseWebService {

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/vault`;
  }

    constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    }

  connect(companyId: number, platformId: number, vaultCompanyId: string, vaultUserId: string, vaultAuthKey: string): Observable<VaultFeatures> {
    return this.http.post<any>(`${this.baseUrl}/connect`, JSON.stringify(
      {
        companyId: ObjectHelper.isDefined(companyId) ? companyId : null,
        platformId: platformId,
        vaultCompanyId: vaultCompanyId,
        vaultUserId: vaultUserId,
        vaultAuthKey: vaultAuthKey
      }
    )).pipe(map(result => VaultFeatures.fromJSON(result)));
  }

    checkConfigured() {
        return this.http.get<any>(this.baseUrl + '/configured').pipe(map(requestResult =>
            requestResult.configured
        ));
    }

    getBrandingLogo() {
        return this.http.get<any>(this.baseUrl + '/branding-logo-url').pipe(map(requestResult =>
            requestResult ? requestResult.brandingLogoUrl : null
        ));
    }

    syncPaymentMethods(id) {
        return this.http.post<any>(this.baseUrl + '/sync-payment-methods',
            {
                companyId: id
            });
    }
}
