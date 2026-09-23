import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {InvoiceFullInfoViewService} from './invoice-full-info-view.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InvoiceFullInfoLabels} from './invoice-full-info-labels';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormPageStateService} from "../../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../../pages/form-page.component";
import {ErrorService} from "../../../../../utils/errorhandler/error.service";
import {CustomValidator} from "../../../../../helpers/custom.validator";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../../enums/sale/invoice-email-payment-template-components.enum";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-invoice-full-info-edit',
  templateUrl: './invoice-full-info-edit.component.html',
  styleUrls: ['./invoice-full-info-edit.component.scss', '../../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFullInfoEditComponent extends FormPageComponent implements OnInit {
  protected styles: SafeStyle;

  readonly MAX_LENGTH = {
    HEADER: 20
  };

  readonly Labels = InvoiceFullInfoLabels;

  protected _saleHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _dateHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _dueDateHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _termsHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorEven = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);
  private _form: FormGroup = new FormGroup({
      saleHeader: this._saleHeader,
      dateHeader: this._dateHeader,
      dueDateHeader: this._dueDateHeader,
      termsHeader: this._termsHeader,
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      colorEven: this._colorEven,
      colorOdd: this._colorOdd
    }
  );

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }

  private _viewService: InvoiceFullInfoViewService;

  public get viewService(): InvoiceFullInfoViewService {
    return this._viewService;
  }

  public set viewService(value: InvoiceFullInfoViewService) {
    this._viewService = value;
    this.reInit();
  }


  ngOnInit() {
  }

  public getForm(): FormGroup {
    return this._form;
  }

  protected onReInit() {
    this._fontColor.reset(this.viewService.fontColor);
    this._borderColor.reset(this.viewService.borderColor);
    this._colorEven.reset(this.viewService.colorEven);
    this._colorOdd.reset(this.viewService.colorOdd);

    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorEven.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));

    this.updateStyles();

    this._saleHeader.reset(this.viewService.saleHeaderDisplayed);
    this._dateHeader.reset(this.viewService.dateHeader);
    this._dueDateHeader.reset(this.viewService.dueDateHeader);
    this._termsHeader.reset(this.viewService.termsHeader);
  }


  close() {
    this.activeModal.dismiss();
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.saleHeader = this._saleHeader.value;
    this.viewService.dateHeader = this._dateHeader.value;
    this.viewService.dueDateHeader = this._dueDateHeader.value;
    this.viewService.termsHeader = this._termsHeader.value;
    this.viewService.fontColor = this._fontColor.value;
    this.viewService.colorEven = this._colorEven.value;
    this.viewService.colorOdd = this._colorOdd.value;
    this.viewService.borderColor = this._borderColor.value;
    this.activeModal.close();
  }


  get activeModal() {
    return this._activeModal;
  }


  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>

                      app-invoice-email-payment-template-invoice-full-info-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorEven: ${this._colorEven.value};
                        --colorOdd: ${this._colorOdd.value};

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        .td, .th {
                          border-bottom: var(--border);
                          border-right: var(--border);
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
  }

  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
