import {Injectable} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from '../../invoice-email-template-view-common.service';
import {
  InvoiceComponentTemplateModel,
  InvoiceShortInfoTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {replacePlaceholders} from "../../../../../helpers/string.helper";
import {
  DocTypeEnum,
  DocTypeEnumValue
} from "../../../../../enums/sale/doc-type.enum";

@Injectable()
export class InvoiceShortInfoViewService extends InvoiceEmailTemplateViewCommonService {

  private _saleType: DocTypeEnum = DocTypeEnum.INVOICE;
  private _saleHeaderDisplayed: string;

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
  private _dateHeader: string;

  get template(): InvoiceShortInfoTemplateModel {
    const template = Object.assign(new InvoiceShortInfoTemplateModel(), super.template);
    template.saleHeader = this.saleHeader;
    template.dateHeader = this.dateHeader;
    return template;
  }

  initTemplate(value: InvoiceShortInfoTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
    this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
    this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
    this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
    this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
    this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
    this.saleHeader = value.saleHeader;
    this.dateHeader = value.dateHeader;
    this.saleHeaderDisplayed = value.saleHeader;
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
    this._saleHeaderDisplayed = replacePlaceholders(value, new Map<string, string>([
      [InvoiceEmailTemplateViewCommonService.SALE_TYPE_PLACEHOLDER, DocTypeEnumValue.get(this.saleType)]
    ]));
  }
}
