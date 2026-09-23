import {ElementRef, Injectable} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeStyle} from '@angular/platform-browser';
import {
  InvoiceItemsTableAdvancedColumns,
  InvoiceItemsTableColumnsEnum
} from "../../../../enums/sale/invoice-items-table-columns.enum";
import {InvoiceItemDetailTypeEnum} from "../../../../enums/sale/invoice-item-detail-type.enum";
import {
  InvoiceItemsTableTotalsEnum,
  InvoiceItemsTableTotalsLegacyOrdered,
  InvoiceItemsTableTotalsOrdered
} from "../../../../enums/sale/invoice-items-table-totals.enum";
import {
  AddressTemplateModel,
  CompanyInfoTemplateModel,
  CustomerMemoTemplateModel, CustomerNameTemplateModel, CustomFieldGridAreaModel,
  CustomFieldsTemplateModel,
  GridAreaModel,
  InvoiceAdditionalInfoTemplateModel,
  InvoiceFullInfoTemplateModel,
  InvoiceItemsRowsTemplateModel,
  InvoiceItemTableTemplateModel,
  InvoiceShortInfoTemplateModel,
  InvoiceTemplateModel,
  LineTemplateModel,
  ShippingInfoTemplateModel,
  TextTemplateModel,
  TotalsTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../../helpers/object.helper";
import {
  InvoiceEmailPaymentTemplateLogoSizeEnum,
  getInvoiceEmailPaymentTemplateLogoWidth
} from "../../../../enums/sale/invoice-email-payment-template-logo-size.enum";
import {SaleEmailTemplateData} from "../../../../models/sale/template/sale-email-template-data.model";
import {
  InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsWithDynamicHeight
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";
import {getMessage, isEmptyString, replacePlaceholders} from "../../../../helpers/string.helper";
import {SALE_TYPE_PLACEHOLDER, SaleTemplateRenderHelper} from "./sale-template-render.helper";
import {DocTypeEnumValue} from "../../../../enums/sale/doc-type.enum";
import cloneDeep from 'lodash/cloneDeep';
import {
  SaleAdditionalAdvancedColumns,
  SaleAdditionalInfoColumnsEnum
} from "../../../../enums/sale/sale-additional-info-columns.enum";
import {
  ExtendedCompanySettingsTextTemplatePlaceholderEnum
} from "../../../../enums/sale/company-settings-text-template-placeholder.enum";
import {DecimalPipe} from "@angular/common";
import {HtmlSanitizerService} from "../../../../utils/html-sanitizer.service";
import {GridColumnsHelper} from "../../../../helpers/grid-columns.helper";
import {TemplateRenderSizes} from "../../template-render-sizes";

@Injectable()
export class InvoiceTemplateInterpretViewService {

  readonly InvoiceItemsTableColumnsEnum = InvoiceItemsTableColumnsEnum;
  protected readonly InvoiceItemsTableTotalsEnum = InvoiceItemsTableTotalsEnum;
  readonly SaleAdditionalInfoColumnsEnum = SaleAdditionalInfoColumnsEnum;

  readonly LAST_COLUMN_WIDTH = `${TemplateRenderSizes.ITEMS_LAST_COLUMN_WIDTH_PX}px`;
  readonly BEFORE_LAST_COLUMN_WIDTH = `${TemplateRenderSizes.ITEMS_BEFORE_LAST_COLUMN_WIDTH_PX}px`;
  readonly MIN_COLUMN_WIDTH = `${TemplateRenderSizes.ITEMS_MIN_COLUMN_WIDTH_PX}px`;

  private _totals: InvoiceItemsTableTotalsEnum[];
  private _emailTemplate: GridAreaModel[];
  private _saleFullInfoTemplate: InvoiceFullInfoTemplateModel;
  private _itemTableTemplate: InvoiceItemTableTemplateModel;
  private _itemsRowsTemplate: InvoiceItemsRowsTemplateModel;
  private _saleShortInfoTemplate: InvoiceShortInfoTemplateModel;
  private _saleAdditionalInfoTemplates: InvoiceAdditionalInfoTemplateModel[];
  private _shippingInfoTemplate: ShippingInfoTemplateModel;
  private _billToTemplate: AddressTemplateModel;
  private _shipToTemplate: AddressTemplateModel;
  private _companyInfoTemplates: CompanyInfoTemplateModel[];
  private _customFieldsTemplates: CustomFieldsTemplateModel[];
  private _customerMemoTemplate: CustomerMemoTemplateModel;
  private _customerNameTemplates: CustomerNameTemplateModel[];
  private _lineTemplates: LineTemplateModel[];
  private _totalsTemplate: TotalsTemplateModel;
  private _textsTemplates: TextTemplateModel[];
  private _textPlaceholders;

  constructor(private sanitizer: DomSanitizer,
              private htmlSanitizer: HtmlSanitizerService,
              public decimalPipe: DecimalPipe) {
  }

  private _fontColor = '#000000';

  get fontColor(): string {
    return this._fontColor;
  }

  set fontColor(color) {
    this._fontColor = ObjectHelper.isDefined(color) ? color : this._fontColor;
  }

  private _fontSize: number;

  set fontSize(value: number) {
    this._fontSize = value;
  }

  get fontSize(): number {
    return ObjectHelper.isDefined(this._fontSize) ? this._fontSize : 14;
  }

  private _logoSize: InvoiceEmailPaymentTemplateLogoSizeEnum;

  set logoSize(value: InvoiceEmailPaymentTemplateLogoSizeEnum) {
    this._logoSize = value;
  }

  get logoSize(): InvoiceEmailPaymentTemplateLogoSizeEnum {
    return ObjectHelper.isDefined(this._logoSize) ? this._logoSize : InvoiceEmailPaymentTemplateLogoSizeEnum.S;
  }

  private _colorEven = '#ffffff';

  get colorEven(): string {
    return this._colorEven;
  }

  set colorEven(color) {
    this._colorEven = ObjectHelper.isDefined(color) ? color : this._colorEven;
  }

  private _colorOdd = '#f4f4f4';

  get colorOdd(): string {
    return this._colorOdd;
  }

  set colorOdd(color) {
    this._colorOdd = ObjectHelper.isDefined(color) ? color : this._colorOdd;
  }

  private _titleColor = '#ffffff';

  get titleColor(): string {
    return this._titleColor;
  }

  set titleColor(color) {
    this._titleColor = ObjectHelper.isDefined(color) ? color : this._titleColor;
  }

  private _borderColor = '#eaeaea';

  get border(): string {
    return this.getBorderFromColor(this._borderColor);
  }

  set borderColor(color: string) {
    this._borderColor = ObjectHelper.isDefined(color) ? color : this._borderColor;
  }

  getBorderFromColor(color: string) {
    return color == 'none' ? 'none' : `solid 2px ${color}`;
  }

  private _minimizeVerticalSize: boolean;

  get minimizeVerticalSize(): boolean {
    return this._minimizeVerticalSize ?? false;
  }

  set minimizeVerticalSize(value: boolean) {
    this._minimizeVerticalSize = value;
  }

  private _gridGap: number;


  get gridGap(): number {
    return this._gridGap ?? 10;
  }

  set gridGap(value: number) {
    this._gridGap = value;
  }

  private _lineHeight: number;

  get lineHeight(): number {
    return this._lineHeight;
  }

  set lineHeight(value: number) {
    this._lineHeight = value;
  }

  private _legacyLayout: boolean;

  get legacyLayout(): boolean {
    return this._legacyLayout ?? false;
  }

  set legacyLayout(value: boolean) {
    this._legacyLayout = value;
  }


  private _invoiceTemplateDataModel: SaleEmailTemplateData;

  set invoiceTemplateDataModel(value: SaleEmailTemplateData) {
    this._invoiceTemplateDataModel = value;
    let template = this.prepareTemplate(this._invoiceTemplateDataModel);
    if (template) {
      const customFieldsEnabled = value.customFieldsEnabled;
      const advancedFieldsEnabled = value.advancedFieldsEnabled;
      this._saleFullInfoTemplate = template.saleFullInfoTemplate;
      this._saleFullInfoTemplate.saleHeader = replacePlaceholders(this._saleFullInfoTemplate.saleHeader, new Map<string, string>([
        [SALE_TYPE_PLACEHOLDER, DocTypeEnumValue.get(this._invoiceTemplateDataModel.saleFullInfo.docType)]
      ]));
      this._itemTableTemplate = advancedFieldsEnabled
        ? template.itemTableTemplate
        : {
          ...template.itemTableTemplate,
          itemTable: template.itemTableTemplate.itemTable.filter(ad => InvoiceItemsTableAdvancedColumns.indexOf(ad.id) < 0)
        };

      this._itemsRowsTemplate = advancedFieldsEnabled
        ? template.itemsRowsTemplate
        : {
          ...template.itemsRowsTemplate,
          itemTable: template.itemsRowsTemplate.itemTable.filter(ad => InvoiceItemsTableAdvancedColumns.indexOf(ad.id) < 0)
        };

      this._saleShortInfoTemplate = template.saleShortInfoTemplate;
      this._saleShortInfoTemplate.saleHeader = replacePlaceholders(this._saleShortInfoTemplate.saleHeader, new Map<string, string>([
        [SALE_TYPE_PLACEHOLDER, DocTypeEnumValue.get(this._invoiceTemplateDataModel.saleShortInfo.docType)]
      ]));

      this._saleAdditionalInfoTemplates = advancedFieldsEnabled
        ? template.saleAdditionalInfoTemplates
        : template.saleAdditionalInfoTemplates.map(t => ({
          ...t,
          additionalInfo: (t.additionalInfo ?? []).filter(ad => SaleAdditionalAdvancedColumns.indexOf(ad.id) < 0),
        }));

      const emptySaleAdditionalInfoTemplateIds =
        (this._saleAdditionalInfoTemplates ?? [])
          .filter(t => t.additionalInfo.length == 0)
          .map(t => t.id);

      this._shippingInfoTemplate = template.shippingInfoTemplate;
      this._billToTemplate = template.billToTemplate;
      this._shipToTemplate = template.shipToTemplate;
      this._companyInfoTemplates = template.companyInfoTemplates;
      this._companyInfoTemplates.map(template => {
        template.companyInfoHeader = SaleTemplateRenderHelper.replacePlaceholdersInHeader(template.companyInfoHeader, this._invoiceTemplateDataModel.companyInfo.displayName)
      });
      this._customFieldsTemplates = template.customFieldsTemplates;

      const emptyCustomFieldsTemplateIds =
        (this._customFieldsTemplates ?? [])
          .filter(t => (t.customFields ?? []).length === 0)
          .map(t => t.id);

      this._lineTemplates = template.lineTemplates;
      this._customerMemoTemplate = template.customerMemoTemplate;
      this._customerNameTemplates = template.customerNameTemplates;
      this._totalsTemplate = template.totalsTemplate;
      this._textsTemplates = template.textTemplates;

      this.legacyLayout = template.legacyLayout;

      let emailTemplate = customFieldsEnabled
        ? template.components
        : template.components.filter(c => c.id !== InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS);
      emailTemplate = advancedFieldsEnabled ? emailTemplate : emailTemplate.filter(c => c.id !== InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME);
      emailTemplate = advancedFieldsEnabled ? emailTemplate : emailTemplate.filter(c => c.id !== InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO);
      this.emailTemplate = emailTemplate.filter(c =>
        !(c.id === InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL && emptySaleAdditionalInfoTemplateIds.indexOf(c.saleAdditionalInfoId) >= 0)
        && !(c.id === InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS && emptyCustomFieldsTemplateIds.indexOf(c.customFieldsId) >= 0)
      );

      this.fontColor = template.fontColor;
      this.fontSize = template.fontSize;
      this.titleColor = template.titleColor;
      this.borderColor = template.borderColor;
      this.colorEven = template.colorEven;
      this.colorOdd = template.colorOdd;
      this.logoSize = template.logoSize;
      this.gridGap = template.gridGap;
      this.minimizeVerticalSize = template.minimizeVerticalSize;
      this.lineHeight = template.lineHeight;
    }
    this._textPlaceholders = new Map<string, string>([
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.CUSTOMER_NAME, this.invoice.customerName],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.TOTAL, this.totalFormatted],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.TERMS, this.invoice.saleAdditionalInfo?.terms],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.DUE_DATE, this.invoice.saleAdditionalInfo?.dueDate],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.SHIPPING_COST, this.shippingCostFormatted],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.SHIP_DATE, this.invoice.shippingInfo?.shipDate],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.AMOUNT_DUE, this.amountDueFormatted],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.SHIP_METHOD, this.invoice.shippingInfo?.shipMethod],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.FOB, this.invoice.saleAdditionalInfo?.fob],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.PO_NUMBER, this.invoice.saleAdditionalInfo?.poNumber],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.CUSTOMER_NUMBER, this.invoice.saleAdditionalInfo?.customerNumber],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.DISPLAY_NAME, this.companyInfo?.displayName],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.COUNTRY, this.companyInfo?.country],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.ZIP, this.companyInfo?.zip],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.STATE, this.companyInfo?.state],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.CITY, this.companyInfo?.city],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.STREET, this.companyInfo?.street],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.EMAIL, this.companyInfo?.email],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.PHONE, this.formattedPhone],
      [ExtendedCompanySettingsTextTemplatePlaceholderEnum.WEB_URL, this.companyInfo?.website],
    ]);
  }

  get fullTemplate(): InvoiceTemplateModel {
    return this._invoiceTemplateDataModel.fullTemplate;
  }

  get companyInfo() {
    return this._invoiceTemplateDataModel.companyInfo;
  }

  get invoice() {
    return this._invoiceTemplateDataModel;
  }

  get invoiceItems() {
    return this.invoice.invoiceItems;
  }

  set emailTemplate(value: GridAreaModel[]) {
    let result = this.removeEmptyAndMove(value);
    if (!this.legacyLayout) {
      result = this.moveAfterDynamicHeightComponents(result);
    }
    this._emailTemplate = result;
  }

  private removeEmptyAndMove(value: GridAreaModel[]): GridAreaModel[] {
    const sorted = [...value].sort((a, b) => a.y - b.y);
    const result: GridAreaModel[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];

      let hasOtherOnSameRows = false;

      for (let row = current.y; row < current.y + current.rows; row++) {
        const rowHasOther = sorted.some(c =>
          c.id !== current.id &&
          !c.isEmpty &&
          c.y <= row &&
          row < c.y + c.rows
        );

        if (rowHasOther) {
          hasOtherOnSameRows = true;
        }
      }

      const isEmptyAndHasNoOtherComponents = current.isEmpty && !hasOtherOnSameRows;

      if (isEmptyAndHasNoOtherComponents) {
        for (let j = i + 1; j < sorted.length; j++) {
          if (sorted[j].y > current.y) {
            sorted[j].y -= current.rows;
          }
        }
      }

      if (!current.isEmpty) {
        result.push(current);
      }
    }
    return result;
  }

  private moveAfterDynamicHeightComponents(grid: GridAreaModel[]): GridAreaModel[] {
    const result = grid.map(c => ({ ...c }));
    const original = grid.map(c => ({ ...c }));

    // components with dynamic height sorted by y
    const dynamicComponents = original
      .filter(c => InvoiceEmailPaymentTemplateComponentsWithDynamicHeight.includes(c.id))
      .sort((a, b) => a.y - b.y);

    dynamicComponents.forEach(dynamicOriginal => {
      const oldRows = dynamicOriginal.rows;
      const newRows = 1; // auto-rows
      const gap = newRows - oldRows;

      if (gap === 0) return; // nothing changed

      const dynamicOriginalBottom = dynamicOriginal.y + oldRows;
      //first component that is under current dynamic
      const firstComponentToShift = original
        .filter(c => c.y >= dynamicOriginalBottom)
        .sort((a, b) => a.y - b.y)[0];

      //move all components that are initially under firstComponentToShift by the same gap.
      //when the dynamic component is last (nothing below it), there is nothing to shift,
      //but its reserved rows must still collapse to auto so the grid does not keep empty rows.
      if (firstComponentToShift) {
        result.forEach(resultComponent => {
          const originalComponent = original.find(o => o.id === resultComponent.id);
          if (originalComponent.y >= firstComponentToShift.y) {
            resultComponent.y += gap;
          }
        });
      }
      //update rows of dynamic component in result array
      const dynamicResultComponent = result.find(c => c.id === dynamicOriginal.id);
      dynamicResultComponent.rows = newRows;
    });

    return result;
  }

  get emailTemplate() {
    return this._emailTemplate;
  }

  get itemTableLayout(): GridAreaModel[] {
    return this._itemTableTemplate.itemTable;
  }

  get saleFullInfoTemplate(): InvoiceFullInfoTemplateModel {
    return this._saleFullInfoTemplate;
  }

  get logoPreview() {
    return this._invoiceTemplateDataModel.logo ? 'data:' + this._invoiceTemplateDataModel.logo.logoContentType + ';base64,' + this._invoiceTemplateDataModel.logo.logo : null;
  }

  get logoWidth(): string {
    return getInvoiceEmailPaymentTemplateLogoWidth(this._logoSize);
  }

  get formattedPhone(): string {
    return this.companyInfo.formattedPhone;
  }

  private _showInvoiceStatus: boolean;

  get showInvoiceStatus(): boolean {
    return this._showInvoiceStatus;
  }

  set showInvoiceStatus(value: boolean) {
    this._showInvoiceStatus = value;
  }

  get itemTableTemplate(): InvoiceItemTableTemplateModel {
    return this._itemTableTemplate;
  }

  get itemsRowsTemplate(): InvoiceItemsRowsTemplateModel {
    return this._itemsRowsTemplate;
  }

  get saleShortInfoTemplate(): InvoiceShortInfoTemplateModel {
    return this._saleShortInfoTemplate;
  }

  get billToTemplate(): AddressTemplateModel {
    return this._billToTemplate;
  }

  get shipToTemplate(): AddressTemplateModel {
    return this._shipToTemplate;
  }

  get lineTemplates(): LineTemplateModel[] {
    return this._lineTemplates;
  }

  get lines(): GridAreaModel[] {
    return this.emailTemplate.filter(component => component.id == InvoiceEmailPaymentTemplateComponentsEnum.LINE);
  }

  get customFields(): GridAreaModel[] {
    return this.emailTemplate.filter(component => component.id == InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS);
  }

  get texts(): GridAreaModel[] {
    return this.emailTemplate.filter(component => component.id == InvoiceEmailPaymentTemplateComponentsEnum.TEXT);
  }

  get companyInfoTemplates(): GridAreaModel[] {
    return this.emailTemplate.filter(component => component.id == InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO);
  }

  get customerNames(): GridAreaModel[] {
    return this.emailTemplate.filter(component => component.id == InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME);
  }

  get saleAdditionalInfoTemplates(): GridAreaModel[] {
    return this.emailTemplate.filter(component => component.id == InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL);
  }

  get customerMemoTemplate(): CustomerMemoTemplateModel {
    return this._customerMemoTemplate;
  }

  get totalsTemplate(): TotalsTemplateModel {
    return this._totalsTemplate;
  }

  get textsTemplates(): TextTemplateModel[] {
    return this._textsTemplates;
  }

  get shippingInfoTemplate(): ShippingInfoTemplateModel {
    return this._shippingInfoTemplate;
  }

  get customerNameTemplates(): CustomerNameTemplateModel[] {
    return this._customerNameTemplates;
  }

  isItemOrGroup(invoiceItem) {
    return !invoiceItem.detailType
      || invoiceItem.detailType === InvoiceItemDetailTypeEnum.SALES_ITEM_LINE_DETAIL
      || invoiceItem.detailType === InvoiceItemDetailTypeEnum.GROUP_LINE_DETAIL;
  }

  isSubtotalLine(invoiceItem) {
    return invoiceItem.detailType === InvoiceItemDetailTypeEnum.SUBTOTAL_LINE;
  }

  isDescriptionOnly(invoiceItem) {
    return invoiceItem.detailType === InvoiceItemDetailTypeEnum.DESCRIPTION_ONLY;
  }

  print() {
    window.print();
    return false;
  }

  getGridTemplateRows(): SafeStyle {
    const maxHeight = Math.max.apply(Math, this.emailTemplate.map(o => o.y + o.rows));
    return this.sanitizer.bypassSecurityTrustStyle(getMessage('repeat($s, 1fr)', maxHeight + 1));
  }

  getGridAreaForComponent(component: GridAreaModel) {
    return this.sanitizer
      .bypassSecurityTrustStyle(
        getMessage('%s / %s / span %s / span %s', [component.y + 1, component.x + 1, component.rows, component.cols]));
  }

  getGridArea(key): SafeStyle {
    const component = this.emailTemplate.find(comp => comp.id == key);
    if (component) {
      return this.getGridAreaForComponent(component);
    }
    return null;
  }

  /** Legacy layout from the QBO interpret
   after render, measure each block and snap it to a discrete 45pt row grid, then push overlapping blocks down.
   Runs only when legacyLayout == true. **/
  private readonly LEGACY_ROW_HEIGHT_PT = 45;
  private readonly LEGACY_GAP_PT = 7.5;
  private _calculatedSpans = new Map<string, number>();

  updateGrid(gridElements: ElementRef[]): void {
    if (!this.legacyLayout || !gridElements?.length) {
      return;
    }
    this.calculateGridSpans(gridElements);
    this.updateEmailTemplate();
  }

  private calculateGridSpans(gridElements: ElementRef[]): Map<string, number> {
    const PT_PER_PX = 72 / 96;
    const totalRowHeightPt = this.LEGACY_ROW_HEIGHT_PT + this.LEGACY_GAP_PT;
    const spanMap = new Map<string, number>();
    const validClasses = new Set<string>(Object.values(InvoiceEmailPaymentTemplateComponentsEnum));

    gridElements.forEach(gridRef => {
      const grid = gridRef.nativeElement as HTMLElement;
      grid.style.gridAutoRows = 'min-content';
      void grid.offsetHeight; // force reflow so measurements are current
      const children = Array.from(grid.children) as HTMLElement[];

      children.forEach(child => {
        const matchedClass = Array.from(child.classList).find(c => validClasses.has(c));
        if (!matchedClass) {
          return;
        }
        const heightPt = child.getBoundingClientRect().height * PT_PER_PX;
        const span = Math.max(1, Math.ceil(heightPt / totalRowHeightPt));
        child.style.gridRowEnd = `span ${span}`;
        spanMap.set(matchedClass, span);
      });

      grid.style.gridAutoRows = `${this.LEGACY_ROW_HEIGHT_PT}pt`;
    });

    this._calculatedSpans = spanMap;
    return spanMap;
  }

  private updateEmailTemplate(): void {
    const spanMap = this._calculatedSpans;

    for (const comp of this._emailTemplate) {
      const span = spanMap.get(comp.id);
      if (span != null) {
        comp.rows = span;
      }
    }

    const originalY = new Map<GridAreaModel, number>();
    this._emailTemplate.forEach(c => originalY.set(c, c.y));

    // group components by their original top row
    const rowsByOriginalY = new Map<number, GridAreaModel[]>();
    for (const comp of this._emailTemplate) {
      const y = originalY.get(comp);
      const bucket = rowsByOriginalY.get(y);
      if (bucket) {
        bucket.push(comp);
      } else {
        rowsByOriginalY.set(y, [comp]);
      }
    }
    const orderedRows = Array.from(rowsByOriginalY.keys()).sort((a, b) => a - b);

    const placed: GridAreaModel[] = [];
    for (const rowY of orderedRows) {
      const rowComponents = rowsByOriginalY.get(rowY);

      // the whole row must start below any already-placed component it overlaps horizontally
      let requiredY = rowY;
      for (const current of rowComponents) {
        for (const prev of placed) {
          const horizontallyOverlap =
            !(current.x + current.cols <= prev.x || current.x >= prev.x + prev.cols);
          if (horizontallyOverlap) {
            requiredY = Math.max(requiredY, prev.y + prev.rows);
          }
        }
      }

      // move the entire row together, preserving the components arrangement
      for (const current of rowComponents) {
        current.y = requiredY;
        placed.push(current);
      }
    }

    this._emailTemplate = [...this._emailTemplate].sort((a, b) => a.y - b.y);
  }

  private show(layout: GridAreaModel[], colId) {
    return GridColumnsHelper.hasColumn(layout, colId);
  }

  private getOrder(layout: GridAreaModel[], colId): number {
    return GridColumnsHelper.getColumnOrder(layout, colId);
  }

  showColumnInItemTable(colId: InvoiceItemsTableColumnsEnum): boolean {
    return this.show(this.itemTableLayout, colId);
  }

  getItemTableColumnOrder(colId: InvoiceItemsTableColumnsEnum): number {
    return this.getOrder(this.itemTableLayout, colId);
  }

  isEven(i) {
    return i % 2 === 0;
  }

  getBackgroundColor(i) {
    return this.isEven(i) ? this.colorEven : this.colorOdd;
  }


  isTotalRowPresented(row: string): boolean {
    return ObjectHelper.isDefined(this.itemTableTemplate.totals.find(c => c == row));
  }

  isTotalRowVisible(row: InvoiceItemsTableTotalsEnum): boolean {
    if (!this.isTotalRowPresented(row)) {
      return false;
    }
    switch (row) {
      case InvoiceItemsTableTotalsEnum.DISCOUNT:
        return ObjectHelper.isDefined(this.invoice.discount) && this.invoice.discount > 0;
      case InvoiceItemsTableTotalsEnum.SHIPPING_COST:
        return ObjectHelper.isDefined(this.invoice.shippingCost) && this.invoice.shippingCost > 0;
      case InvoiceItemsTableTotalsEnum.TIP:
        return ObjectHelper.isDefined(this.invoice.tip) && this.invoice.tip > 0;
      case InvoiceItemsTableTotalsEnum.TOTAL:
        return ObjectHelper.isDefined(this.invoice.total);
      default:
        return true;
    }
  }

  getTotalRowBackground(row: InvoiceItemsTableTotalsEnum): string {
    const rows = this.legacyLayout ? InvoiceItemsTableTotalsLegacyOrdered : InvoiceItemsTableTotalsOrdered;
    const index = rows.filter(r => this.isTotalRowVisible(r)).indexOf(row);
    return this.isEven(index)
      ? this.itemTableTemplate.colorOdd ?? this.colorOdd
      : this.itemTableTemplate.colorEven ?? this.colorEven;
  }

  setTotalsBackground(parentElement: ElementRef) {
    const headers = parentElement.nativeElement.querySelectorAll('.TOTAL_HEADERS .tr');
    const values = parentElement.nativeElement.querySelectorAll('.TOTAL_VALUES .tr');
    this.setTotalRowsBackground(headers);
    this.setTotalRowsBackground(values);
  }

  private setTotalRowsBackground(rows) {
    rows.forEach((tr, index) => {
      tr.querySelectorAll('.td').forEach((td) => {
        td.style.backgroundColor = (this.invoiceItems.length + index + 1) % 2 == 0 ? this.colorEven : this.colorOdd;
      });

    });
  }

  getTotalBackground(parentElement: ElementRef, element: HTMLElement): string {
    if (parentElement) {
      const children = Array.from(parentElement.nativeElement.children);
      return this.isEven(children.indexOf(element)) ? this.colorEven : this.colorOdd;
    }
    return this.colorEven;
  }

  getInvoiceItemTableTemplateColumns(): SafeStyle {
    if (!this.itemTableTemplate.autoColumnWidths) {
      return GridColumnsHelper.getWeightedColumns(this.itemTableLayout, this.MIN_COLUMN_WIDTH);
    }
    return GridColumnsHelper.getAutoColumns(this.itemTableLayout.length, this.BEFORE_LAST_COLUMN_WIDTH, this.LAST_COLUMN_WIDTH);
  }

  getInvoiceItemTableTotalsColumns(): SafeStyle {
    if (this.itemTableTemplate.autoColumnWidths || this.itemTableLayout.length < 3) {
      return GridColumnsHelper.getAutoTotalsColumns(this.BEFORE_LAST_COLUMN_WIDTH, this.LAST_COLUMN_WIDTH);
    }
    return GridColumnsHelper.getWeightedTotalsColumns(
      this.itemTableLayout, this.MIN_COLUMN_WIDTH, this.splitLabelSpan, this.splitAmountSpan);
  }

  getInvoiceItemTableMemoTotalsColumns(): SafeStyle {
    if (this.itemTableTemplate.autoColumnWidths || this.itemTableLayout.length < 3) {
      return GridColumnsHelper.getAutoMemoTotalsColumns(this.BEFORE_LAST_COLUMN_WIDTH, this.LAST_COLUMN_WIDTH);
    }
    return GridColumnsHelper.getWeightedMemoTotalsColumns(
      this.itemTableLayout, this.MIN_COLUMN_WIDTH, this.splitLabelSpan, this.splitAmountSpan);
  }

  private get splitLabelSpan(): number | null {
    return this.itemTableTemplate.autoTotalsWidth ? null : this.itemTableTemplate.totalsLabelColumnSpan;
  }

  private get splitAmountSpan(): number | null {
    return this.itemTableTemplate.autoTotalsWidth ? null : this.itemTableTemplate.totalsAmountColumnSpan;
  }

  getItemsRowsTemplateColumns(): string | null {
    if (!this._itemsRowsTemplate.autoColumnWidths) {
      return GridColumnsHelper.getWeightedColumns(this._itemsRowsTemplate.itemTable, this.MIN_COLUMN_WIDTH);
    }
    return null;
  }

  getLineCSS(): string {
    return this._lineTemplates.map(lineTemplate => `
        .line${lineTemplate.id}::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: ${SaleTemplateRenderHelper.getLineCss(lineTemplate.color, lineTemplate.width, lineTemplate.style)};
    }
  `).join('\n');
  }


  getCustomFieldsCSS(): string {
    return this._customFieldsTemplates.map(customFieldsTemplate => {
      return `.${customFieldsTemplate.id} {
                --border: ${this.getBorderFromColor(customFieldsTemplate.borderColor)};
                          --colorOdd: ${customFieldsTemplate.colorOdd};
                          --titleColor: ${customFieldsTemplate.titleColor};

                          * {
                            color: ${customFieldsTemplate.fontColor};
                          }

                          .table{
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }

                          .th {
                            background: var(--titleColor);
                          }
            }`;
    }).join('\n');
  }

  getText(textId): SafeHtml {
    let contentHTML = this._textsTemplates.find(text => text.id == textId)?.content;
    if (contentHTML) {
      contentHTML = replacePlaceholders(contentHTML, this._textPlaceholders);
      return this.htmlSanitizer.sanitizeToSafeHtml(contentHTML);
    }
    return null;
  }

  isCompanyInfoRowPresented(template: CompanyInfoTemplateModel, column: string): boolean {
    return SaleTemplateRenderHelper.isPresented(template.companyInfoRows, column);
  }

  isAnyCompanyInfoRowPresented(template: CompanyInfoTemplateModel, columns: string[]): boolean {
    return ObjectHelper.isDefined(columns.find(column => this.isCompanyInfoRowPresented(template, column)));
  }

  showColumnInItemsRows(colId: InvoiceItemsTableColumnsEnum): boolean {
    return this.show(this._itemsRowsTemplate.itemTable, colId);
  }

  getItemsRowsColumnOrder(colId: InvoiceItemsTableColumnsEnum): number {
    return this.getOrder(this._itemsRowsTemplate.itemTable, colId);
  }

  get hasNotEmptyCustomFields(): boolean {
    return ObjectHelper.isDefined(this.invoice.customFieldsInfo?.customFields) && this.invoice.customFieldsInfo.customFields.length > 0;
  }

  get customFieldsTemplates(): CustomFieldsTemplateModel[] {
    return this._customFieldsTemplates;
  }

  set customFieldsTemplate(value: CustomFieldsTemplateModel[]) {
    this._customFieldsTemplates = value;
  }

  getItemTableCustomerMemoCSS() {
    return this.itemTableTemplate.customerMemoColor
      ? `.tr:nth-child(even) > .memo-totals-row > .td.customer-memo {
            background: ${this.itemTableTemplate.customerMemoColor};
         }

         .tr:nth-child(odd) > .memo-totals-row > .td.customer-memo {
            background: ${this.itemTableTemplate.customerMemoColor};
         }`
      : '';
  }

  private prepareTemplate(_invoiceTemplateDataModel: SaleEmailTemplateData): InvoiceTemplateModel {
    const template = cloneDeep(_invoiceTemplateDataModel.fullTemplate);

    const markComponentEmpty = (id: InvoiceEmailPaymentTemplateComponentsEnum) => {
      const component = template.components.find(c => c.id === id);
      if (component) {
        component.isEmpty = true;
      }
    };

    if (!ObjectHelper.isDefined(_invoiceTemplateDataModel.shippingAddress)) {
      markComponentEmpty(InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS);
    }

    if (!ObjectHelper.isDefined(_invoiceTemplateDataModel.shippingInfo)) {
      markComponentEmpty(InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO);
    }

    if (!ObjectHelper.isDefined(_invoiceTemplateDataModel.saleAdditionalInfo?.terms) && !ObjectHelper.isDefined(_invoiceTemplateDataModel.saleAdditionalInfo?.dueDate)) {
      markComponentEmpty(InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL);
    }

    if (_invoiceTemplateDataModel.invoiceItems.length == 0) {
      markComponentEmpty(InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS);
    }
    return template;
  }

  getCustomFieldsTemplate(customFieldsTemplateId: string) {
    return this._customFieldsTemplates.find(customFieldTemplate => customFieldTemplate.id == customFieldsTemplateId);
  }

  getOrderInCustomFields(customFieldsTemplate: CustomFieldGridAreaModel[], colId) {
    return customFieldsTemplate.sort((a, b) => a.x - b.x).map(col => col.id).indexOf(colId) + 1;
  }

  getCustomFieldStringValue(name: string) {
    const customField = this.invoice.customFieldsInfo?.customFields.find(customField => customField.name == name);
    return customField ? customField.value : null;
  }

  showColumnInAdditionalInfo(saleAdditionalInfoTemplate: InvoiceAdditionalInfoTemplateModel, colId: SaleAdditionalInfoColumnsEnum): boolean {
    return this.show(saleAdditionalInfoTemplate.additionalInfo, colId);
  }

  getOrderInSaleAdditionalInfo(saleAdditionalInfoTemplate: InvoiceAdditionalInfoTemplateModel, colId) {
    return this.getOrder(saleAdditionalInfoTemplate.additionalInfo, colId);
  }

  getCustomerNameTemplate(customerNameTemplateId: string) {
    return this._customerNameTemplates.find(customerNameTemplate => customerNameTemplate.id == customerNameTemplateId);
  }

  getCustomerNameCSS(): string {
    return this._customerNameTemplates.map(customerNameTemplate => {
      return `.${customerNameTemplate.id} {
                          --border: ${this.getBorderFromColor(customerNameTemplate.borderColor)};
                          --colorOdd: ${customerNameTemplate.colorOdd};
                          --titleColor: ${customerNameTemplate.titleColor};

                          * {
                            color: ${customerNameTemplate.fontColor};
                          }

                          .table{
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }

                          .th {
                            background: var(--titleColor);
                          }
            }`;
    }).join('\n');
  }

  get totalFormatted(): string {
    return ObjectHelper.isDefined(this.invoice.total) ? `${this.invoice.currency}${this.decimalPipe.transform(this.invoice.total, '1.2-2')}` : null;
  }

  get amountDueFormatted(): string {
    return ObjectHelper.isDefined(this.invoice.amountDue) ? `${this.invoice.currency}${this.decimalPipe.transform(this.invoice.amountDue, '1.2-2')}` : null;
  }

  get shippingCostFormatted(): string {
    return ObjectHelper.isDefined(this.invoice.shippingCost) ? `${this.invoice.currency}${this.decimalPipe.transform(this.invoice.shippingCost, '1.2-2')}` : null;
  }

  getCompanyInfoCSS(): string {
    return this._companyInfoTemplates.map(t => {
      return `.${t.id} {
                          --border: ${this.getBorderFromColor(t.borderColor)};
                          --colorOdd: ${t.colorOdd};
                          --titleColor: ${t.titleColor};

                          * {
                            color: ${t.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }
                        }`
    }).join('\n');
  }

  getCompanyInfoTemplate(companyInfoTemplateId: string) {
    return this._companyInfoTemplates.find(companyInfoTemplate => companyInfoTemplate.id == companyInfoTemplateId);
  }

  getSaleAdditionalInfoCSS(): string {
    return this._saleAdditionalInfoTemplates.map(t => {
      return `.${t.id} {
                          --border: ${this.getBorderFromColor(t.borderColor)};
                          --colorOdd: ${t.colorOdd};
                          --titleColor: ${t.titleColor};

                          * {
                            color: ${t.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }
                        }`
    }).join('\n');
  }

  getSaleAdditionalInfoTemplate(saleAdditionalInfoTemplateId: string) {
    return this._saleAdditionalInfoTemplates.find(template => template.id == saleAdditionalInfoTemplateId);
  }

  get customFieldsEnabled(): boolean {
    return this.invoice.customFieldsEnabled;
  }

  get advancedFieldsEnabled(): boolean {
    return this.invoice.advancedFieldsEnabled;
  }
}
