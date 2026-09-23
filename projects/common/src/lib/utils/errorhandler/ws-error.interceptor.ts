import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap} from 'rxjs/operators';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../base-settings-provider.service";
import {Inject} from "@angular/core";
import {ErrorService} from "./error.service";
import {getMessage} from "../../helpers/string.helper";
import {DEFAULT_ERROR_HEADER} from "../../enums/error-message.enum";
import {HttpCodeDescriptions} from "../../enums/utils/http-code-description";
import {DefaultErrorService} from "./default-error.service";

export abstract class WsErrorInterceptor implements HttpInterceptor {
  abstract get interceptUrls(): string[];

  protected constructor(protected errorService: DefaultErrorService,
                        @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(mergeMap(result => {
        if (request.url != this.settingsProvider.apiStatusUrl && this.interceptUrls.find(interceptUrl => request.url.includes(interceptUrl))) {
          return this.handleErrorInResult(result);
        }
        return of(result);
      }))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (request.url != this.settingsProvider.apiStatusUrl && this.interceptUrls.find(interceptUrl => request.url.includes(interceptUrl))) {
            return this.handleError(error);
          }
          return throwError(error);
        })
      );
  }

  protected abstract handleError(error: HttpErrorResponse): Observable<HttpEvent<any>>;

  protected handleErrorInResult(result: HttpEvent<any>): Observable<HttpEvent<any>> {
    return of(result);
  }


  showServerError(error, body: string) {
    this.errorService.showError(getMessage(DEFAULT_ERROR_HEADER, [error.status, HttpCodeDescriptions.get(error.status)]), body);
  }
}
