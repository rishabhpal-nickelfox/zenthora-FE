import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerMemoViewService} from './customer-memo-view.service';
import {FormPageStateService} from "../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../pages/form-page.component";
import {ErrorService} from "../../../../utils/errorhandler/error.service";
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-customer-memo-edit',
    templateUrl: './customer-memo-edit.component.html',
    styleUrls: ['./customer-memo.component.scss', '../../../../modals/external-modal.scss'],
    providers: [FormPageStateService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerMemoEditComponent extends FormPageComponent implements OnInit {


    protected styles: SafeStyle;

    protected _borderColor: FormControl<string> = new FormControl<string>(null);
    protected _fontColor = new FormControl<string>(null);
    protected _colorOdd = new FormControl<string>(null);

    private _form: FormGroup= new FormGroup({
            fontColor: this._fontColor,
            borderColor: this._borderColor,
            colorOdd: this._colorOdd
        }
    );

    constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
        super(formPageStateService, elementRef, errorService);
    }

    private _viewService: CustomerMemoViewService;

    public get viewService(): CustomerMemoViewService {
        return this._viewService;
    }

    public set viewService(value: CustomerMemoViewService) {
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
        this._colorOdd.reset(this.viewService.colorOdd);

        this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
        this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
        this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));

        this.updateStyles();
    }

    close() {
        this.activeModal.dismiss();
    }

    protected onSubmit({value}: { value: any }) {
        this.viewService.fontColor = this._fontColor.value;
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
                         app-invoice-email-payment-template-customer-memo-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorOdd: ${this._colorOdd.value};

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        .td {
                          border-bottom: var(--border);
                          border-right: var(--border);
                        }

                        .td {
                            background: var(--colorOdd);
                        }


                      }
                      </style>`);
        this.ch.detectChanges();
    }

  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
