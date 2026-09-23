import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WsErrorInterceptor} from '../../../../common/src/lib/utils/errorhandler/ws-error.interceptor';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {PaymentErrorService} from '../../../../common/src/lib/utils/errorhandler/payment-error.service';


@Injectable()
export class PaymentErrorInterceptor extends WsErrorInterceptor {

  constructor(protected errorService: PaymentErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(errorService, settingsProvider);
  }

  get interceptUrls(): string[] {
    return [this.settingsProvider.apiUrl];
  }

  protected handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.errorService.is4xxInvoiceHasChangedError(error) || this.errorService.is4xxBadPaymentAmountError(error)) {
      const errorResponse = Object.assign(error, {status: -1});
      errorResponse.error.checked = true;
      return throwError(errorResponse);
    } else {
      return throwError(error);
    }
  }

}
