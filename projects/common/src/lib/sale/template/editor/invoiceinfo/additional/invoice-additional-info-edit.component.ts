import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {InvoiceAdditionalInfoLayoutService} from './invoice-additional-info-layout.service';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InvoiceAdditionalInfoLabels} from './invoice-additional-info-labels';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormPageStateService} from "../../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../../pages/form-page.component";
import {CustomValidator} from "../../../../../helpers/custom.validator";
import {ErrorService} from "../../../../../utils/errorhandler/error.service";
import {SaleAdditionalAdvancedColumns,
  SaleAdditionalInfoColumnsEnum,
  SaleAdditionalInfoColumnsEnumValue
} from "../../../../../enums/sale/sale-additional-info-columns.enum";
import {GridAreaModel,
  InvoiceAdditionalInfoTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {GridColumnsHelper} from "../../../../../helpers/grid-columns.helper";
import cloneDeep from 'lodash/cloneDeep';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../../enums/sale/invoice-email-payment-template-components.enum";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {TEMPLATE_EDIT_COMPONENT_ID,
  TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE
} from "../../invoice-email-payment-template.component";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-invoice-additional-info-edit',
  templateUrl: './invoice-additional-info-edit.component.html',
  styleUrls: ['../../columns-drag.scss', './invoice-additional-info-edit.component.scss',
    '../../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceAdditionalInfoEditComponent extends FormPageComponent implements OnInit {
  protected styles: SafeStyle;
  layout: GridAreaModel[] = [];
  readonly MAX_LENGTH = {
    HEADER: 20
  };

  readonly Labels = InvoiceAdditionalInfoLabels;

  protected _dueDateHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _termsHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _salesRepHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _shipDateHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _shipMethodHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _fobHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _trackingNumberHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _poNumberHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _otherHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);
  protected _titleColor: FormControl<string> = new FormControl<string>(null);

  private _form: FormGroup = new FormGroup({
      dueDateHeader: this._dueDateHeader,
      termsHeader: this._termsHeader,
      salesRepHeader: this._salesRepHeader,
      shipDateHeader: this._shipDateHeader,
      shipMethodHeader: this._shipMethodHeader,
      fobHeader: this._fobHeader,
      trackingNumberHeader: this._trackingNumberHeader,
      poNumberHeader: this._poNumberHeader,
      otherHeader: this._otherHeader,
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      titleColor: this._titleColor,
      colorOdd: this._colorOdd
    }
  );

  constructor(@Inject(TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE) private _viewService: InvoiceAdditionalInfoLayoutService,
              @Inject(TEMPLATE_EDIT_COMPONENT_ID) private _additionalInfoId: string,
              public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }

  private _template: InvoiceAdditionalInfoTemplateModel;

  get viewService(): InvoiceAdditionalInfoLayoutService {
    return this._viewService;
  }

  set viewService(value: InvoiceAdditionalInfoLayoutService) {
    this._viewService = value;
  }

  get additionalInfoId(): string {
    return this._additionalInfoId;
  }

  ngOnInit() {
    this.reInit();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  protected onReInit() {
    this._template = this.viewService.getTemplate(this.additionalInfoId);

    this._fontColor.reset(this._template.fontColor);
    this._borderColor.reset(this._template.borderColor);
    this._titleColor.reset(this._template.titleColor);
    this._colorOdd.reset(this._template.colorOdd);

    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));

    this._dueDateHeader.reset(this._template.dueDateHeader);
    this._termsHeader.reset(this._template.termsHeader);
    this._salesRepHeader.reset(this._template.salesRepHeader);
    this._shipDateHeader.reset(this._template.shipDateHeader);
    this._shipMethodHeader.reset(this._template.shipMethodHeader);
    this._fobHeader.reset(this._template.fobHeader);
    this._trackingNumberHeader.reset(this._template.trackingNumberHeader);
    this._poNumberHeader.reset(this._template.poNumberHeader);
    this._otherHeader.reset(this._template.otherHeader);
    this.layout = cloneDeep(this._template.additionalInfo ?? []);

    this.updateStyles();
    this.ch.detectChanges();
  }

  close() {
    this.activeModal.dismiss();
  }

  protected onSubmit({value}: { value: any }) {
    const template = this.viewService.getTemplate(this.additionalInfoId);
    const newTemplate: InvoiceAdditionalInfoTemplateModel = {
      id: template.id,
      dueDateHeader: this._dueDateHeader.value,
      termsHeader: this._termsHeader.value,
      salesRepHeader: this._salesRepHeader.value,
      shipDateHeader: this._shipDateHeader.value,
      shipMethodHeader: this._shipMethodHeader.value,
      fobHeader: this._fobHeader.value,
      trackingNumberHeader: this._trackingNumberHeader.value,
      poNumberHeader: this._poNumberHeader.value,
      otherHeader: this._otherHeader.value,
      fontColor: this._fontColor.value,
      colorOdd: this._colorOdd.value,
      borderColor: this._borderColor.value,
      titleColor: this._titleColor.value,
      colorEven: template.colorEven,
      additionalInfo: this.layout
    };

    this.viewService.updateTemplate(this.additionalInfoId, newTemplate);
    this.activeModal.close();
  }


  get activeModal() {
    return this._activeModal;
  }


  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>

                      app-invoice-email-payment-template-invoice-additional-info-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorOdd: ${this._colorOdd.value};
                        --titleColor: ${this._titleColor.value};

                        table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        td, th {
                          border-bottom: var(--border);
                          border-right: var(--border);
                        }

                        th {
                            background: var(--titleColor);
                        }

                        td {
                            background: var(--colorOdd);
                        }

                      }
                      </style>`);
    this.ch.detectChanges();
  }

  protected onColumnDrop(event: CdkDragDrop<GridAreaModel[]>): void {
    if (GridColumnsHelper.reorder(this.layout, event.previousIndex, event.currentIndex)) {
      this.ch.detectChanges();
    }
  }

  deleteColumn(key: string): void {
    this.viewService.deleteItem(this.layout, key);
    this._form.updateValueAndValidity();
  }

  addColumn(key: string): void {
    this.viewService.addItem(this.layout, key);
    this._form.updateValueAndValidity();
  }

  canAddColumn(key: string) {
    return !this.viewService.wasAdded(this.layout, key) && (this.viewService.advancedFieldsEnabled || SaleAdditionalAdvancedColumns.indexOf(SaleAdditionalInfoColumnsEnum[key]) < 0);
  }

  protected readonly SaleAdditionalInfoColumnsEnum = SaleAdditionalInfoColumnsEnum;
  protected readonly SaleAdditionalInfoColumnsEnumValue = SaleAdditionalInfoColumnsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
