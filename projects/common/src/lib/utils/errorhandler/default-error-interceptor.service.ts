import {Inject, Injectable} from '@angular/core';
import {HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WsErrorInterceptor} from './ws-error.interceptor';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from '../base-settings-provider.service';
import {ErrorService} from './error.service';


@Injectable({
  providedIn: 'root',
})
export class QboDefaultErrorInterceptor extends WsErrorInterceptor {


  constructor(protected errorService: ErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(errorService, settingsProvider);
  }

  get interceptUrls(): string[] {
    return [this.settingsProvider.apiUrl];
  }

  protected handleError(error): Observable<HttpEvent<any>> {
    if (!this.errorService.isCheckedErrorResponse(error) && !this.errorService.is400ExistsError(error) && !this.errorService.is400FieldValidationError(error) && !this.errorService.is401Error(error)) {
      this.errorService.showDefaultError(error);
      return this.errorService.throwCheckedErrorResponse(error);
    } else {
      return throwError(error);
    }

  }


}
