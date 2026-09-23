import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormPageStateService} from "../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../pages/form-page.component";
import {ErrorService} from "../../../../utils/errorhandler/error.service";
import {CustomerNameViewService} from "./customer-name-view.service";
import {CustomerNameLabels} from "./customer-name-labels";
import {CustomValidator} from "../../../../helpers/custom.validator";
import {CustomerNameTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import cloneDeep from 'lodash/cloneDeep';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {TEMPLATE_EDIT_COMPONENT_ID,
  TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE
} from "../invoice-email-payment-template.component";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-customer-name-edit',
  templateUrl: './customer-name-edit.component.html',
  styleUrls: ['./customer-name.component.scss', '../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerNameEditComponent extends FormPageComponent implements OnInit {
  protected readonly Labels = CustomerNameLabels;
  readonly MAX_LENGTH = {
    HEADER: 30
  };
  protected styles: SafeStyle;
  protected _customerNameHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);
  protected _titleColor = new FormControl<string>(null);

  private _form: FormGroup = new FormGroup({
      titleColor: this._titleColor,
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      colorOdd: this._colorOdd
    }
  );
  private _template: CustomerNameTemplateModel;

  constructor(@Inject(TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE) private _viewService: CustomerNameViewService,
              @Inject(TEMPLATE_EDIT_COMPONENT_ID) private _customerNameId: string, public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }

  public get viewService(): CustomerNameViewService {
    return this._viewService;
  }

  public set viewService(value: CustomerNameViewService) {
    this._viewService = value;
  }

  ngOnInit() {
    this.reInit();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  public get customerNameId(): string {
    return this._customerNameId;
  }

  protected onReInit() {
    this._template = cloneDeep(this.viewService.getTemplate(this.customerNameId));
    this._fontColor.reset(this._template.fontColor);
    this._borderColor.reset(this._template.borderColor);
    this._colorOdd.reset(this._template.colorOdd);
    this._titleColor.reset(this._template.titleColor);
    this._customerNameHeader.reset(this._template.customerNameHeader);

    this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));

    this.updateStyles();
  }

  close() {
    this.activeModal.dismiss();
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.updateTemplate(this._template.id, this._fontColor.value, this._borderColor.value, this._colorOdd.value, this._titleColor.value, this._customerNameHeader.value);
    this.activeModal.close();
    this.activeModal.close();
  }


  get activeModal() {
    return this._activeModal;
  }


  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                         app-invoice-email-payment-template-customer-name-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorOdd: ${this._colorOdd.value};
                        --titleColor:  ${this._titleColor.value};

                            .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
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

                      }
                      </style>`);
    this.ch.detectChanges();
  }

  protected readonly CustomerNameViewService = CustomerNameViewService;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
