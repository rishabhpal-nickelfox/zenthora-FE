import {Inject, Injectable} from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, finalize, shareReplay, switchMap, tap} from 'rxjs/operators';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../../utils/base-settings-provider.service";
import {CSRF_TOKEN_ERROR} from "../../enums/error-message.enum";

@Injectable()
export class XUiOriginInterceptor implements HttpInterceptor {

  constructor(
    private http: HttpClient,
    @Inject(SETTINGS_PROVIDER_TOKEN) private settingsProvider: BaseSettingsProvider
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.settingsProvider.initialized && request.url.includes(this.settingsProvider.apiUrl)) {
      const origin = window.location.origin
      request = request.clone({
        setHeaders: {
          'X-UI-Origin': origin,
        }
      });
    }
    return next.handle(request);
  }


}
