import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../../../services/company-current-data.service';
import {UiKeyEnum} from '../../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../../../services/company-base-ui-key.service";

@Injectable()
export class ApiAuditUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showApiAudit() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_API_AUDIT);
  }
}
