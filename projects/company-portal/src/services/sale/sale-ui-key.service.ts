import {Injectable} from '@angular/core';
import {CompanyCurrentDataService} from '../company-current-data.service';
import {UiKeyEnum} from '../../enums/usermanagement/ui-key.enum';
import {CompanyBaseUiKeyService} from "../company-base-ui-key.service";

@Injectable()
export class SaleUiKeyService extends CompanyBaseUiKeyService {

  constructor(protected currentDataService: CompanyCurrentDataService) {
    super(currentDataService);
  }

  showInvoices() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_VIEW_SALES, UiKeyEnum.COMPANY_VIEW_SALES);
  }

  showSystemSales() {
    return this.userCurrentRoleContainsPermissions(UiKeyEnum.SYSTEM_VIEW_SALES);
  }
}
