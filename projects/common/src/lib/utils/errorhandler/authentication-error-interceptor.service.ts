import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AUTHENTICATION_SERVICE_TOKEN, BaseAuthenticationService} from "../../services/base-authentication.service";
import {WsErrorInterceptor} from "./ws-error.interceptor";
import {ErrorService} from "./error.service";
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../base-routing.service";

@Injectable()
export abstract class AuthenticationErrorInterceptorService extends WsErrorInterceptor {

  constructor(protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authServiceToken: BaseAuthenticationService) {
    super(errorService, settingsProvider);
  }

  abstract get  interceptUrls(): string[];

  protected handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.errorService.is401NotCheckedError(error)) {
      this.process401Error(error);
      return this.errorService.throwCheckedErrorResponse(error);
    } else {
      return throwError(error);
    }
  }

  protected abstract process401Error(error: HttpErrorResponse);

}
