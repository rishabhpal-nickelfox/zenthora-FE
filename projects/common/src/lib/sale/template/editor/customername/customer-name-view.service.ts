import {Injectable} from "@angular/core";
import {InvoiceEmailTemplateViewCommonService} from "../invoice-email-template-view-common.service";
import {
  CustomerNameTemplateModel,
  InvoiceComponentTemplateModel, InvoiceTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../../helpers/object.helper";
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";

@Injectable()
export class CustomerNameViewService extends InvoiceEmailTemplateViewCommonService {

  static readonly CUSTOMER_NAME_VALUE: string = 'Testy Test';
  static readonly CUSTOMER_NAME_DEFAULT_HEADER: string = 'Customer Name';
  private _defaultTemplate: InvoiceComponentTemplateModel;
  protected _templates: CustomerNameTemplateModel[];
  private _advancedFieldsEnabled: boolean;

  initTemplates(templates: CustomerNameTemplateModel[], defaultTemplate: InvoiceComponentTemplateModel) {
    this._templates = templates;
    this._defaultTemplate = defaultTemplate;
    this.settingsChanged.emit([undefined, ...this._templates.map(customFieldTemplate => customFieldTemplate.id)]);
  }

  createTemplate(defaultTemplate: InvoiceComponentTemplateModel): string {
    const customerNameTemplateId = InvoiceTemplateModel.generateGridAreaId(InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME);
    const newCustomerNameTemplate = new CustomerNameTemplateModel();
    newCustomerNameTemplate.customerNameHeader = CustomerNameViewService.CUSTOMER_NAME_DEFAULT_HEADER;
    newCustomerNameTemplate.id = customerNameTemplateId;
    newCustomerNameTemplate.titleColor = defaultTemplate.titleColor;
    newCustomerNameTemplate.borderColor = defaultTemplate.borderColor;
    newCustomerNameTemplate.fontColor = defaultTemplate.fontColor;
    newCustomerNameTemplate.colorOdd = defaultTemplate.colorOdd;
    this._templates.push(newCustomerNameTemplate);
    return customerNameTemplateId;
  }


  updateTemplate(customFieldsId: string, fontColor: string, borderColor: string, colorOdd: string, titleColor: string, customerNameHeader: string): void {
    const customerNameTemplate = this.getTemplate(customFieldsId);
    customerNameTemplate.fontColor = fontColor;
    customerNameTemplate.borderColor = borderColor;
    customerNameTemplate.colorOdd = colorOdd;
    customerNameTemplate.titleColor = titleColor;
    customerNameTemplate.customerNameHeader = customerNameHeader;
    this.settingsChanged.emit([customFieldsId]);
  }

  getTemplate(customerNameTemplateId: string): CustomerNameTemplateModel {
    return this._templates && ObjectHelper.isDefined(customerNameTemplateId) ? this._templates.find(customerNameTemplate => customerNameTemplate.id == customerNameTemplateId) : null;
  }


  get templates(): CustomerNameTemplateModel[] {
    return this._templates;
  }

  get advancedFieldsEnabled(): boolean {
    return this._advancedFieldsEnabled;
  }

  set advancedFieldsEnabled(value: boolean) {
    this._advancedFieldsEnabled = value;
    if (!value) {
      this._templates = [];
    }
  }


}
