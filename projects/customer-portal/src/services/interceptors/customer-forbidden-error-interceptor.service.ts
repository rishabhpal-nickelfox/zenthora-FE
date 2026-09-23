import {Inject, Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ForbiddenErrorInterceptorService
} from "../../../../common/src/lib/utils/errorhandler/forbidden-error-interceptor.service";
import {ForbiddenErrorService} from "../../../../common/src/lib/utils/errorhandler/forbidden-error.service";
import {CustomerServiceUrl} from "../customer-service-url";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {
  AUTHENTICATION_SERVICE_TOKEN,
  BaseAuthenticationService
} from "../../../../common/src/lib/services/base-authentication.service";


@Injectable()
export class CustomerForbiddenErrorInterceptorService extends ForbiddenErrorInterceptorService {

  constructor(protected errorService: ForbiddenErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(errorService, settingsProvider, authService, modalService, routingService);
  }

  get interceptUrls(): string[] {
    return CustomerServiceUrl.urls.map(url => `${this.settingsProvider.apiUrl}/${url}`);
  }

}
