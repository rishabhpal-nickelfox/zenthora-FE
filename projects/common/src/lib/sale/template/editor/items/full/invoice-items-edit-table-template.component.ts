import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SafeStyle} from '@angular/platform-browser';
import {InvoiceItemsLabels} from '../invoice-items-labels';
import cloneDeep from 'lodash/cloneDeep';
import {ItemsColumnField, ItemsColumnsEditComponent} from '../items-columns-edit.component';
import {InvoiceItemsTableColumnsEnum,
  InvoiceItemsTableColumnsEnumValue
} from "../../../../../enums/sale/invoice-items-table-columns.enum";
import {InvoiceItemsTableTotalsEnum,
  InvoiceItemsTableTotalsEnumValue
} from "../../../../../enums/sale/invoice-items-table-totals.enum";
import {InvoiceItemsTableTemplateLayoutService} from "./invoice-items-table-template-layout.service";
import {CustomValidator} from "../../../../../helpers/custom.validator";
import {FormPageStateService} from "../../../../../utils/form-page-state.service";
import {ErrorService} from "../../../../../utils/errorhandler/error.service";
import {ObjectHelper} from "../../../../../helpers/object.helper";
import {ItemTemplateData
} from "../../../../../models/sale/template/sale-email-template-data.model";
import {InvoiceItemsDataService} from "../invoice-items-data.service";
import {GridColumnsHelper} from "../../../../../helpers/grid-columns.helper";
import {InvoiceTotalsPreviewHelper} from "../invoice-totals-preview.helper";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../../enums/sale/invoice-email-payment-template-components.enum";

@Component({
  standalone: false,
  selector: 'app-invoice-items-edit-table-template',
  templateUrl: './invoice-items-edit-table-template.component.html',
  styleUrls: ['../../columns-drag.scss', '../items-columns-edit.scss',
    './invoice-items-edit-table-template.component.scss', '../../../../../modals/external-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemsEditTableTemplateComponent
  extends ItemsColumnsEditComponent<InvoiceItemsTableTemplateLayoutService> implements OnInit {

  styles: SafeStyle;

  readonly MAX_LENGTH = {
    HEADER: 20
  };

  readonly InvoiceItemsTableColumnsEnum = InvoiceItemsTableColumnsEnum;
  readonly InvoiceItemsTableColumnsEnumValue = InvoiceItemsTableColumnsEnumValue;

  readonly InvoiceItemsTableTotalsEnum = InvoiceItemsTableTotalsEnum;
  readonly InvoiceItemsTableTotalsEnumValue = InvoiceItemsTableTotalsEnumValue;

  readonly Labels = InvoiceItemsLabels;

  headerValidation = (key, control) => {
    if (this.viewService && this.viewService.wasAdded(this.layout, key)) {
      return Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)])(control);
    }
    return null;
  };
  protected _lineNumHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.LINE_NUM, c));
  protected _itemHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.ITEM, c));
  protected _descriptionHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.DESCRIPTION, c));
  protected _quantityHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.QTY, c));
  protected _rateHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.RATE, c));
  protected _amountHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.AMOUNT, c));
  protected _taxableHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.TAX, c));
  protected _skuHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.SKU, c));
  protected _serviceDateHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.SERVICE_DATE, c));
  protected _categoryClassHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.CATEGORY_CLASS, c));
  protected _other1Header: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.OTHER_1, c));
  protected _other2Header: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.OTHER_2, c));
  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _titleColor = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorEven = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);
  protected _customerMemoColor: FormControl<string> = new FormControl<string>(null);
  protected _hideCustomerMemo = new FormControl<boolean>(false);
  protected _autoTotalsWidth = new FormControl<boolean>(true);

  protected readonly columnFields = new Map<string, ItemsColumnField>([
    [InvoiceItemsTableColumnsEnum.LINE_NUM, {control: this._lineNumHeader, property: 'lineNum'}],
    [InvoiceItemsTableColumnsEnum.ITEM, {control: this._itemHeader, property: 'name'}],
    [InvoiceItemsTableColumnsEnum.DESCRIPTION, {control: this._descriptionHeader, property: 'description'}],
    [InvoiceItemsTableColumnsEnum.QTY, {control: this._quantityHeader, property: 'quantity'}],
    [InvoiceItemsTableColumnsEnum.RATE, {control: this._rateHeader, property: 'rate'}],
    [InvoiceItemsTableColumnsEnum.AMOUNT, {control: this._amountHeader, property: 'amount'}],
    [InvoiceItemsTableColumnsEnum.TAX, {control: this._taxableHeader, property: 'tax'}],
    [InvoiceItemsTableColumnsEnum.SKU, {control: this._skuHeader, property: 'sku'}],
    [InvoiceItemsTableColumnsEnum.SERVICE_DATE, {control: this._serviceDateHeader, property: 'serviceDate'}],
    [InvoiceItemsTableColumnsEnum.CATEGORY_CLASS, {control: this._categoryClassHeader, property: 'categoryClass'}],
    [InvoiceItemsTableColumnsEnum.OTHER_1, {control: this._other1Header, property: 'other1'}],
    [InvoiceItemsTableColumnsEnum.OTHER_2, {control: this._other2Header, property: 'other2'}]
  ]);

  private _form: FormGroup = new FormGroup({
      lineNumHeader: this._lineNumHeader,
      itemHeader: this._itemHeader,
      descriptionHeader: this._descriptionHeader,
      quantityHeader: this._quantityHeader,
      rateHeader: this._rateHeader,
      amountHeader: this._amountHeader,
      taxableHeader: this._taxableHeader,
      skuHeader: this._skuHeader,
      serviceDateHeader: this._serviceDateHeader,
      categoryClassHeader: this._categoryClassHeader,
      other1Header: this._other1Header,
      other2Header: this._other2Header,
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      colorEven: this._colorEven,
      colorOdd: this._colorOdd,
      titleColor: this._titleColor,
      hideCustomerMemo: this._hideCustomerMemo,
      customerMemoColor: this._customerMemoColor,
      autoColumnWidths: this._autoColumnWidths,
      autoTotalsWidth: this._autoTotalsWidth
    }
  );


  totals: InvoiceItemsTableTotalsEnum[] = [];
  totalsRows = InvoiceTotalsPreviewHelper.getRows(InvoiceItemsDataService.templateData, []);

  protected memoTotalsColumns = '';
  protected totalsColumnsPx = '';
  protected totalsLabelWidthPx = 0;
  protected totalsLabelColumnSpan: number;
  protected totalsAmountColumnSpan: number;

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }

  protected readonly previewData: ItemTemplateData[] = InvoiceItemsDataService.templateData.invoiceItems.slice(0, 1);

  ngOnInit(): void {
    this._form.addValidators(Validators.compose([c => {
      return this.totals.length < 1 ? {totals: this.totals.length} : null;
    }, c => {
      return this.layout.length < 3 ? {layout: this.layout.length} : null;
    }]));
  }

  close() {
    this.activeModal.dismiss();
  }

  get activeModal() {
    return this._activeModal;
  }


  addTotalRow(column: string): void {
    this.totals.push(InvoiceItemsTableTotalsEnum[column]);
    this.onTotalsChanged();
  }

  canAddTotalRow(row: string): boolean {
    return !this.isTotalRowPresented(row);
  }

  canAddCustomerMemo(): boolean {
    return this._hideCustomerMemo.value;
  }

  deleteTotalRow(column: string) {
    this.totals = this.totals.filter(c => c != column);
    this.onTotalsChanged();
  }

  deleteCustomerMemo() {
    this._hideCustomerMemo.setValue(true);
  }

  addCustomerMemo() {
    this._hideCustomerMemo.setValue(false);
  }

  isTotalRowPresented(row: string): boolean {
    return ObjectHelper.isDefined(this.totals.find(c => c == row));
  }

  private onTotalsChanged(): void {
    this.totalsRows = InvoiceTotalsPreviewHelper.getRows(InvoiceItemsDataService.templateData, this.totals);
    this._form.updateValueAndValidity();
  }

  public getForm(): FormGroup {
    return this._form;
  }


  protected onReInit() {
    this._fontColor.reset(this.viewService.fontColor);
    this._borderColor.reset(this.viewService.borderColor);
    this._colorEven.reset(this.viewService.colorEven);
    this._colorOdd.reset(this.viewService.colorOdd);
    this._titleColor.reset(this.viewService.titleColor);
    this._customerMemoColor.reset(this.viewService.customerMemoColor ?? 'none')
    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorEven.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._customerMemoColor.valueChanges.subscribe(() => this.updateStyles()));

    this._lineNumHeader.reset(this.viewService.lineNumHeader);
    this._itemHeader.reset(this.viewService.itemHeader);
    this._descriptionHeader.reset(this.viewService.descriptionHeader);
    this._quantityHeader.reset(this.viewService.quantityHeader);
    this._rateHeader.reset(this.viewService.rateHeader);
    this._amountHeader.reset(this.viewService.amountHeader);
    this._taxableHeader.reset(this.viewService.taxableHeader);
    this._serviceDateHeader.reset(this.viewService.serviceDateHeader);
    this._categoryClassHeader.reset(this.viewService.categoryClassHeader);
    this._other1Header.reset(this.viewService.other1Header);
    this._other2Header.reset(this.viewService.other2Header);
    this._skuHeader.reset(this.viewService.skuHeader);

    this.totals = cloneDeep(this.viewService.totals);
    this.onTotalsChanged();

    this._autoTotalsWidth.reset(this.viewService.autoTotalsWidth);
    this.totalsLabelColumnSpan = this.viewService.totalsLabelColumnSpan;
    this.totalsAmountColumnSpan = this.viewService.totalsAmountColumnSpan;
    this.initColumns(cloneDeep(this.viewService.layout));
    this.subscriptions.add(this._autoTotalsWidth.valueChanges.subscribe(value => {
      if (!value) {
        this.resetTotalsSpans();
      }
      this.syncColumnWidths();
    }));

    this._hideCustomerMemo.reset(this.viewService.hideCustomerMemo);
    this.updateStyles();
    this.ch.detectChanges();
  }

  protected onColumnWidthsChanged(): void {
    if (this.layout.length < 3) {
      this.setTotalsWidthsPx(this.viewService.BEFORE_LAST_COLUMN_WIDTH_PX, this.viewService.LAST_COLUMN_WIDTH_PX);
      return;
    }
    const {labelStart, amountStart} = this.totalsSplit;
    const widths = this.layout.map(item => this.columnWidthPx(item));
    const labelPx = this.sumWidths(widths.slice(labelStart - 1, amountStart - 1));
    const amountPx = this.sumWidths(widths.slice(amountStart - 1));
    this.setTotalsWidthsPx(labelPx, amountPx);
  }

  private setTotalsWidthsPx(labelPx: number, amountPx: number): void {
    this.totalsLabelWidthPx = labelPx;
    this.memoTotalsColumns = `minmax(0, 1fr) ${labelPx + amountPx}px`;
    this.totalsColumnsPx = `${labelPx}px ${amountPx}px`;
  }

  protected get isTotalsSplitEnabled(): boolean {
    return !this._autoColumnWidths.value && !this._autoTotalsWidth.value && this.layout.length > 3;
  }

  // memo | labels border
  protected startLabelsResize(event: PointerEvent): void {
    const {labelStart, amountStart} = this.totalsSplit;

    this.dragBorder(event, {column: labelStart, from: GridColumnsHelper.MIN_LABEL_COLUMN, to: amountStart - 1},
      column => {
        this.totalsLabelColumnSpan = amountStart - column;
      });
  }

  // labels | amount border
  protected startAmountResize(event: PointerEvent): void {
    const {labelStart, amountStart} = this.totalsSplit;

    this.dragBorder(event, {column: amountStart, from: labelStart + 1, to: this.layout.length},
      column => {
        this.totalsLabelColumnSpan = column - labelStart;
        this.totalsAmountColumnSpan = this.layout.length - column + 1;
      });
  }

  // snaps the dragged border to the nearest column
  private dragBorder(event: PointerEvent, border: { column: number, from: number, to: number },
                     moveBorderTo: (column: number) => void): void {
    if (!this.isTotalsSplitEnabled) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const columnEdges = this.getColumnEdgesPx();
    const borderPx = columnEdges[border.column - 1];
    const startX = event.clientX;

    this.trackPointerDrag(moveEvent => {
      const positionPx = borderPx + moveEvent.clientX - startX;
      moveBorderTo(this.nearestColumn(columnEdges, positionPx, border.from, border.to));
      this.onColumnWidthsChanged();
      this.ch.detectChanges();
    });
  }

  private get totalsSplit(): { labelStart: number, amountStart: number } {
    if (!this.isTotalsSplitEnabled) {
      return GridColumnsHelper.normalizeTotalsSplit(this.layout.length);
    }
    return GridColumnsHelper.normalizeTotalsSplit(
      this.layout.length, this.totalsLabelColumnSpan, this.totalsAmountColumnSpan);
  }

  // left edge of every column plus the right edge of the last
  private getColumnEdgesPx(): number[] {
    const edges = [0];
    this.layout.forEach(item => edges.push(edges[edges.length - 1] + this.columnWidthPx(item)));
    return edges;
  }

  private nearestColumn(columnEdges: number[], positionPx: number, firstColumn: number, lastColumn: number): number {
    let nearest = firstColumn;
    let nearestDistance = Math.abs(columnEdges[firstColumn - 1] - positionPx);

    for (let column = firstColumn + 1; column <= lastColumn; column++) {
      const distance = Math.abs(columnEdges[column - 1] - positionPx);
      if (distance < nearestDistance) {
        nearest = column;
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  private sumWidths(widths: number[]): number {
    return widths.reduce((sum, width) => sum + width, 0);
  }

  private resetTotalsSpans(): void {
    this.totalsLabelColumnSpan = 1;
    this.totalsAmountColumnSpan = 1;
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.lineNumHeader = this._lineNumHeader.value;
    this.viewService.itemHeader = this._itemHeader.value;
    this.viewService.descriptionHeader = this._descriptionHeader.value;
    this.viewService.quantityHeader = this._quantityHeader.value;
    this.viewService.rateHeader = this._rateHeader.value;
    this.viewService.amountHeader = this._amountHeader.value;
    this.viewService.taxableHeader = this._taxableHeader.value;
    this.viewService.skuHeader = this._skuHeader.value;
    this.viewService.serviceDateHeader = this._serviceDateHeader.value;
    this.viewService.categoryClassHeader = this._categoryClassHeader.value;
    this.viewService.other1Header = this._other1Header.value;
    this.viewService.other2Header = this._other2Header.value;
    this.viewService.fontColor = this._fontColor.value;
    this.viewService.borderColor = this._borderColor.value;
    this.viewService.colorEven = this._colorEven.value;
    this.viewService.colorOdd = this._colorOdd.value;
    this.viewService.titleColor = this._titleColor.value;
    this.viewService.hideCustomerMemo = this._hideCustomerMemo.value;
    this.viewService.customerMemoColor = this._customerMemoColor.value == 'none' ? null : this._customerMemoColor.value;
    this.viewService.totals = this.totals;
    this.viewService.autoTotalsWidth = this._autoTotalsWidth.value;
    this.viewService.totalsLabelColumnSpan = this._autoTotalsWidth.value ? null : this.totalsLabelColumnSpan;
    this.viewService.totalsAmountColumnSpan = this._autoTotalsWidth.value ? null : this.totalsAmountColumnSpan;
    this.saveColumns();
    this.activeModal.close();
  }

  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                      app-invoice-items-edit-table-template {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --previewFontSize: ${this.viewService.fontSize}pt;
                        --previewLineHeight: ${this.viewService.lineHeight};
                        --fontColor: ${this._fontColor.value};
                        --colorEven: ${this._colorEven.value};
                        --colorOdd: ${this._colorOdd.value};
                        --titleColor: ${this._titleColor.value};
                        --customerMemoColor: ${this._customerMemoColor.value == 'none' ? this._colorOdd.value : this._customerMemoColor.value};

                        .table {
                          border-top: var(--border) !important;
                          border-left: var(--border) !important;
                          color: var(--fontColor);
                        }

                        .td, .th {
                          border-bottom: var(--border) !important;
                          border-right: var(--border) !important;
                        }

                        .th {
                             background: var(--titleColor);
                        }

                        .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                        }

                        .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                        }

                        .tr:nth-child(even) > .qbo-form-control {
                            background: var(--colorEven);
                        }

                        .tr:nth-child(odd) > .qbo-form-control {
                            background: var(--colorOdd);
                        }

                        .tr > .td.customer-memo {
                           background: var(--customerMemoColor);
                        }

                      }
                      </style>`);
    this.ch.detectChanges();
  }

  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
