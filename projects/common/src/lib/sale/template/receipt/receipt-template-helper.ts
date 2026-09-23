import {ReceiptTemplateModel} from "../../../models/sale/receipt/receipt-template-config.model";
import {
  ReceiptTemplateComponentEnum
} from "../../../enums/companymanagement/companysettings/receipt-template-component.enum";
import {
  ReceiptTemplateFieldComponent,
  ReceiptTemplateFieldEnum
} from "../../../enums/companymanagement/companysettings/receipt-template-field.enum";

export class ReceiptTemplateHelper {
  static hasReceiptTemplateComponent(
    config: ReceiptTemplateModel,
    component: ReceiptTemplateComponentEnum,
  ): boolean {
    return !!config?.components?.includes(component);
  }

  static hasReceiptTemplateField(
    config: ReceiptTemplateModel,
    field: ReceiptTemplateFieldEnum,
  ): boolean {
    return !!config?.fields?.includes(field);
  }

  static getReceiptTemplateFieldsByComponent(
    component: ReceiptTemplateComponentEnum,
  ): ReceiptTemplateFieldEnum[] {
    return (Object.values(ReceiptTemplateFieldEnum) as ReceiptTemplateFieldEnum[])
      .filter(field => ReceiptTemplateFieldComponent[field] === component);
  }

  static hasAnyReceiptTemplateField(
    config: ReceiptTemplateModel,
    component: ReceiptTemplateComponentEnum,
  ): boolean {
    const fields = ReceiptTemplateHelper.getReceiptTemplateFieldsByComponent(component);
    return fields.some(field => ReceiptTemplateHelper.hasReceiptTemplateField(config, field));
  }

  static addReceiptTemplateComponent(
    config: ReceiptTemplateModel,
    component: ReceiptTemplateComponentEnum,
  ): void {
    if (!config.components.includes(component)) {
      config.components.push(component);
    }

    ReceiptTemplateHelper.getReceiptTemplateFieldsByComponent(component)
      .forEach(field => ReceiptTemplateHelper.addReceiptTemplateField(config, field));
  }

  static removeReceiptTemplateComponent(
    config: ReceiptTemplateModel,
    component: ReceiptTemplateComponentEnum,
  ): void {
    config.components = config.components.filter(value => value !== component);
    ReceiptTemplateHelper.removeReceiptTemplateFields(
      config,
      ReceiptTemplateHelper.getReceiptTemplateFieldsByComponent(component)
    );
  }

  static addReceiptTemplateField(
    config: ReceiptTemplateModel,
    field: ReceiptTemplateFieldEnum,
  ): void {
    if (!config.fields.includes(field)) {
      config.fields.push(field);
    }
  }

  static removeReceiptTemplateField(
    config: ReceiptTemplateModel,
    field: ReceiptTemplateFieldEnum,
  ): void {
    ReceiptTemplateHelper.removeReceiptTemplateFields(config, [field]);
  }

  static replaceReceiptTemplateComponentFields(
    config: ReceiptTemplateModel,
    component: ReceiptTemplateComponentEnum,
    fields: ReceiptTemplateFieldEnum[],
  ): void {
    ReceiptTemplateHelper.removeReceiptTemplateFields(
      config,
      ReceiptTemplateHelper.getReceiptTemplateFieldsByComponent(component)
    );
    fields.forEach(field => ReceiptTemplateHelper.addReceiptTemplateField(config, field));
  }

  private static removeReceiptTemplateFields(
    config: ReceiptTemplateModel,
    fields: ReceiptTemplateFieldEnum[],
  ): void {
    const fieldsToRemove = new Set(fields);
    config.fields = config.fields.filter(value => !fieldsToRemove.has(value));
  }
}
