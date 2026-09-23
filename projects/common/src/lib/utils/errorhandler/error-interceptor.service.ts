import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {
  CONNECTION_ERROR_HEADER,
  CONNECTION_ERROR_MSG,
  DEFAULT_ERROR_HEADER,
  getErrorMessageOrDefault,
  SENDING_REQUEST_FAILED_ERROR_HEADER,
  SENDING_REQUEST_FAILED_ERROR_MESSAGE
} from '../../enums/error-message.enum';
import {Observable, throwError} from 'rxjs';
import {QboDefaultErrorInterceptor} from './default-error-interceptor.service';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from '../base-settings-provider.service';
import {ErrorService} from './error.service';
import {catchError, map, mergeMap} from "rxjs/operators";
import {getMessage} from "../../helpers/string.helper";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../base-routing.service";
import {AUTHENTICATION_SERVICE_TOKEN, BaseAuthenticationService} from "../../services/base-authentication.service";
import {HttpCodeDescriptions} from "../../enums/utils/http-code-description";

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor extends QboDefaultErrorInterceptor {

  constructor(protected errorService: ErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected baseAuthService: BaseAuthenticationService, private http: HttpClient) {
    super(errorService, settingsProvider);
  }

  get interceptUrls(): string[] {
    return [this.settingsProvider.apiUrl];
  }


  isUserAlreadyExistsError(serverError: HttpErrorResponse) {
    return this.errorService.isUserAlreadyExistsError(serverError);
  }

  protected handleError(error): Observable<HttpEvent<any>> {
    if (this.errorService.is4xxLogicNotCheckedError(error)) {
      this.processLogicalError(error);
    } else if ((this.errorService.is400FieldValidationError(error) || this.errorService.is400ExistsError(error)) && !this.errorService.isCheckedErrorResponse(error)) {
      this.errorService.showFieldValidationError(error);
    } else if (this.errorService.is500CustomNotCheckedError(error)) {
      this.processServerError(error);
    } else if (this.errorService.isConnectionError(error)) {
      return this.processConnectionError(error);
    } else {
      return throwError(error);
    }
    return this.errorService.throwCheckedErrorResponse(error);
  }

  private processServerError(serverError: HttpErrorResponse) {
    this.errorService.showError(getMessage(DEFAULT_ERROR_HEADER, [serverError.status, HttpCodeDescriptions.get(serverError.status)]), getMessage(getErrorMessageOrDefault(serverError.error.errorCode), []));
  }

  private processLogicalError(serverError: HttpErrorResponse) {
    this.errorService.showError(getMessage(DEFAULT_ERROR_HEADER, [serverError.status, HttpCodeDescriptions.get(serverError.status)]), getMessage(getErrorMessageOrDefault(serverError.error.errorCode), this.getMessageParameters(serverError)));
  }

  private getMessageParameters(serverError: HttpErrorResponse): any[] {
    const metadata = serverError.error?.metadata;
    return metadata ? Object.values(metadata) : [];
  }

  private processConnectionError(serverError): Observable<HttpEvent<any>> {
    return this.http.get(this.settingsProvider.apiStatusUrl)
      .pipe(catchError(error => {
        this.errorService.showError(getMessage(DEFAULT_ERROR_HEADER, [error.status, CONNECTION_ERROR_HEADER]), CONNECTION_ERROR_MSG);
        return this.errorService.throwCheckedErrorResponse(serverError);
      }))
      .pipe(map(result => {
        this.errorService.showError(SENDING_REQUEST_FAILED_ERROR_HEADER, SENDING_REQUEST_FAILED_ERROR_MESSAGE);
      }))
      .pipe(mergeMap(() => this.errorService.throwCheckedErrorResponse(serverError)));
  }
}
