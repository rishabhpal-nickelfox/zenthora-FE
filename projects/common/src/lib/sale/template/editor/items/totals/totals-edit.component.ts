import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SafeStyle} from '@angular/platform-browser';
import {InvoiceItemsLabels} from '../invoice-items-labels';
import cloneDeep from 'lodash/cloneDeep';
import {TotalsViewService} from './totals-view.service';
import {InvoiceItemsDataService} from '../invoice-items-data.service';
import {FormPageStateService} from "../../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../../pages/form-page.component";
import {InvoiceItemsTableTotalsEnum,
  InvoiceItemsTableTotalsEnumValue, InvoiceItemsTableTotalsOrdered
} from "../../../../../enums/sale/invoice-items-table-totals.enum";
import {CustomValidator} from "../../../../../helpers/custom.validator";
import {ErrorService} from "../../../../../utils/errorhandler/error.service";
import {ObjectHelper} from "../../../../../helpers/object.helper";
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../../enums/sale/invoice-email-payment-template-components.enum";
import {reportUnhandledError} from "rxjs/internal/util/reportUnhandledError";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-totals-edit',
  templateUrl: './totals-edit.component.html',
  styleUrls: ['./totals.component.scss', '../../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsEditComponent extends FormPageComponent implements OnInit {

  styles: SafeStyle;

  readonly MAX_LENGTH = {
    HEADER: 20
  };

  readonly InvoiceItemsTableTotalsEnum = InvoiceItemsTableTotalsEnum;
  readonly InvoiceItemsTableTotalsEnumValue = InvoiceItemsTableTotalsEnumValue;

  private _viewService: TotalsViewService;

  readonly Labels = InvoiceItemsLabels;

  headerValidation = (key, control) => {
    if (this.viewService && this.isTotalRowPresented(key)) {
      return Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)])(control);
    }
    return null;
  };

  protected _subtotalHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.SUBTOTAL, c));
  protected _taxHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.TAX, c));
  protected _discountHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.DISCOUNT, c));
  protected _shippingCostHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.SHIPPING_COST, c));
  protected _appliedAmountHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT, c));
  protected _amountDueHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.AMOUNT_DUE, c));
  protected _totalHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.TOTAL, c));
  protected _tipHeader: FormControl<string> = new FormControl<string>(null, c => this.headerValidation(InvoiceItemsTableTotalsEnum.TIP, c));
  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorEven = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);

  private readonly headersControlsMap = new Map<InvoiceItemsTableTotalsEnum, FormControl<string>>([
    [InvoiceItemsTableTotalsEnum.SUBTOTAL, this._subtotalHeader],
    [InvoiceItemsTableTotalsEnum.TAX, this._taxHeader],
    [InvoiceItemsTableTotalsEnum.DISCOUNT, this._discountHeader],
    [InvoiceItemsTableTotalsEnum.SHIPPING_COST, this._shippingCostHeader],
    [InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT, this._appliedAmountHeader],
    [InvoiceItemsTableTotalsEnum.AMOUNT_DUE, this._amountDueHeader],
    [InvoiceItemsTableTotalsEnum.TOTAL, this._totalHeader],
    [InvoiceItemsTableTotalsEnum.TIP, this._tipHeader],
  ]);



  private _form: FormGroup = new FormGroup({
      subtotalHeader: this._subtotalHeader,
      taxHeader: this._taxHeader,
      discountHeader: this._discountHeader,
      shippingCostHeader: this._shippingCostHeader,
      appliedAmountHeader: this._appliedAmountHeader,
      amountDueHeader: this._amountDueHeader,
      totalHeader: this._totalHeader,
      tipHeader: this._tipHeader,
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      colorEven: this._colorEven,
      colorOdd: this._colorOdd
    }
  );
  private totals: InvoiceItemsTableTotalsEnum[] = [];
  private styleControlsValuesMap: Map<FormControl, string>;
  private headerControlsValuesMap: Map<InvoiceItemsTableTotalsEnum, string>;

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }


  ngOnInit(): void {
  }

  close() {
    this.activeModal.dismiss();
  }

  get activeModal() {
    return this._activeModal;
  }


  enumKeys(e) {
    return Object.keys(e);
  }

  addTotalRow(column: string): void {
    this.totals.push(InvoiceItemsTableTotalsEnum[column]);
  }

  canAddTotalRow(row: string): boolean {
    return !this.isTotalRowPresented(row);
  }

  deleteTotalRow(column: string) {
    this.totals = this.totals.filter(c => c != column);
    this._form.updateValueAndValidity();
  }

  isTotalRowPresented(row: string): boolean {
    return ObjectHelper.isDefined(this.totals.find(c => c == row));
  }

  get viewService(): TotalsViewService {
    return this._viewService;
  }

  set viewService(value: TotalsViewService) {
    this._viewService = value;

  this.headerControlsValuesMap = new Map<InvoiceItemsTableTotalsEnum, string>([
      [InvoiceItemsTableTotalsEnum.SUBTOTAL, this.viewService.subtotalHeader],
      [InvoiceItemsTableTotalsEnum.TAX, this.viewService.taxHeader],
      [InvoiceItemsTableTotalsEnum.DISCOUNT, this.viewService.discountHeader],
      [InvoiceItemsTableTotalsEnum.SHIPPING_COST, this.viewService.shippingCostHeader],
      [InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT, this.viewService.appliedAmountHeader],
      [InvoiceItemsTableTotalsEnum.AMOUNT_DUE, this.viewService.amountDueHeader],
      [InvoiceItemsTableTotalsEnum.TOTAL, this.viewService.totalHeader],
      [InvoiceItemsTableTotalsEnum.TIP, this.viewService.tipHeader],
    ]);

    this.styleControlsValuesMap = new Map<FormControl, string>([
      [this._fontColor, this.viewService.fontColor],
      [this._borderColor, this.viewService.borderColor],
      [this._colorEven, this.viewService.colorEven],
      [this._colorOdd, this.viewService.colorOdd],
    ])

    this.reInit();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  protected onReInit() {
    this.styleControlsValuesMap.forEach((value, control) => {
      control.reset(value);
      this.subscriptions.add(control.valueChanges.subscribe(() => this.updateStyles()));
    })

    this.headersControlsMap.forEach((control, enumKey) => {
      const controlValue = this.headerControlsValuesMap.get(enumKey) ?? InvoiceItemsTableTotalsEnumValue.get(enumKey);
      control.reset(controlValue);
    });
    this.totals = cloneDeep(this.viewService.totals);

    this.updateStyles();
    this.ch.detectChanges();
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.subtotalHeader = this._subtotalHeader.value;
    this.viewService.taxHeader = this._taxHeader.value;
    this.viewService.discountHeader = this._discountHeader.value;
    this.viewService.appliedAmountHeader = this._appliedAmountHeader.value;
    this.viewService.amountDueHeader = this._amountDueHeader.value;
    this.viewService.totalHeader = this._totalHeader.value;
    this.viewService.tipHeader = this._tipHeader.value;
    this.viewService.fontColor = this._fontColor.value;
    this.viewService.borderColor = this._borderColor.value;
    this.viewService.colorEven = this._colorEven.value;
    this.viewService.colorOdd = this._colorOdd.value;
    this.viewService.totals = this.totals;
    this.activeModal.close();
  }

  getFormControl(enumKey: InvoiceItemsTableTotalsEnum): FormControl{
    return this.headersControlsMap.get(enumKey);
  }

  get orderedTotals(){
    return [...(this.totals ?? [])].sort((a, b) =>
      InvoiceItemsTableTotalsOrdered.indexOf(a) - InvoiceItemsTableTotalsOrdered.indexOf(b)
    );
  }

  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                     app-invoice-email-payment-template-totals-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorEven: ${this._colorEven.value};
                        --colorOdd: ${this._colorOdd.value};

                        .table {
                          border-top: var(--border) !important;
                          border-left: var(--border) !important;
                          color: var(--fontColor)
                        }

                        .td {
                          border-bottom: var(--border) !important;
                          border-right: var(--border) !important;
                        }


                        .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                        }

                        .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                        }

                      }
                      </style>`);
  }


  protected readonly TotalsViewService = TotalsViewService;
  protected readonly InvoiceItemsDataService = InvoiceItemsDataService;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
