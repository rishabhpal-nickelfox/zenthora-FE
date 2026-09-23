import {PermissionModel} from "./permission.model";

export class CurrentUserModel {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  roles: CurrentRoleModel[] = [];
  currentRole: CurrentRoleModel;
  disabled: boolean;
  mustChangePassword: boolean;
  showEula: boolean;
}

export class CurrentRoleModel {
  id: number;
  name: string;
  entity: CurrentEntityModel;
  permissions: PermissionModel[] = [];
}


export class CurrentEntityModel {
  id: number;
  legalName: string;
  vaultCompanyId: number;
  logoUrl: string;
  customerPortalEnabled: boolean;
  epsCheckout: boolean;
}
