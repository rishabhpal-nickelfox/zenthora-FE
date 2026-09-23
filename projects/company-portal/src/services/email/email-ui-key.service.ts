import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class EmailUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showEmails() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_VIEW_EMAILS, UiKeyEnum.COMPANY_VIEW_EMAILS);
  }

  showSystemEmails() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_VIEW_EMAILS);
  }
}
