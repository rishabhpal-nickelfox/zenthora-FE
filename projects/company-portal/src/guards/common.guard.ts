import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Inject} from "@angular/core";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";

export abstract class CommonGuard implements CanActivate {
  constructor(@Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {

    return new Observable<boolean>(observer => {
      if (this.condition) {
        observer.next(true);
      } else {
        this.routingService.navigateFirstUrl();
        observer.next(false);
      }
    });
  }

  abstract get condition();
}

