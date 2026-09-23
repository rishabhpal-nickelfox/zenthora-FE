import {CustomerPermissionEnum} from "../enums/customer-permission.enum";

export interface CustomerUpdatePermissionsResponseModel {
  permissions: CustomerPermissionEnum[];
}
