import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class AuditErrorsManagementUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showUserAudit() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_API_AUDIT, UiKeyEnum.SYSTEM_SENDGRID_AUDIT,
      UiKeyEnum.SYSTEM_USER_AUDIT, UiKeyEnum.COMPANY_USER_AUDIT);
  }

  showApiActivityAudit() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_API_AUDIT);
  }
}
