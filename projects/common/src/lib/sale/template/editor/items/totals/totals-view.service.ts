import {EventEmitter, Injectable, Output} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from '../../invoice-email-template-view-common.service';
import {
  InvoiceItemsTableTotalsEnum
} from "../../../../../enums/sale/invoice-items-table-totals.enum";
import {
  InvoiceComponentTemplateModel,
  TotalsTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {
  SaleEmailTemplateData
} from "../../../../../models/sale/template/sale-email-template-data.model";
import {
  SaleTemplateRenderHelper
} from "../../../interpret/full/sale-template-render.helper";

@Injectable()
export class TotalsViewService extends InvoiceEmailTemplateViewCommonService {

  @Output() totalsChanged: EventEmitter<void> = new EventEmitter<void>();

  private _totals: InvoiceItemsTableTotalsEnum[] = [];
  private _subtotalHeader: string;
  private _taxHeader: string;
  private _discountHeader: string;
  private _shippingCostHeader: string;
  private _appliedAmountHeader: string;
  private _amountDueHeader: string;
  private _totalHeader: string;
  private _tipHeader: string;


  constructor() {
    super();
  }

  get template(): TotalsTemplateModel {
    const template = Object.assign(new TotalsTemplateModel(), super.template);
    template.totals = this.totals;
    template.subtotalHeader = this.subtotalHeader;
    template.taxHeader = this.taxHeader;
    template.discountHeader = this.discountHeader;
    template.shippingCostHeader = this.shippingCostHeader;
    template.appliedAmountHeader = this.appliedAmountHeader;
    template.amountDueHeader = this.amountDueHeader;
    template.totalHeader = this.totalHeader;
    template.tipHeader = this.tipHeader;
    return template;
  }

  initTemplate(value: TotalsTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
    this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
    this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
    this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
    this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
    this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
    this._totals = value.totals;
    this._subtotalHeader = value.subtotalHeader;
    this._taxHeader = value.taxHeader;
    this._discountHeader = value.discountHeader;
    this._shippingCostHeader = value.shippingCostHeader;
    this._appliedAmountHeader = value.appliedAmountHeader;
    this._amountDueHeader = value.amountDueHeader;
    this._totalHeader = value.totalHeader;
    this._tipHeader = value.tipHeader;
    this.settingsChanged.emit();
  }


  private _currency;
  private _qboCountry;

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

  get amountDueHeader(): string {
    return this._amountDueHeader;
  }

  get appliedAmountHeader(): string {
    return this._appliedAmountHeader;
  }

  get shippingCostHeader(): string {
    return this._shippingCostHeader;
  }

  get discountHeader(): string {
    return this._discountHeader;
  }

  get taxHeader(): string {
    return this._taxHeader;
  }

  get subtotalHeader(): string {
    return this._subtotalHeader;
  }

  get totals(): InvoiceItemsTableTotalsEnum[] {
    return this._totals;
  }

  set amountDueHeader(value: string) {
    this._amountDueHeader = value;
  }

  set appliedAmountHeader(value: string) {
    this._appliedAmountHeader = value;
  }

  set shippingCostHeader(value: string) {
    this._shippingCostHeader = value;
  }

  set discountHeader(value: string) {
    this._discountHeader = value;
  }

  set taxHeader(value: string) {
    this._taxHeader = value;
  }

  set subtotalHeader(value: string) {
    this._subtotalHeader = value;
  }

  get totalHeader(): string {
    return this._totalHeader;
  }

  set totalHeader(value: string) {
    this._totalHeader = value;
  }

  set totals(value: InvoiceItemsTableTotalsEnum[]) {
    this._totals = value;
    this.totalsChanged.emit();
  }

  get tipHeader(): string {
    return this._tipHeader;
  }

  set tipHeader(value: string) {
    this._tipHeader = value;
  }


  static getHeader(total: InvoiceItemsTableTotalsEnum, totals: TotalsTemplateModel, model: SaleEmailTemplateData): string {
    return SaleTemplateRenderHelper.getHeader(total, totals, model);
  }

  static getValue(total: InvoiceItemsTableTotalsEnum, model: SaleEmailTemplateData): number {
    return SaleTemplateRenderHelper.getValue(total, model);
  }
}
