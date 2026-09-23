import {AuthGuard} from "../../../common/src/lib/guards/auth.guard";
import {Inject, Injectable} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class CompanyAuthGuard extends AuthGuard {
  constructor(protected authService: AuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(authService, routingService)
  }

}
