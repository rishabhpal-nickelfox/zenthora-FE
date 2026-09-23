import {UserModel} from './user.model';

import {ContactInfoModel, convertContactInfoToJSON} from "../../../../../common/src/lib/models/common/contact-info.model";
import {Mask} from "../../../../../common/src/lib/helpers/mask";

export class UserCreateEditRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  roles: number[] = [];
  contactInfo: ContactInfoModel = new ContactInfoModel();

  constructor(user: UserModel) {
    this.firstName = user.firstName;
    this.middleName = user.middleName;
    this.lastName = user.lastName;
    this.email = user.username;
    this.roles = user.roles.map(role => role.id);
    this.contactInfo.mainPhone = Mask.unmaskPhone(user.contactInfo.mainPhone);
    this.contactInfo.mobile = Mask.unmaskPhone(user.contactInfo.mobile);
    this.contactInfo.fax = Mask.unmaskPhone(user.contactInfo.fax);
    this.contactInfo.ccEmail = Mask.unmaskPhone(user.contactInfo.ccEmail);
  }
}

export class UserSystemAdminCreateRequest extends UserCreateEditRequest {

  static toJSON(user: UserModel): UserSystemAdminCreateRequest {
    const request = new UserSystemAdminCreateRequest(user);
    return request;
  }

}

export class UserSystemAdminUpdateRequest extends UserCreateEditRequest {
  resetPassword: boolean;
  mustChangePassword: boolean;

  static toJSON(user: UserModel, resetPassword: boolean, mustChangePassword: boolean): UserSystemAdminUpdateRequest {
    const request = new UserSystemAdminUpdateRequest(user);
    request.resetPassword = resetPassword;
    request.mustChangePassword = mustChangePassword;
    return request;
  }

}

export class UserCompanyAdminCreateRequest extends UserCreateEditRequest {

  static toJSON(user: UserModel): UserCompanyAdminCreateRequest {
    const request = new UserCompanyAdminCreateRequest(user);
    return request;

  }
}

export class UserCompanyAdminUpdateRequest {

  static toJSON(user: UserModel): number[]  {
    return user.roles.map(role => role.id);

  }
}


export class CurrentUserUpdateRequest extends UserCreateEditRequest {

  static toJSON(user: UserModel): CurrentUserUpdateRequest {
    const request = new CurrentUserUpdateRequest(user);
    return request;
  }
}
