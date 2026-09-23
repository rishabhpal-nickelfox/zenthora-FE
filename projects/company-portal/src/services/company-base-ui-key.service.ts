import {BaseUiKeyService} from "../../../common/src/lib/services/base-ui-key.service";
import {CompanyCurrentDataService} from "./company-current-data.service";

export abstract class CompanyBaseUiKeyService extends BaseUiKeyService {


  protected constructor(protected currentDataService: CompanyCurrentDataService) {
    super();
  }

  protected userCurrentRoleContainsPermissions(...uiKeys) {
    let hasPermissions = false;
    if (this.currentDataService.getCurrentUser() && this.currentDataService.getCurrentUser().currentRole && this.currentDataService.getCurrentUser().currentRole.permissions) {
      this.currentDataService.getCurrentUser().currentRole.permissions.forEach(permission => {
        uiKeys.forEach(function (uiKey) {
          hasPermissions = hasPermissions || permission.uiKey === uiKey;
        });
      });
    }
    return hasPermissions;
  }
}
