import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {LogoViewService} from './logo-view.service';
import {
  InvoiceEmailPaymentTemplateLogoSizeEnum,
  getInvoiceEmailPaymentTemplateLogoWidth
} from "../../../../enums/sale/invoice-email-payment-template-logo-size.enum";

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-company-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {

    private _logo: { type: string, value: string };
    private _logoSize: InvoiceEmailPaymentTemplateLogoSizeEnum;

    constructor(private viewService: LogoViewService, private sanitizer: DomSanitizer, protected ch: ChangeDetectorRef) {
        super(ch);
    }

    ngOnInit() {
        this.logo = this.viewService.logo;
        this.logoSize = this.viewService.logoSize;

        this.viewService.logoChanged.subscribe(() => {
            this.logo = this.viewService.logo;
            this.logoSize = this.viewService.logoSize;
            this.ch.detectChanges();
        });
    }

    get url() {
        return this.sanitizer.bypassSecurityTrustResourceUrl('data:' + this.logo.type + ';base64,' + this.logo.value);
    }

    get logoWidth(): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(getInvoiceEmailPaymentTemplateLogoWidth(this.logoSize));
    }

    get logoSize(): InvoiceEmailPaymentTemplateLogoSizeEnum {
        return this._logoSize;
    }

    set logoSize(value: InvoiceEmailPaymentTemplateLogoSizeEnum) {
        this._logoSize = value;
    }

    get logo(): { type: string; value: string } {
        return this._logo;
    }

    set logo(value: { type: string; value: string }) {
        this._logo = value;
    }


}
