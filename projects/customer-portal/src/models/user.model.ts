import {PermissionModel} from "./permission.model";
import {CustomerUserStatusEnum} from "../enums/customer-user-status.enum";

export class UserModel {
  id: number;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  permissions: PermissionModel[];
  status: CustomerUserStatusEnum;
  expiresAt?: string;


  static fromJSON(json): UserModel {
    const user: UserModel = new UserModel();
    user.id = json.id;
    user.email = json.email;
    user.firstName = json.firstName;
    user.middleName = json.middleName;
    user.lastName = json.lastName;
    user.permissions = [...json.permissions.map(jsonPermission => PermissionModel.fromJSON(jsonPermission))];
    user.status = json.status;
    user.expiresAt = json.expiresAt;
    return user;
  }

  static toJSON(user: UserModel) {
    return {
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      permissions: user.permissions.map(permission => PermissionModel.toJSON(permission))
    }
  }
}
