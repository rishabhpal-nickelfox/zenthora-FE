import {ChangeDetectorRef, Directive} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';

@Directive()
export abstract class InvoiceEmailTemplateAbstractComponent {
    constructor(protected ch: ChangeDetectorRef) {
    }

    id: string;
    styles: SafeHtml;
}
