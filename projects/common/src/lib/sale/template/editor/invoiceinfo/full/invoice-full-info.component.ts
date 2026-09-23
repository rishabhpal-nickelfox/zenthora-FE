import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../../invoice-email-template-abstract.component';
import {InvoiceFullInfoViewService} from './invoice-full-info-view.service';
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-invoice-full-info',
    templateUrl: './invoice-full-info.component.html',
    styleUrls: ['./invoice-full-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceFullInfoComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {

    constructor(protected viewService: InvoiceFullInfoViewService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
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
 
                      app-invoice-email-payment-template-invoice-full-info {
                        --border: ${this.viewService.border};
                        --fontColor: ${this.viewService.fontColor};
                        --colorEven: ${this.viewService.colorEven};
                        --colorOdd: ${this.viewService.colorOdd};
                        
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
                        
                        .td > strong{
                            float: right;
                        }
 
                      }
                      </style>`);
        this.ch.detectChanges();
    }

}
