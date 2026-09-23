import {EventEmitter, Injectable, Output} from '@angular/core';
import {ItemsGridLayoutCommonService} from '../items-grid-layout-common.service';
import {SafeStyle} from '@angular/platform-browser';
import {
  InvoiceItemsTableTotalsEnum
} from "../../../../../enums/sale/invoice-items-table-totals.enum";
import {InvoiceItemDetailTypeEnum} from "../../../../../enums/sale/invoice-item-detail-type.enum";
import {
  GridAreaModel,
  InvoiceComponentTemplateModel,
  InvoiceItemTableTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../../../helpers/object.helper";
import {
  InvoiceItemsTableAdvancedColumns, InvoiceItemsTableColumnsEnum
} from "../../../../../enums/sale/invoice-items-table-columns.enum";
import {GridColumnsHelper} from "../../../../../helpers/grid-columns.helper";
import {TemplateRenderSizes} from "../../../template-render-sizes";

@Injectable()
export class InvoiceItemsTableTemplateLayoutService extends ItemsGridLayoutCommonService {

  readonly LAST_COLUMN_WIDTH_PX = TemplateRenderSizes.ITEMS_LAST_COLUMN_WIDTH_PX;
  readonly BEFORE_LAST_COLUMN_WIDTH_PX = TemplateRenderSizes.ITEMS_BEFORE_LAST_COLUMN_WIDTH_PX;

  @Output() totalsChanged: EventEmitter<void> = new EventEmitter<void>();

  private _totals: InvoiceItemsTableTotalsEnum[] = [];
  private _customerMemo: string;
  private _hideCustomerMemo: boolean;
  private _customerMemoColor: string;
  private _advancedFieldsEnabled: boolean;
  private _autoTotalsWidth: boolean = true;
  private _totalsLabelColumnSpan: number;
  private _totalsAmountColumnSpan: number;

  constructor() {
    super();
  }

  get LAST_COLUMN_WIDTH(): string {
    return `${this.LAST_COLUMN_WIDTH_PX}px`;
  }

  get BEFORE_LAST_COLUMN_WIDTH(): string {
    return `${this.BEFORE_LAST_COLUMN_WIDTH_PX}px`;
  }

  protected readonly fixedRightWidthsPx = [this.BEFORE_LAST_COLUMN_WIDTH_PX, this.LAST_COLUMN_WIDTH_PX];

  get template(): InvoiceItemTableTemplateModel {
    const template = Object.assign(new InvoiceItemTableTemplateModel(), super.template);
    template.lineNumHeader = this.lineNumHeader;
    template.itemHeader = this.itemHeader;
    template.descriptionHeader = this.descriptionHeader;
    template.quantityHeader = this.quantityHeader;
    template.rateHeader = this.rateHeader;
    template.amountHeader = this.amountHeader;
    template.taxableHeader = this.taxableHeader;
    template.skuHeader = this.skuHeader;
    template.serviceDateHeader = this.serviceDateHeader;
    template.categoryClassHeader = this.categoryClassHeader;
    template.other1Header = this.other1Header;
    template.other2Header = this.other2Header;
    template.itemTable = this.layout;
    template.totals = this.totals;
    template.hideCustomerMemo = this.hideCustomerMemo;
    template.customerMemoColor = this.customerMemoColor;
    template.autoColumnWidths = this.autoColumnWidths;
    template.autoTotalsWidth = this.autoTotalsWidth;
    template.totalsLabelColumnSpan = this.totalsLabelColumnSpan;
    template.totalsAmountColumnSpan = this.totalsAmountColumnSpan;
    return template;
  }

  initTemplate(value: InvoiceItemTableTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
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
    this.categoryClassHeader = value.categoryClassHeader;
    this.other1Header = value.other1Header;
    this.other2Header = value.other2Header;
    this.layout = value.itemTable;
    this.totals = value.totals;
    this.hideCustomerMemo = value.hideCustomerMemo;
    this.customerMemoColor = value.customerMemoColor;
    this.autoColumnWidths = value.autoColumnWidths ?? true;
    this.autoTotalsWidth = value.autoTotalsWidth ?? true;
    this.totalsLabelColumnSpan = value.totalsLabelColumnSpan ?? null;
    this.totalsAmountColumnSpan = value.totalsAmountColumnSpan ?? null;
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
  private _categoryClassHeader: string;
  private _skuHeader: string;
  private _other1Header: string;
  private _other2Header: string;

  get lineNumHeader(): string {
    return this._lineNumHeader;
  }

  set lineNumHeader(value: string) {
    this._lineNumHeader = value;
  }

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

  set serviceDateHeader(value: string) {
    this._serviceDateHeader = value;
  }

  get serviceDateHeader(): string {
    return this._serviceDateHeader;
  }

  get totals(): InvoiceItemsTableTotalsEnum[] {
    return this._totals;
  }

  set totals(value: InvoiceItemsTableTotalsEnum[]) {
    this._totals = value;
    this.totalsChanged.emit();
  }

  get categoryClassHeader(): string {
    return this._categoryClassHeader;
  }

  set categoryClassHeader(value: string) {
    this._categoryClassHeader = value;
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

  get customerMemo() {
    return this._customerMemo;
  }

  set customerMemo(value: string) {
    this._customerMemo = value;
  }

  getTotalsColumns(layout: GridAreaModel[] = this.layout,
                   autoColumnWidths: boolean = this.autoColumnWidths): SafeStyle {
    if (autoColumnWidths || layout.length < 3) {
      return GridColumnsHelper.getAutoTotalsColumns(this.BEFORE_LAST_COLUMN_WIDTH, this.LAST_COLUMN_WIDTH);
    }
    return GridColumnsHelper.getWeightedTotalsColumns(
      layout, this.MIN_COLUMN_WIDTH, this.splitLabelSpan, this.splitAmountSpan);
  }

  getMemoTotalsColumns(layout: GridAreaModel[] = this.layout,
                       autoColumnWidths: boolean = this.autoColumnWidths): SafeStyle {
    if (autoColumnWidths || layout.length < 3) {
      return GridColumnsHelper.getAutoMemoTotalsColumns(this.BEFORE_LAST_COLUMN_WIDTH, this.LAST_COLUMN_WIDTH);
    }
    return GridColumnsHelper.getWeightedMemoTotalsColumns(
      layout, this.MIN_COLUMN_WIDTH, this.splitLabelSpan, this.splitAmountSpan);
  }

  private get splitLabelSpan(): number | null {
    return this.autoTotalsWidth ? null : this.totalsLabelColumnSpan;
  }

  private get splitAmountSpan(): number | null {
    return this.autoTotalsWidth ? null : this.totalsAmountColumnSpan;
  }

  get autoTotalsWidth(): boolean {
    return this._autoTotalsWidth ?? true;
  }

  set autoTotalsWidth(value: boolean) {
    this._autoTotalsWidth = value;
  }

  get totalsLabelColumnSpan(): number | null {
    return this._totalsLabelColumnSpan;
  }

  set totalsLabelColumnSpan(value: number | null) {
    this._totalsLabelColumnSpan = value;
  }

  get totalsAmountColumnSpan(): number | null {
    return this._totalsAmountColumnSpan;
  }

  set totalsAmountColumnSpan(value: number | null) {
    this._totalsAmountColumnSpan = value;
  }

  isItemOrGroup(invoiceItem) {
    return !invoiceItem.detailType
      || invoiceItem.detailType === InvoiceItemDetailTypeEnum.SALES_ITEM_LINE_DETAIL
      || invoiceItem.detailType === InvoiceItemDetailTypeEnum.GROUP_LINE_DETAIL;
  }

  isSubtotalLine(invoiceItem) {
    return invoiceItem.detailType === InvoiceItemDetailTypeEnum.SUBTOTAL_LINE;
  }

  isTotalRowPresented(row: string): boolean {
    return ObjectHelper.isDefined(this.totals.find(c => c == row));
  }

  get hideCustomerMemo(): boolean {
    return this._hideCustomerMemo;
  }

  set hideCustomerMemo(value: boolean) {
    this._hideCustomerMemo = value;
  }

  getMinimumCols() {
    return Math.min(2 * this.layout.length + 1, 12);
  }


  get customerMemoColor(): string {
    return this._customerMemoColor;
  }

  set customerMemoColor(value: string) {
    this._customerMemoColor = value;
    this.customerMemoColorChanged.emit();
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
