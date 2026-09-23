import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AUTHENTICATION_SERVICE_TOKEN, BaseAuthenticationService} from "../services/base-authentication.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../utils/base-routing.service";

@Injectable()
export abstract class AuthGuard implements CanActivate {
  constructor(@Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {

    return new Observable<boolean>(observer => {
      if (this.authService.isLoggedIn()) {
        observer.next(true);
      } else {
        this.routingService.navigateLoginPageAndBroadcast();
        observer.next(false);
      }
    });
  }
}

