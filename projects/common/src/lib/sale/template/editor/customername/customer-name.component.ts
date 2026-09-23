import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {CustomerNameViewService} from "./customer-name-view.service";
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {CustomerNameTemplateModel
} from "../../../../models/sale/template/invoice-template.model";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-customer-name',
  templateUrl: './customer-name.component.html',
  styleUrls: ['./customer-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerNameComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {
  private _template: CustomerNameTemplateModel;

  constructor(protected viewService: CustomerNameViewService,
              protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(ch);
  }

  ngOnInit() {
    this.updateStyles();
    this.viewService.settingsChanged.subscribe(
      (ids) => {
        if (ids && ids.indexOf(this.id) >= 0) {
          this.updateStyles();
        }
      }
    );
  }

  private updateStyles() {
    this._template = this.viewService.getTemplate(this.id);
    if (this._template) {
      this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                    app-invoice-email-payment-template-customer-name {
                      .${this.id} {
                        --border: ${this.viewService.getBorderFromColor(this._template.borderColor)};
                        --fontColor: ${this._template.fontColor};
                        --colorOdd: ${this._template.colorOdd};
                        --titleColor: ${this._template.titleColor};

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
                      }
                      </style>`);
      this.ch.detectChanges();
    }
  }

  get customerNameHeader(): string {
    return this._template?.customerNameHeader;
  }

  protected readonly CustomerNameViewService = CustomerNameViewService;
}
