export const SYSTEM_ENTITY_TYPE: EntityTypeModel = {
  id: 1,
  name: 'System'
};
export const COMPANY_ENTITY_TYPE: EntityTypeModel = {
  id: 2,
  name: 'Company'
};

export class EntityTypeModel {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static isSystemEntityType(entityType: EntityTypeModel): boolean {
    return entityType.id === SYSTEM_ENTITY_TYPE.id;
  }

  static isCompanyEntityType(entityType: EntityTypeModel): boolean {
    return entityType.id === COMPANY_ENTITY_TYPE.id;
  }
}
