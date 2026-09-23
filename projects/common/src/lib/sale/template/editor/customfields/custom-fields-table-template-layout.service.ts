import {Injectable} from '@angular/core';
import {InvoiceEmailTemplateLayoutCommonService} from '../invoice-email-template-layout-common.service';
import {
  CustomFieldGridAreaModel,
  CustomFieldsTemplateModel,
  InvoiceComponentTemplateModel, InvoiceTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../../helpers/object.helper";
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";


@Injectable()
export class CustomFieldsTableTemplateLayoutService extends InvoiceEmailTemplateLayoutCommonService {

  protected _templates: CustomFieldsTemplateModel[];
  private _defaultTemplate: InvoiceComponentTemplateModel;
  private readonly _defaultCustomFields: CustomFieldGridAreaModel[] = [];
  private _customFieldsEnabled: boolean;
  static readonly CUSTOM_FIELDS_ROW_MAX_SIZE = 6;

  /**
   * Optional list of custom field names available for the company, used to
   * suggest header values in the editor. Empty by default (free-text input).
   */
  availableCustomFieldNames: string[] = [];

  constructor() {
    super();
  }


  addItem(layout: CustomFieldGridAreaModel[], name: string): boolean {
    layout.push({
      cols: 1,
      id: InvoiceTemplateModel.generateGridAreaId(InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS),
      name: name,
      rows: 1,
      x: 0,
      y: 0
    });
    return false;
  }


  getTemplate(customFieldTemplateId: string): CustomFieldsTemplateModel {
    return this._templates && ObjectHelper.isDefined(customFieldTemplateId) ? this._templates.find(customFieldTemplate => customFieldTemplate.id == customFieldTemplateId) : null;
  }

  initTemplates(templates: CustomFieldsTemplateModel[], defaultTemplate: InvoiceComponentTemplateModel) {
    this._templates = templates ?? [];
    this._defaultTemplate = defaultTemplate;
    this.settingsChanged.emit([undefined, ...this._templates.map(customFieldTemplate => customFieldTemplate.id)]);
  }

  getMinimumCols() {
    return Math.min(2 * this.layout.length, 12);
  }

  get templates(): CustomFieldsTemplateModel[] {
    return this._templates;
  }

  createCustomFields(defaultTemplate: InvoiceComponentTemplateModel): string {
    const customFieldTemplateId = InvoiceTemplateModel.generateGridAreaId(InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS);
    const newCustomFieldsTemplate = new CustomFieldsTemplateModel(customFieldTemplateId, this._defaultCustomFields, defaultTemplate.titleColor, defaultTemplate.colorEven, defaultTemplate.colorOdd, defaultTemplate.fontColor, defaultTemplate.borderColor);
    this._templates.push(newCustomFieldsTemplate);
    return customFieldTemplateId;
  }

  updateTemplate(customFieldsId: string, fontColor: string, borderColor: string, colorOdd: string, titleColor: string, layout: CustomFieldGridAreaModel[]): void {
    const customFieldsTemplate = this.getTemplate(customFieldsId);
    customFieldsTemplate.fontColor = fontColor;
    customFieldsTemplate.borderColor = borderColor;
    customFieldsTemplate.colorOdd = colorOdd;
    customFieldsTemplate.titleColor = titleColor;
    customFieldsTemplate.customFields = layout;
    this.settingsChanged.emit([customFieldsId]);
  }

  get customFieldsEnabled(): boolean {
    return this._customFieldsEnabled;
  }

  set customFieldsEnabled(value: boolean) {
    this._customFieldsEnabled = value;
    if (!value) {
      this._templates = [];
    }
  }

}
