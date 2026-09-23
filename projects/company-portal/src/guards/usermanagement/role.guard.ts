import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../../services/usermanagement/user.service';
import {UserManagementUiKeyService} from '../../services/usermanagement/user-management-ui-key.service';
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private userManagementUiKeyService: UserManagementUiKeyService,
              private userService: UserService,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {

    return new Observable<boolean>(observer => {
      if (this.userManagementUiKeyService.showRoleManagement()) {
        observer.next(true);
      } else {
        this.routingService.navigateFirstUrl();
        observer.next(false);
      }
    });
  }
}

