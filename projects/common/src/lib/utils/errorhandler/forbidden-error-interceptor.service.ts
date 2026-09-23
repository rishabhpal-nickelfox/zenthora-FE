import {Inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {WsErrorInterceptor} from './ws-error.interceptor';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from '../base-settings-provider.service';
import {ForbiddenErrorService} from './forbidden-error.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GOOGLE_RECAPTCHA_ERROR_HEADER} from "../../enums/error-message.enum";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../base-routing.service";
import {AUTHENTICATION_SERVICE_TOKEN, BaseAuthenticationService} from "../../services/base-authentication.service";

@Injectable()
export abstract class ForbiddenErrorInterceptorService extends WsErrorInterceptor {

  constructor(protected errorService: ForbiddenErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(errorService, settingsProvider);
  }

  abstract get interceptUrls(): string[];

  protected handleError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (this.errorService.isForbidden(error)) {
      this.processForbiddenError(error);
      return this.errorService.throwCheckedErrorResponse(error);
    } else if (this.errorService.isGoogleRecaptchaError(error)) {
      this.processGoogleRecaptchaError(error);
      return this.errorService.throwCheckedErrorResponse(error);
    } else {
      return throwError(error);
    }
  }

  private processForbiddenError(serverError: HttpErrorResponse) {
    this.authService.updateCurrentPermissions();
  }

  private processGoogleRecaptchaError(serverError: HttpErrorResponse) {
    this.errorService.alertService.showError(GOOGLE_RECAPTCHA_ERROR_HEADER,
      serverError.error?.description);
  }

}
