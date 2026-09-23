import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WsErrorInterceptor} from '../../../../../../../common/src/lib/utils/errorhandler/ws-error.interceptor';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../../../../common/src/lib/utils/base-settings-provider.service';
import {ErrorService} from '../../../../../../../common/src/lib/utils/errorhandler/error.service';

@Injectable({
  providedIn: 'root'
})
export class UserExistsErrorInterceptorService extends WsErrorInterceptor {

  constructor(protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(errorService, settingsProvider);
  }

  get interceptUrls(): string[] {
    return [this.settingsProvider.apiUrl];
  }

  protected handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.errorService.isUserAlreadyExistsError(error)) {
      return this.errorService.throwCheckedErrorResponse(error);
    }
    return throwError(error);
  }
}
