import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {UIKeyService} from '../ui-key.service';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class UserManagementUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService, protected uiKeyService: UIKeyService) {
    super(currentDataService);
  }


  showAdminPage() {
    return this.uiKeyService.isSystemUserAdmin();
  }


  showUserManagement() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum[UiKeyEnum.SYSTEM_MANAGE_USERS],
      UiKeyEnum[UiKeyEnum.COMPANY_MANAGE_USERS]);
  }


  showRoleManagement() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum[UiKeyEnum.SYSTEM_MANAGE_ROLES],
      UiKeyEnum[UiKeyEnum.COMPANY_MANAGE_ROLES]);
  }

  showCompanyAdministration() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum[UiKeyEnum.SYSTEM_MANAGE_COMPANIES]);
  }

}
