import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {LineViewService} from './line-view.service';
import {LineLabels} from './line-labels';
import {FormPageStateService} from "../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../pages/form-page.component";
import {InvoiceEmailPaymentLineStyleEnum,
  InvoiceEmailPaymentLineStyleEnumValue
} from '../../../../enums/sale/invoice-email-payment-line-style.enum';
import {ErrorService} from "../../../../utils/errorhandler/error.service";
import {CustomValidator} from "../../../../helpers/custom.validator";
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {TEMPLATE_EDIT_COMPONENT_ID,
  TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE
} from "../invoice-email-payment-template.component";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-line-edit',
  templateUrl: './line-edit.component.html',
  styleUrls: ['./line-edit.component.scss', '../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineEditComponent extends FormPageComponent implements OnInit {

  readonly Labels = LineLabels;
  styles: SafeStyle;
  protected _color = new FormControl<string>(null, c => CustomValidator.required(this.Labels.Color)(c));
  protected _width = new FormControl<number>(null, Validators.compose([c => CustomValidator.required(this.Labels.Width)(c), c => CustomValidator.max(this.Labels.Width, 99)(c)]));
  protected _style = new FormControl<InvoiceEmailPaymentLineStyleEnum>(null, c => CustomValidator.required(this.Labels.Style)(c));

  private _form = new FormGroup({
      color: this._color,
      width: this._width,
      style: this._style
    }
  );

  constructor(@Inject(TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE) private _viewService: LineViewService,
              @Inject(TEMPLATE_EDIT_COMPONENT_ID) private _lineId: string,
              public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }

  public get lineId(): string {
    return this._lineId;
  }

  public get viewService(): LineViewService {
    return this._viewService;
  }

  public set viewService(value: LineViewService) {
    this._viewService = value;
  }

  ngOnInit() {
    this.reInit();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  protected onReInit() {
    const template = this.viewService.getTemplate(this.lineId);
    this._color.reset(template.color);
    this._width.reset(template.width);
    this._style.reset(template.style);
    this.subscriptions.add(this._color.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._width.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._style.valueChanges.subscribe(() => this.updateStyles()));
    this.updateStyles();
    this.ch.detectChanges();
  }

  close() {
    this.activeModal.dismiss();
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.updateTemplate(this.lineId, this._color.value, this._width.value, this._style.value);
    this.activeModal.close();
  }


  get activeModal() {
    return this._activeModal;
  }


  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                        app-invoice-email-payment-template-line-edit {

                        .line {
                          width: 100%;
                          height: 5px;
                          border-top: ${LineViewService.getLineCss(this._color.value, this._width.value, this._style.value)};
                          line-height: 80%;
                        }

                      }
                      </style>`);
    this.ch.detectChanges();
  }

  protected readonly InvoiceEmailPaymentLineStyleEnum = InvoiceEmailPaymentLineStyleEnum;
  protected readonly InvoiceEmailPaymentLineStyleEnumValue = InvoiceEmailPaymentLineStyleEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
