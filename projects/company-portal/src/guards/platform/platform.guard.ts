import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PlatformUiKeyService} from "../../services/platform/platform-ui-key.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class PlatformGuard implements CanActivate {
  constructor(private platformUiKeyService: PlatformUiKeyService,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {

    return new Observable<boolean>(observer => {
      if (this.platformUiKeyService.showPlatforms()) {
        observer.next(true);
      } else {
        this.routingService.navigateFirstUrl();
        observer.next(false);
      }
    });
  }
}
