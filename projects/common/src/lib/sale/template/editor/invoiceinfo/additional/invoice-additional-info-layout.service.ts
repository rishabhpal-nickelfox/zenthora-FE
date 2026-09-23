import {EventEmitter, Injectable, Output} from '@angular/core';
import {CountryEnum} from "../../../../../enums/utils/county.enum";
import {CurrencyModel} from "../../../../../models/sale/currency.model";
import {
  InvoiceAdditionalInfoTemplateModel,
  InvoiceTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {InvoiceEmailTemplateLayoutCommonService} from "../../invoice-email-template-layout-common.service";
import {
  SaleAdditionalInfoTemplateData
} from "../../../../../models/sale/template/sale-email-template-data.model";
import {ObjectHelper} from "../../../../../helpers/object.helper";
import {GridColumnsHelper} from "../../../../../helpers/grid-columns.helper";
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../../../enums/sale/invoice-email-payment-template-components.enum";
import {
  SaleAdditionalAdvancedColumns,
  SaleAdditionalInfoColumnsEnum
} from "../../../../../enums/sale/sale-additional-info-columns.enum";

@Injectable()
export class InvoiceAdditionalInfoLayoutService extends InvoiceEmailTemplateLayoutCommonService {

  readonly data: SaleAdditionalInfoTemplateData = {
    terms: 'Net 30',
    dueDate: '2025-12-22',
    shipDate: '2025-12-25',
    shipMethod: 'FedEx',
    fob: 'Port of LA',
    trackingNumber: '1Z1234',
    salesRep: '5s',
    poNumber: '123456',
    customerNumber: null,
    other: 'Something'
  };

  protected _templates: InvoiceAdditionalInfoTemplateModel[] = [];
  private _defaultTemplate: InvoiceTemplateModel;
  private _defaultAdditionalInfoTemplate: InvoiceAdditionalInfoTemplateModel;
  @Output() settingsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  private _currency: CurrencyModel;
  private _qboCountry: CountryEnum;
  private _advancedFieldsEnabled: boolean;

  constructor() {
    super();
  }


  get templates(): InvoiceAdditionalInfoTemplateModel[] {
    return this._templates;
  }

  initTemplates(templates: InvoiceAdditionalInfoTemplateModel[], defaultTemplate: InvoiceTemplateModel, defaultAdditionalInfoTemplate: InvoiceAdditionalInfoTemplateModel): void {
    this._defaultTemplate = defaultTemplate;
    this._defaultAdditionalInfoTemplate = defaultAdditionalInfoTemplate;
    this._templates = (templates ?? []).map(t => {
      t.titleColor = ObjectHelper.isDefined(t.titleColor) ? t.titleColor : this._defaultTemplate?.titleColor;
      t.borderColor = ObjectHelper.isDefined(t.borderColor) ? t.borderColor : this._defaultTemplate?.borderColor;
      t.colorEven = ObjectHelper.isDefined(t.colorEven) ? t.colorEven : this._defaultTemplate?.colorEven;
      t.colorOdd = ObjectHelper.isDefined(t.colorOdd) ? t.colorOdd : this._defaultTemplate?.colorOdd;
      t.fontColor = ObjectHelper.isDefined(t.fontColor) ? t.fontColor : this._defaultTemplate?.fontColor;
      return t;
    });
    if (ObjectHelper.isDefined(this.advancedFieldsEnabled) && !this.advancedFieldsEnabled) {
      this.removeAdvancedColumns();
    }
    this.settingsChanged.emit([undefined, ...this._templates.map(t => t.id)]);
  }

  getTemplate(additionalInfoId: string): InvoiceAdditionalInfoTemplateModel {
    if (!additionalInfoId) return this._buildDefault();
    return this._templates.find(t => t.id === additionalInfoId) ?? this._buildDefault(additionalInfoId);
  }

  updateTemplate(additionalInfoId: string, template: InvoiceAdditionalInfoTemplateModel): void {
    if (!additionalInfoId) return;
    const next: InvoiceAdditionalInfoTemplateModel = {...template, id: additionalInfoId};

    const idx = this._templates.findIndex(t => t.id === additionalInfoId);
    if (idx === -1) {
      this._templates.push(next);
    } else {
      this._templates[idx] = next;
    }
    this.settingsChanged.emit([additionalInfoId]);
  }


  createAdditionalInfoTemplate(): string {
    const t = this._buildDefault();
    this._templates.push(t);
    this.settingsChanged.emit([t.id]);
    return t.id;
  }


  addItem(layout, componentRef): boolean {
    layout.push({cols: 1, id: componentRef, rows: 1, x: 0, y: 0});
    return false;
  }

  show(layout, colId) {
    return GridColumnsHelper.hasColumn(layout, colId);
  }

  getOrder(layout, colId): number {
    return GridColumnsHelper.getColumnOrder(layout, colId);
  }

  get qboCountry(): CountryEnum {
    return this._qboCountry;
  }

  set qboCountry(value: CountryEnum) {
    this._qboCountry = value;
  }

  get currency(): CurrencyModel {
    return this._currency;
  }

  set currency(value: CurrencyModel) {
    this._currency = value;
  }

  get isUS() {
    return this.qboCountry === CountryEnum.US;
  }

  private _buildDefault(id?: string): InvoiceAdditionalInfoTemplateModel {
    const t = new InvoiceAdditionalInfoTemplateModel();
    t.id = id ?? `${InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL}${Date.now()}`;
    t.titleColor = this._defaultTemplate?.titleColor;
    t.borderColor = this._defaultTemplate?.borderColor;
    t.colorEven = this._defaultTemplate?.colorEven;
    t.colorOdd = this._defaultTemplate?.colorOdd;
    t.fontColor = this._defaultTemplate?.fontColor;
    t.dueDateHeader = this._defaultAdditionalInfoTemplate?.dueDateHeader;
    t.termsHeader = this._defaultAdditionalInfoTemplate?.termsHeader;
    t.salesRepHeader = this._defaultAdditionalInfoTemplate?.salesRepHeader;
    t.shipDateHeader = this._defaultAdditionalInfoTemplate?.shipDateHeader;
    t.shipMethodHeader = this._defaultAdditionalInfoTemplate?.shipMethodHeader;
    t.fobHeader = this._defaultAdditionalInfoTemplate?.fobHeader;
    t.trackingNumberHeader = this._defaultAdditionalInfoTemplate?.trackingNumberHeader;
    t.poNumberHeader = this._defaultAdditionalInfoTemplate?.poNumberHeader;
    t.otherHeader = this._defaultAdditionalInfoTemplate?.otherHeader;
    t.additionalInfo = this._defaultAdditionalInfoTemplate?.additionalInfo;
    return t;
  }

  set advancedFieldsEnabled(value: boolean) {
    this._advancedFieldsEnabled = value;
    if (!value) {
      this.removeAdvancedColumns();
    }
  }

  get advancedFieldsEnabled(): boolean {
    return this._advancedFieldsEnabled;
  }

  private removeAdvancedColumns() {
    this._templates = this._templates.map(t => ({
      ...t,
      additionalInfo: t.additionalInfo.filter(
        i => SaleAdditionalAdvancedColumns.indexOf((SaleAdditionalInfoColumnsEnum[i.id])) < 0
      ),
    }));
    this.settingsChanged.emit(this.templatesIds);
  }
}
