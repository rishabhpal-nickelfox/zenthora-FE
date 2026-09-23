import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerShippingAddressLabels} from './customer-shipping-address-labels';
import {ShippingAddressViewService} from './shipping-address-view.service';
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
    selector: 'app-invoice-email-payment-template-shipping-address-edit',
    templateUrl: './customer-shipping-address-edit.component.html',
    styleUrls: ['./customer-shipping-address-edit.component.scss', '../../../../../modals/external-modal.scss'],
    providers: [FormPageStateService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerShippingAddressEditComponent extends FormPageComponent implements OnInit {

    readonly shippingAddress = `Sasha Tillou\nFreeman Sporting Goods\n370 Easy St.\nMiddlefield, CA  94482`;

    protected styles: SafeStyle;

    readonly MAX_LENGTH = {
        HEADER: 20
    };

    readonly Labels = CustomerShippingAddressLabels;

    protected _addressHeader: FormControl<string> = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Header)(c), c => CustomValidator.maxLength(this.Labels.Header, this.MAX_LENGTH.HEADER)(c)]));
    protected _borderColor: FormControl<string> = new FormControl<string>(null);
    protected _fontColor = new FormControl<string>(null);
    protected _colorOdd = new FormControl<string>(null);
    protected _titleColor: FormControl<string> = new FormControl<string>(null);
    protected _form = new FormGroup({
            addressHeader: this._addressHeader,
            fontColor: this._fontColor,
            borderColor: this._borderColor,
            titleColor: this._titleColor,
            colorOdd: this._colorOdd
        }
    );
    constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
        super(formPageStateService, elementRef, errorService);
    }

    private _viewService: ShippingAddressViewService;

    public get viewService(): ShippingAddressViewService {
        return this._viewService;
    }

    public set viewService(value: ShippingAddressViewService) {
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
        this._titleColor.reset(this.viewService.titleColor);
        this._colorOdd.reset(this.viewService.colorOdd);

        this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
        this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
        this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));
        this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));

        this.updateStyles();

        this._addressHeader.reset(this.viewService.addressHeader);
        this.ch.detectChanges();
    }

    close() {
        this.activeModal.dismiss();
    }

    protected onSubmit({value}: { value: any }) {
        this.viewService.addressHeader = this._addressHeader.value;
        this.viewService.fontColor = this._fontColor.value;
        this.viewService.colorOdd = this._colorOdd.value;
        this.viewService.borderColor = this._borderColor.value;
        this.viewService.titleColor = this._titleColor.value;
        this.activeModal.close();
    }


    get activeModal() {
        return this._activeModal;
    }


    private updateStyles() {
        this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                         app-invoice-email-payment-template-shipping-address-edit {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorOdd: ${this._colorOdd.value};
                        --titleColor: ${this._titleColor.value};

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        .td, .th {
                          border-bottom: var(--border);
                          border-right: var(--border);
                        }

                        .th {
                            background: var(--titleColor);
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
