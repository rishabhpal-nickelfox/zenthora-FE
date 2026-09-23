import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class CompanyManagementUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showCompanySettings() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.COMPANY_SETTINGS);
  }

  showCompanyPaymentForms() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.COMPANY_PAYMENT_FORMS);
  }

  showCompanySettingsMenu() {
    return this.showCompanySettings() || this.showCompanyPaymentForms();
  }


  showCompanySettingsCustomerPortal(): boolean{
    return this.currentDataService.getCurrentEntity().customerPortalEnabled;
  }

  showCompanySettingsTemplates(): boolean{
    const entity = this.currentDataService.getCurrentEntity();
    return entity.epsCheckout || entity.customerPortalEnabled;
  }
}
