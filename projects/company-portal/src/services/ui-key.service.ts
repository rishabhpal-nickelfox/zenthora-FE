import {Injectable} from '@angular/core';

import {UiKeyEnum} from '../enums/usermanagement/ui-key.enum';
import {CompanyCurrentDataService} from './company-current-data.service';
import {CompanyBaseUiKeyService} from "./company-base-ui-key.service";

@Injectable()
export class UIKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  isSystemUserAdmin() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum[UiKeyEnum.SYSTEM_MANAGE_USERS]);
  }

  isSystemCompaniesAdmin() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum[UiKeyEnum.SYSTEM_MANAGE_COMPANIES]);
  }
}

