import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CompanyInfoLabels} from './company-info-labels';
import {CompanyInfoViewService} from './company-info-view.service';
import {FormPageStateService} from '../../../../utils/form-page-state.service';
import {FormPageComponent} from '../../../../pages/form-page.component';
import {CompanyInfoRowsEnum,
  CompanyInfoRowsEnumValue
} from '../../../../enums/sale/company-info-rows.enum';
import {ObjectHelper} from '../../../../helpers/object.helper';
import {CustomValidator} from '../../../../helpers/custom.validator';
import {ErrorService} from '../../../../utils/errorhandler/error.service';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from '../../../../enums/sale/invoice-email-payment-template-components.enum';
import {replacePlaceholders} from '../../../../helpers/string.helper';
import {InvoiceEmailTemplateViewCommonService} from '../invoice-email-template-view-common.service';
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {TEMPLATE_EDIT_COMPONENT_ID,
  TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE
} from "../invoice-email-payment-template.component";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-company-info-edit',
  templateUrl: './company-info-edit.component.html',
  styleUrls: ['./company-info-edit.component.scss', '../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoEditComponent extends FormPageComponent implements OnInit {
  protected styles: SafeStyle;

  readonly MAX_LENGTH = {HEADER: 100};
  readonly Labels = CompanyInfoLabels;

  protected _companyInfoHeader = new FormControl<string>(
    null, Validators.compose([
      c => CustomValidator.required(this.Labels.Header)(c),
      c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c),
    ]));
  protected _hideHeader = new FormControl<boolean>(false);
  protected _borderColor = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);
  protected _titleColor = new FormControl<string>(null);

  private _form = new FormGroup({
    companyInfoHeader: this._companyInfoHeader,
    hideHeader: this._hideHeader,
    fontColor: this._fontColor,
    borderColor: this._borderColor,
    titleColor: this._titleColor,
    colorOdd: this._colorOdd
  });

  private _companyInfoRows: CompanyInfoRowsEnum[];

  constructor(@Inject(TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE) private _viewService: CompanyInfoViewService,
    @Inject(TEMPLATE_EDIT_COMPONENT_ID) private _companyInfoId: string,
    public formPageStateService: FormPageStateService,
    protected elementRef: ElementRef,
    public errorService: ErrorService,
    private _activeModal: NgbActiveModal,
    protected ch: ChangeDetectorRef,
    private readonly htmlSanitizer: HtmlSanitizerService
  ) {
    super(formPageStateService, elementRef, errorService);
  }

  public get viewService(): CompanyInfoViewService {
    return this._viewService;
  }

  public set viewService(value: CompanyInfoViewService) {
    this._viewService = value;
  }

  get companyInfoId(): string{
    return this._companyInfoId;
  }

  ngOnInit() {
    this.reInit();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  protected onReInit() {
    const companyInfoTemplate = this.viewService.getTemplate(this.companyInfoId);

    this._fontColor.reset(companyInfoTemplate.fontColor);
    this._borderColor.reset(companyInfoTemplate.borderColor);
    this._titleColor.reset(companyInfoTemplate.titleColor);
    this._colorOdd.reset(companyInfoTemplate.colorOdd);

    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));
    this.updateStyles();

    this._hideHeader.reset(companyInfoTemplate.hideHeader, {emitEvent: false});
    this.subscriptions.add(this._hideHeader.valueChanges.subscribe(value => {
      value ? this._companyInfoHeader.disable() : this._companyInfoHeader.enable();
    }));
    this._companyInfoHeader.reset({value: this.viewService.getDisplayedHeader(this.companyInfoId), disabled: this._hideHeader.value});
    this._companyInfoHeader.markAsDirty();
    this._companyInfoHeader.updateValueAndValidity();
    this._companyInfoRows = [...(companyInfoTemplate.companyInfoRows ?? [])];

    this.ch.detectChanges();
  }

  close() {
    this.activeModal.dismiss();
  }

  get activeModal() {
    return this._activeModal;
  }

  protected onSubmit({value}: { value: any }) {
    const companyInfoHeader = this.viewService.displayName
      ? replacePlaceholders(this._companyInfoHeader.value, new Map<string, string>([
        [this.viewService.displayName, InvoiceEmailTemplateViewCommonService.COMPANY_DISPLAY_NAME_PLACEHOLDER]
      ]))
      : this._companyInfoHeader.value;

    const template = this.viewService.getTemplate(this.companyInfoId);
    const newTemplate = {
      id: template.id,
      companyInfoHeader: companyInfoHeader,
      hideHeader: this._hideHeader.value,
      fontColor: this._fontColor.value,
      colorOdd: this._colorOdd.value,
      colorEven: template.colorEven,
      borderColor: this._borderColor.value,
      titleColor: this._titleColor.value,
      companyInfoRows: [...this._companyInfoRows]
    };

    this.viewService.updateTemplate(this.companyInfoId, newTemplate);
    this.activeModal.close();
  }

  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
      <style>
        app-invoice-email-payment-template-company-info-edit {
          --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
          --fontColor: ${this._fontColor.value};
          --colorOdd: ${this._colorOdd.value};
          --titleColor: ${this._titleColor.value};

          .table { border-top: var(--border); border-left: var(--border); color: var(--fontColor) }
          .td, .th { border-bottom: var(--border); border-right: var(--border); }
          .th { background: var(--titleColor); }
          .td { background: var(--colorOdd); }
        }
      </style>
    `);
    this.ch.detectChanges();
  }

  protected readonly CompanyInfoRowsEnum = CompanyInfoRowsEnum;

  addRow(column: string): void {
    this._companyInfoRows.push(CompanyInfoRowsEnum[column]);
  }

  canAddRow(column: string): boolean {
    return !this.isPresented(column);
  }

  deleteRow(column: string) {
    this._companyInfoRows = this._companyInfoRows.filter(c => c != column);
  }

  isPresented(column: string): boolean {
    return CompanyInfoViewService.isPresented(this._companyInfoRows, column);
  }

  isAnyPresented(columns: string[]): boolean {
    return ObjectHelper.isDefined(columns.find(column => this.isPresented(column)));
  }

  protected readonly CompanyInfoRowsEnumValue = CompanyInfoRowsEnumValue;
  protected readonly ObjectHelper = ObjectHelper;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
