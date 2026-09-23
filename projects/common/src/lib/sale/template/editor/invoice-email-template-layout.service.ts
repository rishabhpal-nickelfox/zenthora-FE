import {EventEmitter, Injectable, Output} from '@angular/core';
import {GridsterComponent, GridsterConfig, GridsterItemComponentInterface} from 'angular-gridster2';
import {InvoiceEmailTemplateLayoutCommonService} from './invoice-email-template-layout-common.service';
import {GridsterItem} from 'angular-gridster2/lib/gridsterItem.interface';
import {InvoiceItemsTableTemplateLayoutService} from './items/full/invoice-items-table-template-layout.service';
import {InvoiceItemRowsTemplateLayoutService} from './items/rows/invoice-item-rows-template-layout.service';
import {
  InvoiceEmailPaymentTemplateComponentsEnum, InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../enums/sale/invoice-email-payment-template-components.enum";
import {ObjectHelper} from "../../../helpers/object.helper";
import {
  InvoiceEmailPaymentTemplateLogoSizeEnum
} from "../../../enums/sale/invoice-email-payment-template-logo-size.enum";
import {
  InvoiceTemplateModel
} from "../../../models/sale/template/invoice-template.model";
import {TemplateRenderSizes} from "../template-render-sizes";
import {CustomFieldsTableTemplateLayoutService} from "./customfields/custom-fields-table-template-layout.service";
import {InvoiceAdditionalInfoLayoutService} from "./invoiceinfo/additional/invoice-additional-info-layout.service";
import {CustomerNameViewService} from "./customername/customer-name-view.service";


@Injectable()
export class InvoiceEmailTemplateLayoutService extends InvoiceEmailTemplateLayoutCommonService {
  public static readonly GRID_GAP_MIN = 1;
  public static readonly GRID_GAP_MAX = 10;
  public static readonly RENDER_WIDTH_PX = TemplateRenderSizes.WIDTH_PX;
  public static readonly GRID_COLS = 12;
  public static readonly RENDER_MIN_ROW_HEIGHT_PX = 60;

  // Match editor column width to renderer grid: (renderWidth - innerGaps) / cols
  private static colWidthFor(gridGap: number): number {
    return (InvoiceEmailTemplateLayoutService.RENDER_WIDTH_PX
        - (InvoiceEmailTemplateLayoutService.GRID_COLS - 1) * gridGap)
      / InvoiceEmailTemplateLayoutService.GRID_COLS;
  }

  private getMinCols(componentId: InvoiceEmailPaymentTemplateComponentsEnum): number {
    switch (componentId) {
      case InvoiceEmailPaymentTemplateComponentsEnum.ITEMS:
        return this.invoiceItemsTableTemplateLayoutService.getMinimumCols();
      case InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS:
        return this.invoiceItemRowsTemplateLayoutService.getMinimumCols();
      case InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO:
      case InvoiceEmailPaymentTemplateComponentsEnum.BILLING_ADDRESS:
      case InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS:
      case InvoiceEmailPaymentTemplateComponentsEnum.LOGO:
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL:
      case InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_MEMO:
        return 3;
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_SHORT_INFO:
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_FULL_INFO:
      case InvoiceEmailPaymentTemplateComponentsEnum.TOTALS:
        return 4;
      case InvoiceEmailPaymentTemplateComponentsEnum.TEXT:
      case InvoiceEmailPaymentTemplateComponentsEnum.LINE:
        return 2;
      case InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO:
        return 2;
      case InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME:
        return 2;
      default:
        return 4;
    }
  }

  private getMinRows(componentId: InvoiceEmailPaymentTemplateComponentsEnum): number {
    switch (componentId) {
      case InvoiceEmailPaymentTemplateComponentsEnum.ITEMS:
        return 9;
      case InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS:
        return 4;
      case InvoiceEmailPaymentTemplateComponentsEnum.TOTALS:
        return 5;
      case InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO:
        return 4;
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_SHORT_INFO:
        return 2;
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL:
        return 2;
      case InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO:
        return 2;
      case InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME:
        return 2;
      case InvoiceEmailPaymentTemplateComponentsEnum.BILLING_ADDRESS:
      case InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS:
      case InvoiceEmailPaymentTemplateComponentsEnum.LOGO:
      case InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_MEMO:
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_FULL_INFO:
      case InvoiceEmailPaymentTemplateComponentsEnum.TEXT:
      case InvoiceEmailPaymentTemplateComponentsEnum.LINE:
      default:
        return 3;
    }
  }

  public options: GridsterConfig = {
    gridType: 'fixed',
    setGridSize: true,
    draggable: {
      enabled: true
    },
    pushItems: true,
    resizable: {
      enabled: true,
      stop: (item: GridsterItem, gridsterItemComponent: GridsterItemComponentInterface) => {
        requestAnimationFrame(() => {
          this.enforceMinimumCols(gridsterItemComponent);
          if (this.minimizeVerticalSize) {
            this.enforceRowsToContent(gridsterItemComponent);
          }
        });

      }
    },
    displayGrid: 'always',
    minCols: InvoiceEmailTemplateLayoutService.GRID_COLS,
    maxCols: InvoiceEmailTemplateLayoutService.GRID_COLS,
    minRows: 7,
    fixedColWidth: InvoiceEmailTemplateLayoutService.colWidthFor(10),
    fixedRowHeight: InvoiceEmailTemplateLayoutService.RENDER_MIN_ROW_HEIGHT_PX,
    margin: this.gridGap,
    minItemCols: 2,
    minItemRows: 1,
    addEmptyRowsCount: 2,
    compactType: 'none'
  };

  @Output() logoSizeChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(private invoiceItemsTableTemplateLayoutService: InvoiceItemsTableTemplateLayoutService,
              private invoiceItemRowsTemplateLayoutService: InvoiceItemRowsTemplateLayoutService,
              private customFieldsTableTemplateLayoutService: CustomFieldsTableTemplateLayoutService,
              private additionalInfoLayoutService: InvoiceAdditionalInfoLayoutService,
              private customerNameViewService: CustomerNameViewService) {
    super();
  }


  get fontSize(): number {
    return ObjectHelper.isDefined(this._fontSize) ? this._fontSize : 14;
  }

  private add(layout, componentRef, cols: number, rows: number, x?: number, y?: number): GridsterItem {
    const newItem = {
      cols: cols,
      id: componentRef,
      rows: rows,
      x: x ?? 0,
      y: y ?? 0
    };
    layout.push(newItem);
    return newItem;
  }

  addItem(layout, componentRef): GridsterItem {
    return this.add(layout, componentRef, Math.max(this.getMinCols(componentRef), 4), Math.max(this.getMinRows(componentRef), 3));
  }

  addLine(lineId): GridsterItem {
    const newLine = {
      cols: 3,
      id: InvoiceEmailPaymentTemplateComponentsEnum.LINE,
      lineId: lineId,
      rows: 1,
      x: 0,
      y: 0
    };
    this.layout.push(newLine);
    return newLine;
  }


  deleteLine(lineId) {
    const item = this.layout.find(d => d.id === InvoiceEmailPaymentTemplateComponentsEnum.LINE && d.lineId == lineId);
    this.layout.splice(this.layout.indexOf(item), 1);
  }

  private _logoSize: InvoiceEmailPaymentTemplateLogoSizeEnum;

  get logoSize(): InvoiceEmailPaymentTemplateLogoSizeEnum {
    return this._logoSize || InvoiceEmailPaymentTemplateLogoSizeEnum.S;
  }

  set logoSize(value: InvoiceEmailPaymentTemplateLogoSizeEnum) {
    this._logoSize = value;
    this.logoSizeChanged.emit();
    this.settingsChanged.emit();
  }

  set fontSize(value: number) {
    this._fontSize = value;
    this.settingsChanged.emit();
  }

  get lineHeight(): number {
    return ObjectHelper.isDefined(this._lineHeight) ? this._lineHeight : InvoiceTemplateModel.DEFAULT_LINE_HEIGHT;
  }

  set lineHeight(value: number) {
    this._lineHeight = value;
    this.settingsChanged.emit();
  }

  initSettings(value: InvoiceTemplateModel) {
    this._fontSize = value.fontSize;
    this._lineHeight = value.lineHeight;
    this._titleColor = value.titleColor;
    this._borderColor = value.borderColor;
    this._colorEven = value.colorEven;
    this._colorOdd = value.colorOdd;
    this._fontColor = value.fontColor;
    this._logoSize = value.logoSize;
    this._version = value.version;
    this.minimizeVerticalSize = value.minimizeVerticalSize;
    this.gridGap = value.gridGap;
  }

  addInvoiceItemTable(): GridsterItem {
    return this.add(this.layout, InvoiceEmailPaymentTemplateComponentsEnum.ITEMS, 12, 9);
  }

  addInvoiceItemRows(): GridsterItem {
    return this.add(this.layout, InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS, 12, 4);
  }


  addText(textId): GridsterItem {
    const newText = {
      cols: 3,
      id: InvoiceEmailPaymentTemplateComponentsEnum.TEXT,
      textId: textId,
      rows: 2,
      x: 0,
      y: 0
    };
    this.layout.push(newText);
    return newText;
  }

  addCustomFields(customFieldsTemplateId): GridsterItem {
    const newCustomFields = {
      cols: 3,
      id: InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS,
      customFieldsId: customFieldsTemplateId,
      rows: 2,
      x: 0,
      y: 0
    };
    this.layout.push(newCustomFields);
    return newCustomFields;
  }


  addSaleAdditionalInfo(additionalInfoId: string): GridsterItem {
    const newSaleAdditional = {
      cols: 3,
      id: InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL,
      saleAdditionalInfoId: additionalInfoId,
      rows: 2,
      x: 0,
      y: 0
    };
    this.layout.push(newSaleAdditional);
    return newSaleAdditional;
  }


  deleteText(textId) {
    const item = this.layout.find(d => d.id === InvoiceEmailPaymentTemplateComponentsEnum.TEXT && d.textId == textId);
    this.checkAndSplice(this.layout, item);
  }


  deleteCustomFields(customFieldId) {
    const item = this.layout.find(d => d.id === InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS && d.customFieldsId == customFieldId);
    this.checkAndSplice(this.layout, item);
  }

  deleteSaleAdditionalInfo(additionalInfoId: string) {
    const item = this.layout.find(d => d.id === InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL && d.saleAdditionalInfoId == additionalInfoId);
    this.checkAndSplice(this.layout, item);
  }

  addCustomerName(customerNameId): GridsterItem {
    const newCustomerName = {
      cols: 2,
      id: InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME,
      customerNameId: customerNameId,
      rows: 2,
      x: 0,
      y: 0
    };
    this.layout.push(newCustomerName);
    return newCustomerName;
  }

  deleteCustomerName(customerNameId) {
    const item = this.layout.find(d => d.id === InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME && d.customerNameId == customerNameId);
    this.checkAndSplice(this.layout, item);
  }

  addCompanyInfo(companyInfoId): GridsterItem {
    const newCompanyInfo = {
      cols: 4,
      id: InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO,
      companyInfoId: companyInfoId,
      rows: 4,
      x: 0,
      y: 0
    };
    this.layout.push(newCompanyInfo);
    return newCompanyInfo;
  }

  deleteCompanyInfo(companyInfoId) {
    const item = this.layout.find(d => d.id === InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO && d.companyInfoId == companyInfoId);
    this.checkAndSplice(this.layout, item);
  }

  getComponentRenderWidth(componentId): number {
    const item = this.layout.find(i => i.id === componentId);
    const cols = item?.cols ?? InvoiceEmailTemplateLayoutService.GRID_COLS;
    return cols * Number(this.options.fixedColWidth) + (cols - 1) * this.gridGap;
  }

  enforceMinimumCols(gridsterItemComponent: GridsterItemComponentInterface): void {
    const gridsterItem = gridsterItemComponent.item;
    const minCols = this.getMinCols(gridsterItem.id) || this.options.minItemCols;

    // Calculate target columns based on the element's width
    const elementWidth = gridsterItemComponent.el.offsetWidth;
    const targetCols = Math.round(
      (elementWidth + this.options.margin) / (this.options.fixedColWidth + this.options.margin)
    );

    // Enforce the minimum column constraint
    if (targetCols < minCols) {
      gridsterItem.cols = minCols; // Adjust to the minimum size
      gridsterItemComponent.item.cols = minCols;

      // Update the element's width to reflect the minimum columns
      const newWidth = minCols * this.options.fixedColWidth + (minCols - 1) * this.options.margin;
      gridsterItemComponent.el.style.width = `${newWidth}px`;

      // Trigger Gridster layout updates
      gridsterItemComponent.gridster?.options.api?.optionsChanged?.();
    }
  }

  private _version: string;

  get version(): string {
    return this._version;
  }

  private _minimizeVerticalSize = false;

  get minimizeVerticalSize(): boolean {
    return this._minimizeVerticalSize ?? false;
  }

  set minimizeVerticalSize(value: boolean) {
    this._minimizeVerticalSize = value;
    this.options.compactType = 'none';
    this.options.api?.optionsChanged?.();
    this.options.api?.resize?.();
  }

  private _gridGap: number;

  set gridGap(value: number | string) {
    if (null != value) {
      this._gridGap = Math.min(
        Math.max(Number(value), InvoiceEmailTemplateLayoutService.GRID_GAP_MIN),
        InvoiceEmailTemplateLayoutService.GRID_GAP_MAX
      );
      this.options.margin = this._gridGap;
      // Keep the total grid width equal to render width for any gap
      this.options.fixedColWidth = InvoiceEmailTemplateLayoutService.colWidthFor(this._gridGap);
      this.options.api?.optionsChanged?.();
      this.options.api?.resize?.();
    }
  }

  get gridGap(): number {
    return this._gridGap ?? 10;
  }

  enforceRowsToAll(grid: GridsterComponent): void {
    if (this.minimizeVerticalSize) {
      grid.grid.forEach(item => {
        this.enforceRowsToContent(item);
      })
      //   this.collapseEmptyRows(grid);
      this.options.api?.optionsChanged?.();
      this.options.api?.resize?.();
    }
  }

  enforceRowsToContent(comp: GridsterItemComponentInterface): void {
    const gridItem = comp.item;
    const gridItemHTMLElement = comp.el as HTMLElement;

    let contentElement =
      (gridItemHTMLElement.querySelector('[data-grid-content]') as HTMLElement) ||
      gridItemHTMLElement;

    const contentHeight =
      (contentElement.getBoundingClientRect().height ||
        contentElement.scrollHeight ||
        contentElement.clientHeight ||
        0) + 1;

    const newRows = Math.min(
      Number(gridItem.rows) || 1,
      Math.max(
        this.options.minItemRows ?? 1,
        Math.ceil(
          (contentHeight + (Number(this.options.margin) || 0)) /
          ((Number(this.options.fixedRowHeight) || 1) + (Number(this.options.margin) || 0))
        )
      )
    );

    if (newRows === gridItem.rows) return;

    gridItem.rows = newRows;
    comp.item.rows = newRows;

    const newHeight =
      newRows * (Number(this.options.fixedRowHeight) || 1) +
      (newRows - 1) * (Number(this.options.margin) || 0);
    gridItemHTMLElement.style.height = `${newHeight}px`;

    this.options.api?.optionsChanged?.();
    this.options.api?.resize?.();
  }


  collapseEmptyRows(grid: GridsterComponent): void {
    const items: GridsterItem[] = grid?.grid?.map(c => c.item) ?? [];
    if (!items.length) return;

    const maxRow = items.reduce((m, it) => Math.max(m, it.y + it.rows), 0);
    if (maxRow <= 0) return;

    const occupied: boolean[] = new Array(maxRow).fill(false);
    for (const it of items) {
      const start = Math.max(0, it.y);
      const end = Math.max(start, Math.min(maxRow, it.y + it.rows));
      for (let r = start; r < end; r++) {
        occupied[r] = true;
      }
    }

    const emptyAbove: number[] = new Array(maxRow + 1).fill(0);
    for (let r = 1; r <= maxRow; r++) {
      emptyAbove[r] = emptyAbove[r - 1] + (occupied[r - 1] ? 0 : 1);
    }

    let changed = false;
    for (const it of items) {
      const newY = it.y - emptyAbove[it.y];
      if (newY !== it.y) {
        it.y = newY;
        changed = true;
      }
    }
  }

  get advancedFieldsEnabled(): boolean {
    return this._advancedFieldsEnabled;
  }

  set advancedFieldsEnabled(value: boolean) {
    if (value != this._advancedFieldsEnabled) {
      this._advancedFieldsEnabled = value;
      this.additionalInfoLayoutService.advancedFieldsEnabled = value;
      this.invoiceItemsTableTemplateLayoutService.advancedFieldsEnabled = value;
      this.invoiceItemRowsTemplateLayoutService.advancedFieldsEnabled = value;
      this.customerNameViewService.advancedFieldsEnabled = value;
      if (!value) {
        this.layout = this.layout?.filter(t => t.id != InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME &&
          t.id != InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO) ?? [];
      }
    }
  }

  get customFieldsEnabled(): boolean {
    return this._customFieldsEnabled;
  }

  set customFieldsEnabled(value: boolean) {
    if (value != this._customFieldsEnabled) {
      this._customFieldsEnabled = value;
      this.customFieldsTableTemplateLayoutService.customFieldsEnabled = value;
      if (!value) {
        this.layout = this.layout?.filter(t => t.id != InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS) ?? [];
      }
    }
  }

  private _customFieldsEnabled: boolean;
  private _advancedFieldsEnabled: boolean;

}
