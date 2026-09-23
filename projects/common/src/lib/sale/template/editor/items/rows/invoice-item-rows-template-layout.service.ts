import {Injectable} from '@angular/core';
import {ItemsGridLayoutCommonService} from '../items-grid-layout-common.service';
import {
  InvoiceComponentTemplateModel,
  InvoiceItemsRowsTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {
  InvoiceItemsTableAdvancedColumns, InvoiceItemsTableColumnsEnum
} from "../../../../../enums/sale/invoice-items-table-columns.enum";
import {InvoiceItemDetailTypeEnum} from "../../../../../enums/sale/invoice-item-detail-type.enum";
import {ObjectHelper} from "../../../../../helpers/object.helper";

@Injectable()
export class InvoiceItemRowsTemplateLayoutService extends ItemsGridLayoutCommonService {

  private _advancedFieldsEnabled: boolean;

  constructor() {
    super();
  }

  protected readonly fixedRightWidthsPx = [];

  get template(): InvoiceItemsRowsTemplateModel {
    const template = Object.assign(new InvoiceItemsRowsTemplateModel(), super.template);
    template.lineNumHeader = this.lineNumHeader;
    template.itemHeader = this.itemHeader;
    template.descriptionHeader = this.descriptionHeader;
    template.quantityHeader = this.quantityHeader;
    template.rateHeader = this.rateHeader;
    template.amountHeader = this.amountHeader;
    template.taxableHeader = this.taxableHeader;
    template.skuHeader = this.skuHeader;
    template.serviceDateHeader = this.serviceDateHeader;
    template.categoryClassHeader = this.classHeader;
    template.other1Header = this.other1Header;
    template.other2Header = this.other2Header;
    template.itemTable = this.layout;
    template.autoColumnWidths = this.autoColumnWidths;
    return template;
  }

  initTemplate(value: InvoiceItemsRowsTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
    this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
    this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
    this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
    this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
    this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
    this.lineNumHeader = value.lineNumHeader;
    this.itemHeader = value.itemHeader;
    this.descriptionHeader = value.descriptionHeader;
    this.quantityHeader = value.quantityHeader;
    this.rateHeader = value.rateHeader;
    this.amountHeader = value.amountHeader;
    this.taxableHeader = value.taxableHeader;
    this.skuHeader = value.skuHeader;
    this.serviceDateHeader = value.serviceDateHeader;
    this.classHeader = value.categoryClassHeader;
    this.other1Header = value.other1Header;
    this.other2Header = value.other2Header;
    this.layout = value.itemTable;
    this.autoColumnWidths = value.autoColumnWidths ?? true;
    if (ObjectHelper.isDefined(this.advancedFieldsEnabled) && !this.advancedFieldsEnabled) {
      this.removeAdvancedColumns();
    }
    this.settingsChanged.emit();
  }

  private _lineNumHeader: string;
  private _itemHeader: string;
  private _descriptionHeader: string;
  private _quantityHeader: string;
  private _rateHeader: string;
  private _amountHeader: string;
  private _taxableHeader: string;
  private _serviceDateHeader: string;
  private _classHeader: string;
  private _skuHeader: string;
  private _other1Header: string;
  private _other2Header: string;

  get taxableHeader(): string {
    return this._taxableHeader;
  }

  set taxableHeader(value: string) {
    this._taxableHeader = value;
  }

  get amountHeader(): string {
    return this._amountHeader;
  }

  set amountHeader(value: string) {
    this._amountHeader = value;
  }

  get rateHeader(): string {
    return this._rateHeader;
  }

  set rateHeader(value: string) {
    this._rateHeader = value;
  }

  get quantityHeader(): string {
    return this._quantityHeader;
  }

  set quantityHeader(value: string) {
    this._quantityHeader = value;
  }

  get descriptionHeader(): string {
    return this._descriptionHeader;
  }

  set descriptionHeader(value: string) {
    this._descriptionHeader = value;
  }

  get lineNumHeader(): string {
    return this._lineNumHeader;
  }

  set lineNumHeader(value: string) {
    this._lineNumHeader = value;
  }

  get itemHeader(): string {
    return this._itemHeader;
  }

  set itemHeader(value: string) {
    this._itemHeader = value;
  }

  get skuHeader(): string {
    return this._skuHeader;
  }

  set skuHeader(value: string) {
    this._skuHeader = value;
  }

  get serviceDateHeader(): string {
    return this._serviceDateHeader;
  }

  set serviceDateHeader(value: string) {
    this._serviceDateHeader = value;
  }

  get classHeader(): string {
    return this._classHeader;
  }

  set classHeader(value: string) {
    this._classHeader = value;
  }

  private _currency;
  private _qboCountry;
  private _showSku;
  private _showServiceDate;

  get showServiceDate() {
    return this._showServiceDate;
  }

  set showServiceDate(value) {
    this._showServiceDate = value;
  }

  get showSku() {
    return this._showSku;
  }

  set showSku(value) {
    this._showSku = value;
  }

  get qboCountry() {
    return this._qboCountry;
  }

  set qboCountry(value) {
    this._qboCountry = value;
  }

  get currency() {
    return this._currency;
  }

  set currency(value) {
    this._currency = value;
  }

  isItemOrGroup(invoiceItem) {
    return !invoiceItem.detailType
      || invoiceItem.detailType === InvoiceItemDetailTypeEnum.SALES_ITEM_LINE_DETAIL
      || invoiceItem.detailType === InvoiceItemDetailTypeEnum.GROUP_LINE_DETAIL;
  }

  getMinimumCols() {
    return Math.min(2 * this.layout.length + 1, 12);
  }

  get other2Header(): string {
    return this._other2Header;
  }

  set other2Header(value: string) {
    this._other2Header = value;
  }

  get other1Header(): string {
    return this._other1Header;
  }

  set other1Header(value: string) {
    this._other1Header = value;
  }

  get advancedFieldsEnabled(): boolean {
    return this._advancedFieldsEnabled;
  }

  set advancedFieldsEnabled(value: boolean) {
    this._advancedFieldsEnabled = value;
    if (!value) {
      this.removeAdvancedColumns();
    }
  }

  private removeAdvancedColumns() {
    this.layout = this.layout.filter(
      i => InvoiceItemsTableAdvancedColumns.indexOf((InvoiceItemsTableColumnsEnum[i.id])) < 0);
    this.settingsChanged.emit();
  }
}
