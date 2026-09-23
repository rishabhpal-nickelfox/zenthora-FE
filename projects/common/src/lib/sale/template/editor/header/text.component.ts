import {Component, OnInit} from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {TextViewService} from './text-view.service';
import {
  TextTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {HtmlSanitizerService} from "../../../../utils/html-sanitizer.service";

@Component({
  standalone: false,
    selector: 'app-invoice-email-payment-template-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {
    private _template: TextTemplateModel;
    protected safeHtmlContent: SafeHtml;

    constructor(
      protected viewService: TextViewService,
      private htmlSanitizer: HtmlSanitizerService,
      protected ch: ChangeDetectorRef
    ) {
        super(ch);
    }

    public ngOnInit(): void {
      this.updateStyles();
        this.viewService.settingsChanged.subscribe(ids => {
            if (ids.indexOf(this.id) >= 0) {
              this.updateStyles();
              this.ch.detectChanges();
}
        });
    }


    private updateStyles() {
        this._template = this.viewService.getTemplate(this.id);
        this.safeHtmlContent = this.htmlSanitizer.sanitizeToSafeHtml(this._template.content);
    }

}
