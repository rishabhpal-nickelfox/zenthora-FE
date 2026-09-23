import {Component, OnInit} from '@angular/core';
import {ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {CustomerBillingAddressViewService} from './customer-billing-address-view.service';
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-billing-address',
    templateUrl: './customer-billing-address.component.html',
    styleUrls: ['./customer-billing-address.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerBillingAddressComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {

    readonly billingAddress = `Sasha Tillou\nFreeman Sporting Goods\n370 Easy St.\nMiddlefield, CA  94482`;

    constructor(protected viewService: CustomerBillingAddressViewService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
        super(ch);
    }

    ngOnInit() {
        this.updateStyles();
        this.viewService.settingsChanged.subscribe(
            () => {
                this.updateStyles();
                this.ch.detectChanges();
            }
        );
    }

    private updateStyles() {
        this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
 
                      app-invoice-email-payment-template-billing-address {
                        --border: ${this.viewService.border};
                        --fontColor: ${this.viewService.fontColor};
                        --colorOdd: ${this.viewService.colorOdd};
                        --titleColor: ${this.viewService.titleColor};
                        
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
    }
}
