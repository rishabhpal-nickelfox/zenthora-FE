import {EventEmitter, Injectable, Output} from '@angular/core';
import {
  InvoiceEmailPaymentTemplateLogoSizeEnum
} from "../../../../enums/sale/invoice-email-payment-template-logo-size.enum";

@Injectable()
export class LogoViewService {
    @Output() logoChanged: EventEmitter<void> = new EventEmitter<void>();


    private _logo: { type: string, value: string };
    private _logoSize: InvoiceEmailPaymentTemplateLogoSizeEnum;

    initTemplate(logo: { type: string, value: string }, logoSize: InvoiceEmailPaymentTemplateLogoSizeEnum) {
        this._logo = logo;
        this._logoSize = logoSize;
        this.logoChanged.emit();
    }


    get logoSize(): InvoiceEmailPaymentTemplateLogoSizeEnum {
        return this._logoSize;
    }

    set logoSize(value: InvoiceEmailPaymentTemplateLogoSizeEnum) {
        this._logoSize = value;
        this.logoChanged.emit();
    }

    get logo() {
        return this._logo;
    }

    set logo(value: { type: string, value: string }) {
        this._logo = value;
        this.logoChanged.emit();
    }
}
