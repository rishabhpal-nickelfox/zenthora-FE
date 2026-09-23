import {PermissionModel} from './permission.model';
import {EntityModel} from '../companymanage/entity.model';

export class RoleModel {
  id: number;
  name: string;
  pending = false;
  entity: EntityModel;
  admin = false;
  permissions: PermissionModel[] = [];
}

export function convertRoleToJSON(role: RoleModel) {
  return {
    name: role.name,
    entityId: role.entity.id,
    uiKeys: role.permissions.map(permissions => permissions.uiKey)
  };
}

export function convertJSONToRole(json): RoleModel {
  const role: RoleModel = new RoleModel;
  role.id = json.roleId || json.id;
  role.name = json.name;
  role.pending = json.pending;
  role.entity = json.entity;
  role.admin = json.admin;
  role.permissions = json.permissions;
  return role;
}

export function convertRolesArrayToRolesGroupedByEntitiesMap(roles) {
  const rolesGroupedByEntities = new Map();
  if (roles) {
    roles.reduce(function (map, obj) {
      const values = rolesGroupedByEntities.get(obj.entity.id) || [];
      values.push(obj);
      rolesGroupedByEntities.set(obj.entity.id, values);
    }, {});
  }
  return rolesGroupedByEntities;
}
