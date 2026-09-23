import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class BrandingUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showBranding() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_MANAGE_BRANDING);
  }
}
