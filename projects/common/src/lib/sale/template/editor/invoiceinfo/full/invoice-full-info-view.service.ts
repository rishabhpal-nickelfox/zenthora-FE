import {Injectable} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from '../../invoice-email-template-view-common.service';
import {
  InvoiceComponentTemplateModel,
  InvoiceFullInfoTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {replacePlaceholders} from "../../../../../helpers/string.helper";
import {
  DocTypeEnum,
  DocTypeEnumValue
} from "../../../../../enums/sale/doc-type.enum";

@Injectable()
export class InvoiceFullInfoViewService extends InvoiceEmailTemplateViewCommonService {

  private _saleType: DocTypeEnum = DocTypeEnum.INVOICE;

  get termsHeader(): string {
    return this._termsHeader;
  }

  set termsHeader(value: string) {
    this._termsHeader = value;
  }

  get dueDateHeader(): string {
    return this._dueDateHeader;
  }

  set dueDateHeader(value: string) {
    this._dueDateHeader = value;
  }

  get dateHeader(): string {
    return this._dateHeader;
  }

  set dateHeader(value: string) {
    this._dateHeader = value;
  }

  get saleHeader(): string {
    return this._saleHeader;
  }

  set saleHeader(value: string) {
    this._saleHeaderDisplayed = value;
    this._saleHeader = replacePlaceholders(this._saleHeaderDisplayed, new Map<string, string>([
      [DocTypeEnumValue.get(this.saleType), InvoiceEmailTemplateViewCommonService.SALE_TYPE_PLACEHOLDER]
    ]));
  }

  private _saleHeader: string;
  private _saleHeaderDisplayed: string;
  private _dateHeader: string;
  private _dueDateHeader: string;
  private _termsHeader: string;

  get template(): InvoiceFullInfoTemplateModel {
    const template = Object.assign(new InvoiceFullInfoTemplateModel(), super.template);
    template.saleHeader = this.saleHeader;
    template.dateHeader = this.dateHeader;
    template.dueDateHeader = this.dueDateHeader;
    template.termsHeader = this.termsHeader;
    return template;
  }

  initTemplate(value: InvoiceFullInfoTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
    this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
    this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
    this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
    this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
    this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
    this.saleHeader = value.saleHeader;
    this.dateHeader = value.dateHeader;
    this.dueDateHeader = value.dueDateHeader;
    this.termsHeader = value.termsHeader;
    this.saleHeaderDisplayed = this._saleHeader;
    this.settingsChanged.emit();
  }

  set saleType(saleType: DocTypeEnum) {
    this._saleType = saleType;
    this.saleHeaderDisplayed = this._saleHeader;
  }

  get saleType(): DocTypeEnum {
    return this._saleType;
  }

  get saleHeaderDisplayed(): string {
    return this._saleHeaderDisplayed;
  }

  set saleHeaderDisplayed(value: string) {
    this._saleHeaderDisplayed = replacePlaceholders(this._saleHeader, new Map<string, string>([
      [InvoiceEmailTemplateViewCommonService.SALE_TYPE_PLACEHOLDER, this.saleType]
    ]));
  }
}
