import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DefaultErrorService} from './default-error.service';

@Injectable({
    providedIn: 'root'
})
export class VaultErrorService extends DefaultErrorService {

  is5xxVaultError(serverError: HttpErrorResponse): boolean {
    return serverError.status === 500 && serverError?.error?.errorCode === 'vault_error';
  }


  isInvalidVaultCredentialsError(serverError: HttpErrorResponse): boolean {
    return serverError?.error?.errorCode === 'invalid_vault_credentials';
  }


  isVaultError(serverError: HttpErrorResponse): boolean {
    return this.is5xxVaultError(serverError) || this.isInvalidVaultCredentialsError(serverError);
  }

}
