import {Inject, Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ForbiddenErrorInterceptorService
} from "../../../../common/src/lib/utils/errorhandler/forbidden-error-interceptor.service";
import {ForbiddenErrorService} from "../../../../common/src/lib/utils/errorhandler/forbidden-error.service";
import {AuthenticationService} from "../authentication.service";
import {CompanyServiceUrl} from "../company-service-url";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class CompanyForbiddenErrorInterceptorService extends ForbiddenErrorInterceptorService {

  constructor(protected errorService: ForbiddenErrorService,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              protected authService: AuthenticationService,
              public modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(errorService, settingsProvider, authService, modalService, routingService);
  }

  get interceptUrls(): string[] {
    return CompanyServiceUrl.urls.map(url => `${this.settingsProvider.apiUrl}/${url}`);
  }

}
