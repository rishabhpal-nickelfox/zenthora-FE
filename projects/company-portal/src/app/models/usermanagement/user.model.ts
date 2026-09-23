import { Mask } from '../../../../../common/src/lib/helpers/mask';
import {convertJSONToRole, convertRolesArrayToRolesGroupedByEntitiesMap, RoleModel} from './role.model';

export class UserModel {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  currentRole: RoleModel;
  roles: RoleModel[] = [];
  rolesMap = new Map();
  contactInfo: UserContactInfo = new UserContactInfo();
  disabled: boolean;
  mustChangePassword: boolean;
  showEula: boolean;
  emvKey: string;


  static fromJSON(json): UserModel {
    const user: UserModel = Object.assign(new UserModel(), json);
    user.username = json.email;
    user.roles = [];
    if (json.roles) {
      json.roles.forEach(role => user.roles.push(convertJSONToRole(role)));
    }
    user.rolesMap = convertRolesArrayToRolesGroupedByEntitiesMap(user.roles);
    user.showEula = true;
    return user;
  }
}

export class UserContactInfo {
  mainPhone: string;
  workPhone: string;
  mobile: string;
  fax: string;
  ccEmail: string;

  static toJSON(contactInfo: UserContactInfo) {
    const requestContactInfo = new UserContactInfo();
    if (contactInfo) {
      requestContactInfo.ccEmail = contactInfo.ccEmail;
      requestContactInfo.mainPhone = Mask.unmaskPhone(contactInfo.mainPhone);
      requestContactInfo.workPhone = Mask.unmaskPhone(contactInfo.workPhone);
      requestContactInfo.mobile = Mask.unmaskPhone(contactInfo.mobile);
      requestContactInfo.fax = Mask.unmaskPhone(contactInfo.fax);
    }
    return requestContactInfo;
  }
}

