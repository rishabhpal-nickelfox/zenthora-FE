import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../../invoice-email-template-abstract.component';
import {ShippingInfoViewService} from './shipping-info-view.service';
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-shipping-info',
    templateUrl: './shipping-info.component.html',
    styleUrls: ['./shipping-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShippingInfoComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {

    constructor(protected viewService: ShippingInfoViewService,
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
 
                      app-invoice-email-payment-template-shipping-info {
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
    this.ch.detectChanges();
  }

}
