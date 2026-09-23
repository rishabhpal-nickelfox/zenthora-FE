import {CustomerPermissionEnum} from "../enums/customer-permission.enum";

export class PermissionModel {
  name: string;
  permissionKey: CustomerPermissionEnum;
  protected: boolean;


  static fromJSON(json): PermissionModel {
    const permission = new PermissionModel();
    permission.name = json.name;
    permission.permissionKey = json.permissionKey;
    permission.protected = json.protected;
    return permission;
  }

  static toJSON(permission: PermissionModel) {
    return {
      permissionKey: permission.permissionKey
    }
  }
}
