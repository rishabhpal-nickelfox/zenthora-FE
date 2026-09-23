import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class VaultErrorsUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showVaultErrors() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_VAULT_ERRORS, UiKeyEnum.COMPANY_VAULT_ERRORS);
  }

  showSystemVaultErrors() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_VAULT_ERRORS);
  }
}
