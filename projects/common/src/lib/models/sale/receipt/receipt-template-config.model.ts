import {ReceiptPrintWidthEnum} from "../../../enums/companymanagement/companysettings/receipt-print-width.enum";
import {
  ReceiptTemplateComponentEnum
} from "../../../enums/companymanagement/companysettings/receipt-template-component.enum";
import {ReceiptTemplateFieldEnum} from "../../../enums/companymanagement/companysettings/receipt-template-field.enum";

export class ReceiptTemplateModel {
  width: ReceiptPrintWidthEnum;
  components: ReceiptTemplateComponentEnum[];
  fields: ReceiptTemplateFieldEnum[];
  message: string;

  public static fromJSON(json: any): ReceiptTemplateModel {
    if (!json) {
      return null;
    }

    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return {
      width: parsed.receiptWidth ?? parsed.width,
      components: parsed.components ?? [],
      fields: parsed.fields ?? [],
      message: parsed.message ?? null,
    };
  }

  public static toJSON(config: ReceiptTemplateModel): string {
    const template = ReceiptTemplateModel.fromJSON(config);
    return template ? JSON.stringify({
      receiptWidth: template.width,
      components: template.components,
      fields: template.fields,
      message: template.message,
    }) : null;
  }
}
