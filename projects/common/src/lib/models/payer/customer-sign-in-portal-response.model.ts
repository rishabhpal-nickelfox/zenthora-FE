import {CustomerCompanyRoleModel} from "./customer-company-role.model";

export class CustomerSignInPortalResponseModel {
  mustChangePassword: boolean;
  customerRoles: CustomerCompanyRoleModel[];
}
