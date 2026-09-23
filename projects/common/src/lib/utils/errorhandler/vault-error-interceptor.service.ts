import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {ErrorMessageEnum, VAULT_ERROR_HEADER} from '../../enums/error-message.enum';
import {Observable, throwError} from 'rxjs';
import {WsErrorInterceptor} from './ws-error.interceptor';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from '../base-settings-provider.service';
import {VaultErrorService} from './vault-error.service';
import {getMessage, isEmptyString} from "../../helpers/string.helper";
import {isDefined} from "../../helpers/object.helper";

@Injectable({
  providedIn: 'root'
})
export class VaultErrorInterceptor extends WsErrorInterceptor {

  constructor(protected errorService: VaultErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(errorService, settingsProvider);
  }

  get interceptUrls(): string[] {
    return [this.settingsProvider.apiUrl];
  }

  protected handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.errorService.is5xxVaultError(error)) {
      this.processVaultError(error);
      return this.errorService.throwCheckedErrorResponse(error);
    } else if (this.errorService.isInvalidVaultCredentialsError(error)) {
      this.processInvalidVaultSubscription();
      return this.errorService.throwCheckedErrorResponse(error);
    } else {
      return throwError(error);
    }
  }

  private processInvalidVaultSubscription() {
    this.errorService.alertService.showError(VAULT_ERROR_HEADER,
      ErrorMessageEnum.invalid_vault_credentials);
  }


  private processVaultError(serverError: HttpErrorResponse) {
    const metadata = serverError.error.metadata;
    let errorString = this.getBankErrorString(metadata);
    if (isEmptyString(errorString.trim())) {
      errorString = this.getVaultErrorString(metadata);
    }
    this.errorService.alertService.showError(VAULT_ERROR_HEADER, errorString);
  }

  private getBankErrorString(bankError: { bankErrorCode: string, bankErrorMessage: string }) {
    let bankErrorCodeString = '', bankErrorMessageString = '';
    if (isDefined(bankError.bankErrorCode)) {
      bankErrorCodeString = getMessage(ErrorMessageEnum.bank_error_code, [bankError.bankErrorCode]);
    }
    if (isDefined(bankError.bankErrorCode)) {
      bankErrorMessageString = getMessage(ErrorMessageEnum.bank_error_message, [bankError.bankErrorMessage]);
    }
    return `${bankErrorCodeString} ${bankErrorMessageString}`;
  }

  private getVaultErrorString(vaultError: { errorCode: string, message: string }) {
    let vaultErrorCodeString = '', vaultErrorMessageString = '';
    if (isDefined(vaultError.errorCode)) {
      vaultErrorCodeString = getMessage(ErrorMessageEnum.vault_error_code, [vaultError.errorCode]);
    }
    if (isDefined(vaultError.message)) {
      vaultErrorMessageString = getMessage(ErrorMessageEnum.vault_error_message, [vaultError.message]);
    }
    return `${vaultErrorCodeString} ${vaultErrorMessageString}`;
  }
}
