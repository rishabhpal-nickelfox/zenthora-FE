import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WsErrorInterceptor} from './ws-error.interceptor';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from '../base-settings-provider.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DEFAULT_ERROR_HEADER, getErrorMessageOrDefault} from '../../enums/error-message.enum';
import {DefaultErrorService} from './default-error.service';
import {getMessage} from "../../helpers/string.helper";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../base-routing.service";
import {HttpCodeDescriptions} from "../../enums/utils/http-code-description";

@Injectable({
  providedIn: 'root'
})
export class NotFoundErrorInterceptorService extends WsErrorInterceptor {

  constructor(protected errorService: DefaultErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,) {
    super(errorService, settingsProvider);
  }

  get interceptUrls(): string[] {
    return [this.settingsProvider.apiUrl];
  }

  protected handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.errorService.is404NotFound(error)) {
      this.processNotFoundError(error);
      return this.errorService.throwCheckedErrorResponse(error);
    } else {
      return throwError(error);
    }
  }

  private processNotFoundError(serverError: HttpErrorResponse) {
    this.errorService.alertService.showError(getMessage(DEFAULT_ERROR_HEADER, [serverError.status, HttpCodeDescriptions.get(serverError.status)]), getMessage(getErrorMessageOrDefault(serverError.error.errorCode), [serverError.error.metadata.id]));
  }


}
