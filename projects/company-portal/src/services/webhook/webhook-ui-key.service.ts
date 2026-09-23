import {Injectable} from "@angular/core";
import {CompanyCurrentDataService} from "../company-current-data.service";
import {UiKeyEnum} from "../../enums/usermanagement/ui-key.enum";
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class WebhookUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showWebhookErrors(): boolean {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_WEBHOOK_ERRORS);
  }

  canSuppressWebhookEvents(): boolean {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_SUPPRESS_WEBHOOK_EVENTS);
  }

}
