import {Inject, Injectable} from "@angular/core";
import {CustomerRoutingService} from "../services/customer-routing.service";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {CustomerCurrentDataService} from "../services/customer-current-data.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class CustomerPortalAvailableGuard implements CanActivate {
  constructor(protected currentDataService: CustomerCurrentDataService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: CustomerRoutingService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {

    return new Observable<boolean>(observer => {
      if (this.currentDataService.currentCustomer.companyRole.customerPortalEnabled) {
        observer.next(true);
      } else {
        this.routingService.navigateCustomerPortalUnavailablePath();
        observer.next(false);
      }
    });
  }

}
