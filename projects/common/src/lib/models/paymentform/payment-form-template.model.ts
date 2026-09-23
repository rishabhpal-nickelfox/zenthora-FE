import {PaymentFormControlType} from "../../enums/payment-form-control-type.enum";

export class PaymentFormTemplateItem {
  id: string;
  type: PaymentFormControlType;
  requirement?: boolean;
  label?: string;
  value?: any;
  options?: string[];
  imageContentType?: string;
  originalCols?: number;
  originalRows?: number;
  x: number;
  y: number;
  cols: number;
  rows?: number;
  textareaRows?: number;
  minItemRows?: number;
  maxItemRows?: number;

  static generateId(type: PaymentFormControlType): string {
    return `${type}${crypto.randomUUID()}`;
  }

  static fromJSON(json: any): PaymentFormTemplateItem {
    const item = new PaymentFormTemplateItem();
    item.type = json.type ?? PaymentFormControlType.INPUT;
    item.id = json.id ?? PaymentFormTemplateItem.generateId(item.type);
    item.requirement = json.requirement ?? false;
    item.label = json.label;
    item.value = json.value;
    item.imageContentType = json.imageContentType;
    item.originalCols = json.originalCols;
    item.originalRows = json.originalRows;
    item.options = json.options ?? [];
    item.x = json.x;
    item.y = json.y;
    item.cols = json.cols;
    item.rows = json.rows;
    item.textareaRows = json.textareaRows;
    return item;
  }

  static parseTemplate(template: string): PaymentFormTemplateItem[] {
    if (!template) return [];

    try {
      const parsed = JSON.parse(template);
      return Array.isArray(parsed)
        ? parsed.map(PaymentFormTemplateItem.fromJSON)
        : [];
    } catch {
      return [];
    }
  }

  static toJSON(instance: PaymentFormTemplateItem): Record<string, any> {
    const result: Record<string, any> = {
      id: instance.id,
      type: instance.type,
      x: instance.x,
      y: instance.y,
      cols: instance.cols,
      rows: instance.rows ?? 2
    };

    if (instance.type === PaymentFormControlType.TEXT) {
      result.value = instance.value ?? '';
    } else if (instance.type === PaymentFormControlType.LOGO) {
      // no extra fields
    } else if (instance.type === PaymentFormControlType.IMAGE) {
      result.value = instance.value;
      result.imageContentType = instance.imageContentType;
      result.originalCols = instance.originalCols;
      result.originalRows = instance.originalRows;
    } else {
      result.requirement = instance.requirement ?? false;
      result.label = instance.label;
      if (instance.type === PaymentFormControlType.SELECT) {
        result.options = (instance.options ?? []).map(option => option?.trim()).filter(option => !!option);
      }
      if (instance.type === PaymentFormControlType.TEXTAREA && instance.textareaRows != null) {
        result.textareaRows = instance.textareaRows;
      }
    }

    return result;
  }
}

export const PaymentFormTemplateLayout = {
  cellHeight: 34,
  textareaLineHeight: 17,
  textareaPaddingY: 4,
  textareaBorderY: 1,
  gridsterDivPaddingY: 5,
  labelHeight: 28
} as const;
