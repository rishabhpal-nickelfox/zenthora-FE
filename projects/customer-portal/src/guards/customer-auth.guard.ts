import {AuthGuard} from "../../../common/src/lib/guards/auth.guard";
import {Inject, Injectable} from "@angular/core";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {
  AUTHENTICATION_SERVICE_TOKEN,
  BaseAuthenticationService
} from "../../../common/src/lib/services/base-authentication.service";

@Injectable()
export class CustomerAuthGuard extends AuthGuard {
  constructor(@Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(authService, routingService)
  }

}
