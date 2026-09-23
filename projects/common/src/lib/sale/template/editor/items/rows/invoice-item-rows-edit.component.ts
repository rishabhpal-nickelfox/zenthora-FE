import {ChangeDetectionStrategy, Component, ElementRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SafeStyle} from '@angular/platform-browser';
import {InvoiceItemRowsTemplateLayoutService} from './invoice-item-rows-template-layout.service';
import {InvoiceItemsLabels} from '../invoice-items-labels';
import {InvoiceItemsDataService} from '../invoice-items-data.service';
import {ItemsColumnField, ItemsColumnsEditComponent} from '../items-columns-edit.component';
import {FormPageStateService} from "../../../../../utils/form-page-state.service";
import {InvoiceItemsTableColumnsEnum,
  InvoiceItemsTableColumnsEnumValue
} from "../../../../../enums/sale/invoice-items-table-columns.enum";
import {CustomValidator} from "../../../../../helpers/custom.validator";
import {ItemTemplateData
} from "../../../../../models/sale/template/sale-email-template-data.model";
import cloneDeep from 'lodash/cloneDeep';
import {ErrorService} from "../../../../../utils/errorhandler/error.service";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../../enums/sale/invoice-email-payment-template-components.enum";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-invoice-items-rows-edit',
  templateUrl: './invoice-item-rows-edit.component.html',
  styleUrls: ['../../columns-drag.scss', '../items-columns-edit.scss',
    '../../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemRowsEditComponent
  extends ItemsColumnsEditComponent<InvoiceItemRowsTemplateLayoutService> {

  styles: SafeStyle;

  readonly MAX_LENGTH = {
    HEADER: 20
  };

  readonly InvoiceItemsTableColumnsEnum = InvoiceItemsTableColumnsEnum;
  readonly InvoiceItemsTableColumnsEnumValue = InvoiceItemsTableColumnsEnumValue;

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
  protected _classHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.CATEGORY_CLASS, c));
  protected _other1Header: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.OTHER_1, c));
  protected _other2Header: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableColumnsEnum.OTHER_2, c));
  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _titleColor = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorEven = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);

  protected readonly columnFields = new Map<string, ItemsColumnField>([
    [InvoiceItemsTableColumnsEnum.LINE_NUM, {control: this._lineNumHeader, property: 'lineNum'}],
    [InvoiceItemsTableColumnsEnum.ITEM, {control: this._itemHeader, property: 'name'}],
    [InvoiceItemsTableColumnsEnum.DESCRIPTION, {control: this._descriptionHeader, property: 'description'}],
    [InvoiceItemsTableColumnsEnum.QTY, {control: this._quantityHeader, property: 'quantity'}],
    [InvoiceItemsTableColumnsEnum.RATE, {control: this._rateHeader, property: 'rate'}],
    [InvoiceItemsTableColumnsEnum.AMOUNT, {control: this._amountHeader, property: 'amount'}],
    [InvoiceItemsTableColumnsEnum.TAX, {control: this._taxableHeader, property: 'taxable'}],
    [InvoiceItemsTableColumnsEnum.SKU, {control: this._skuHeader, property: 'sku'}],
    [InvoiceItemsTableColumnsEnum.SERVICE_DATE, {control: this._serviceDateHeader, property: 'serviceDate'}],
    [InvoiceItemsTableColumnsEnum.CATEGORY_CLASS, {control: this._classHeader, property: 'categoryClass'}],
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
      classHeader: this._classHeader,
      other1Header: this._other1Header,
      other2Header: this._other2Header,
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      colorEven: this._colorEven,
      colorOdd: this._colorOdd,
      titleColor: this._titleColor,
      autoColumnWidths: this._autoColumnWidths
    }
  );
  protected readonly previewData: ItemTemplateData[] = InvoiceItemsDataService.templateData.invoiceItems.slice(0, 1);

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }


  close() {
    this.activeModal.dismiss();
  }

  get activeModal() {
    return this._activeModal;
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

    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorEven.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));

    this._lineNumHeader.reset(this.viewService.lineNumHeader);
    this._itemHeader.reset(this.viewService.itemHeader);
    this._descriptionHeader.reset(this.viewService.descriptionHeader);
    this._quantityHeader.reset(this.viewService.quantityHeader);
    this._rateHeader.reset(this.viewService.rateHeader);
    this._amountHeader.reset(this.viewService.amountHeader);
    this._taxableHeader.reset(this.viewService.taxableHeader);
    this._serviceDateHeader.reset(this.viewService.serviceDateHeader);
    this._classHeader.reset(this.viewService.classHeader);
    this._skuHeader.reset(this.viewService.skuHeader);
    this._other1Header.reset(this.viewService.other1Header);
    this._other2Header.reset(this.viewService.other2Header);

    this.initColumns(cloneDeep(this.viewService.layout));

    this.updateStyles();
    this.ch.detectChanges();
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
    this.viewService.other1Header = this._other1Header.value;
    this.viewService.other2Header = this._other2Header.value;
    this.viewService.fontColor = this._fontColor.value;
    this.viewService.borderColor = this._borderColor.value;
    this.viewService.colorEven = this._colorEven.value;
    this.viewService.colorOdd = this._colorOdd.value;
    this.viewService.titleColor = this._titleColor.value;
    this.saveColumns();
    this.activeModal.close();
  }

  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                      app-invoice-email-payment-template-invoice-items-rows-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --previewFontSize: ${this.viewService.fontSize}pt;
                        --previewLineHeight: ${this.viewService.lineHeight};
                        --fontColor: ${this._fontColor.value};
                        --colorEven: ${this._colorEven.value};
                        --colorOdd: ${this._colorOdd.value};
                        --titleColor: ${this._titleColor.value};

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
                      }
                      </style>`);
    this.ch.detectChanges();
  }

  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
