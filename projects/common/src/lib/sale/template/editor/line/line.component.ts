import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {LineViewService} from './line-view.service';
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {LineTemplateModel
} from "../../../../models/sale/template/invoice-template.model";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {
  private _template: LineTemplateModel;

  constructor(protected viewService: LineViewService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
    super(ch);
  }

  public ngOnInit(): void {
    this.updateStyles();
    this.viewService.settingsChanged.subscribe(ids => {
      if (ids.indexOf(this.id) >= 0) {
        this.updateStyles();
      }
    });
  }


  private updateStyles() {
    this._template = this.viewService.getTemplate(this.id);
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                        app-invoice-email-payment-template-line {
                        .line {
                          position: relative;
                          height: 12px;
                          width: 100%;
                        }
                         .line${this.id}::before {
                          content: "";
                          position: absolute;
                          left: 0;
                          right: 0;
                          top: 50%;
                          transform: translateY(-50%);
                          border-top: ${LineViewService.getLineCss(this._template.color, this._template.width, this._template.style)};
                        }

                      }
                      </style>`);
    this.ch.detectChanges();
  }


}
