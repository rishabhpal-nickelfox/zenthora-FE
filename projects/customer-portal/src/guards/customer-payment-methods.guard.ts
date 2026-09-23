import {Inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {CustomerPermissionService} from "../services/customer-permission.service";
import {Observable} from "rxjs";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class CustomerPaymentMethodsGuard implements CanActivate {
  constructor(private customerPermissionService: CustomerPermissionService,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(observer => {
      if (this.customerPermissionService.canManagePaymentMethods) {
        observer.next(true);
      } else {
        this.routingService.navigateFirstUrl();
        observer.next(false);
      }
    });
  }

}
