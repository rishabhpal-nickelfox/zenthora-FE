import {CustomerCompanyRoleModel} from "./customer-company-role.model";
import {CustomerPermissionEnum} from "../../../../../customer-portal/src/enums/customer-permission.enum";
import {DocTypeEnum} from "../../enums/sale/doc-type.enum";

export class CurrentCustomerModel {
  email: string;
  companyRoles: CustomerCompanyRoleModel[];
  companyRole: CustomerCompanyRoleModel;
  companyName: string;
  companyLogo: {value: string, type: string};
  companyFavicon: {value: string, type: string};
  companyGlobalPaymentsEnabled: boolean;
  permissions: CustomerPermissionEnum[];
  saleTypes: DocTypeEnum[];
  theme: [string, string][];

  public constructor(email: string);
  public constructor(email: string, companies: CustomerCompanyRoleModel[]);
  public constructor(email: string, companies: CustomerCompanyRoleModel[], currentCompany: CustomerCompanyRoleModel);

  public constructor(...arr: any[]) {
    if (arr.length >= 1) {
      this.email = arr[0];
    }
    if (arr.length >= 2) {
      this.companyRoles = arr[1];
    }
    if (arr.length >= 3) {
      this.companyRole = arr[2];
    }
  }
}

export class CurrentCustomerAdditionalInfoModel {
  firstName: string;
  middleName: string;
  lastName: string;
}
