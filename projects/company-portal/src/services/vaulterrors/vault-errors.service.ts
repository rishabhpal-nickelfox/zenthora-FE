import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {convertJSONToVaultErrorModel, VaultErrorModel} from "../../app/models/vaulterrors/vault-errors.model";
import {Observable, throwError} from "rxjs";
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class VaultErrorsService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.VAULT_ERROR}`;
  }


  getFromResponse(requestResult) {
    const vaultErrors = [];
    requestResult.content.forEach(vaultErrorsResult => {
      vaultErrors.push(convertJSONToVaultErrorModel(vaultErrorsResult));
    });
    return vaultErrors;
  }

  create(vaultError: VaultErrorModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(vaultError: VaultErrorModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  getAdditionalInfo(id): Observable<never> {
    return throwError('Unsupported operation');
  }
}
