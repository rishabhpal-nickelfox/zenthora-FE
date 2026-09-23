import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {CustomerMemoViewService} from './customer-memo-view.service';
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-customer-memo',
    templateUrl: './customer-memo.component.html',
    styleUrls: ['./customer-memo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerMemoComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {

    constructor(protected viewService: CustomerMemoViewService,
                protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
        super(ch);
    }

    ngOnInit() {
        this.updateStyles();
        this.viewService.settingsChanged.subscribe(
            () => {
                this.updateStyles();
            }
        );
    }

    private updateStyles() {
        this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
 
                      app-invoice-email-payment-template-customer-memo {
                        --border: ${this.viewService.border};
                        --fontColor: ${this.viewService.fontColor};
                        --colorOdd: ${this.viewService.colorOdd};
                        
                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }
                    
                        .td{
                          border-bottom: var(--border);
                          border-right: var(--border);
                           background: var(--colorOdd);
                        }
                      }
                      </style>`);
        this.ch.detectChanges();
    }
}
