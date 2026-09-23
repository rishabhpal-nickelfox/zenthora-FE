import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {isDefined} from '../../helpers/object.helper';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../../utils/base-settings-provider.service";
import {AUTHENTICATION_SERVICE_TOKEN, BaseAuthenticationService} from "../base-authentication.service";
import {catchError, mergeMap} from "rxjs/operators";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../utils/base-routing.service";
import {ErrorService} from "../../utils/errorhandler/error.service";

@Injectable()
export abstract class EPSAuthInterceptor implements HttpInterceptor {

  constructor(protected cookieService: CookieService,
              protected errorService: ErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.settingsProvider.initialized && request.url != this.settingsProvider.apiStatusUrl && this.interceptUrls.find(interceptUrl => request.url.includes(interceptUrl))) {
      request = request.clone({
        withCredentials: true
      });
      return next.handle(request).pipe(catchError(error => {
        if (this.errorService.isJWTTokenExpiredError(error) && !request.url.includes(this.authService.refreshUrl)) {
          return this.authService.refreshToken().pipe(mergeMap(() => next.handle(request)));
        }
        return throwError(error);
      }));
    }
    return next.handle(request);
  }

  abstract get COOKIE_LOGGED_IN(): string;
  abstract get interceptUrls(): string[];
}


