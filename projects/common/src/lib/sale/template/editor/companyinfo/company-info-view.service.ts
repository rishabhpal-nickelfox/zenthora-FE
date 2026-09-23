import {EventEmitter, Injectable, Output} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from '../invoice-email-template-view-common.service';
import {AddressModel} from '../../../../models/common/address.model';
import {CompanyInfoRowsEnum} from '../../../../enums/sale/company-info-rows.enum';
import {
  CompanyInfoTemplateModel,
  InvoiceComponentTemplateModel, InvoiceTemplateModel
} from '../../../../models/sale/template/invoice-template.model';
import {ObjectHelper} from '../../../../helpers/object.helper';
import {Mask} from '../../../../helpers/mask';
import {CountryISOEnum} from '../../../../enums/utils/country-iso.enum';
import {CompanyContactInfoModel as ContactInfoModel} from '../../../../models/sale/template/company-contact-info.model';
import {SaleTemplateRenderHelper} from '../../interpret/full/sale-template-render.helper';
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";

type CompanyInfoData = { address: AddressModel; displayName: string; contactInfo: ContactInfoModel };

@Injectable()
export class CompanyInfoViewService extends InvoiceEmailTemplateViewCommonService {
  protected _templates: CompanyInfoTemplateModel[] = [];
  private _defaultTemplate: InvoiceComponentTemplateModel;

  @Output() settingsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  private _companyInfo: CompanyInfoData;
  companyInfoChanged: EventEmitter<void> = new EventEmitter<void>();

  private _displayedHeaderById = new Map<string, string>();

  get formattedPhone(): string {
    return this._companyInfo ? this._companyInfo.contactInfo?.formattedPhone : null;
  }

  get email(): string {
    return this._companyInfo ? this._companyInfo.contactInfo?.email : null;
  }

  get displayName(): string {
    return this._companyInfo ? this._companyInfo.displayName : null;
  }

  get website(): string {
    return this._companyInfo ? this._companyInfo.contactInfo?.website : null;
  }

  private get address(): AddressModel {
    return this._companyInfo ? this._companyInfo.address : null;
  }

  get street(): string {
    return this.address ? this.address?.street : null;
  }

  get city(): string {
    return this.address ? this.address?.city : null;
  }

  get state(): string {
    return this.address ? this.address?.state : null;
  }

  get zip(): string {
    return this.address ? this.address?.zip : null;
  }

  get country(): CountryISOEnum {
    return this.address ? this.address?.country : null;
  }


  initTemplates(templates: CompanyInfoTemplateModel[], defaultTemplate: InvoiceComponentTemplateModel): void {
    this._defaultTemplate = defaultTemplate;

    this._templates = (templates ?? []).map((template) => {
      template.id = template.id ? template.id : `${InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO}${Date.now()}`;

      template.titleColor = ObjectHelper.isDefined(template.titleColor) ? template.titleColor : this._defaultTemplate?.titleColor;
      template.borderColor = ObjectHelper.isDefined(template.borderColor) ? template.borderColor : this._defaultTemplate?.borderColor;
      template.colorEven = ObjectHelper.isDefined(template.colorEven) ? template.colorEven : this._defaultTemplate?.colorEven;
      template.colorOdd = ObjectHelper.isDefined(template.colorOdd) ? template.colorOdd : this._defaultTemplate?.colorOdd;
      template.fontColor = ObjectHelper.isDefined(template.fontColor) ? template.fontColor : this._defaultTemplate?.fontColor;

      template.companyInfoHeader = ObjectHelper.isDefined(template.companyInfoHeader) ? template.companyInfoHeader : '{{COMPANY_DISPLAY_NAME}}';
      template.hideHeader = ObjectHelper.isDefined(template.hideHeader) ? template.hideHeader : false;

      template.companyInfoRows = (ObjectHelper.isDefined(template.companyInfoRows) && template.companyInfoRows.length)
        ? template.companyInfoRows
        : Object.values(CompanyInfoRowsEnum);

      return template;
    });

    this._displayedHeaderById.clear();
    this._templates.forEach(t =>
      this._displayedHeaderById.set(t.id, this._replacePlaceholdersInHeader(t.companyInfoHeader))
    );

    this.settingsChanged.emit([undefined, ...this._templates.map(t => t.id)]);
  }

  getTemplate(companyInfoId: string): CompanyInfoTemplateModel {
    return this._templates && ObjectHelper.isDefined(companyInfoId) ? this._templates.find(t => t.id === companyInfoId) : null;
  }

  getDisplayedHeader(companyInfoId: string): string {
    if (!ObjectHelper.isDefined(companyInfoId) || !this._templates) {
      return null;
    }
    let displayedHeader = this._displayedHeaderById.get(companyInfoId);
    if (ObjectHelper.isDefined(displayedHeader)) {
      return displayedHeader;
    }
    const template = this.getTemplate(companyInfoId);
    if (ObjectHelper.isDefined(template)) {
      displayedHeader = this._replacePlaceholdersInHeader(template.companyInfoHeader);
      this._displayedHeaderById.set(companyInfoId, displayedHeader);
    }
    return displayedHeader;
  }

  getHideHeader(companyInfoId: string): boolean {
    return !!this.getTemplate(companyInfoId)?.hideHeader;
  }

  updateTemplate(companyInfoId: string, template: CompanyInfoTemplateModel): void {
    if (!companyInfoId) return;

    const next: CompanyInfoTemplateModel = {...template, id: companyInfoId};

    const idx = this._templates.findIndex(t => t.id === companyInfoId);
    if (idx === -1) {
      this._templates.push(next);
    } else {
      this._templates[idx] = next;
    }

    this._displayedHeaderById.set(companyInfoId, this._replacePlaceholdersInHeader(next.companyInfoHeader));
    this.settingsChanged.emit([companyInfoId]);
  }

  createCompanyInfoTemplate(): string {
    const template = new CompanyInfoTemplateModel();
    template.id = InvoiceTemplateModel.generateGridAreaId(InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO);
    template.titleColor = this._defaultTemplate?.titleColor;
    template.borderColor = this._defaultTemplate?.borderColor;
    template.colorEven = this._defaultTemplate?.colorEven;
    template.colorOdd = this._defaultTemplate?.colorOdd;
    template.fontColor = this._defaultTemplate?.fontColor;
    template.companyInfoHeader = '{{COMPANY_DISPLAY_NAME}}';
    template.hideHeader = false;
    template.companyInfoRows = (Object.keys(CompanyInfoRowsEnum) as any);
    this._templates.push(template);
    this._displayedHeaderById.set(template.id, this._replacePlaceholdersInHeader(template.companyInfoHeader));
    this.settingsChanged.emit([template.id]);
    return template.id;
  }

  set companyInfo(value: CompanyInfoData) {
    this._companyInfo = value;
    this._templates.forEach(t =>
      this._displayedHeaderById.set(t.id, this._replacePlaceholdersInHeader(t.companyInfoHeader))
    );
    this.companyInfoChanged.emit();
  }

  private _replacePlaceholdersInHeader(header: string) {
    return CompanyInfoViewService.replacePlaceholdersInHeader(header, this.displayName);
  }

  static replacePlaceholdersInHeader(header: string, displayName: string): string {
    return SaleTemplateRenderHelper.replacePlaceholdersInHeader(header, displayName);
  }

  static isPresented(source: CompanyInfoRowsEnum[], column: string): boolean {
    return SaleTemplateRenderHelper.isPresented(source, column);
  }

  get templates() {
    return this._templates;
  }

}
