import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class PlatformUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showPlatforms() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_MANAGE_PLATFORMS);
  }
}
