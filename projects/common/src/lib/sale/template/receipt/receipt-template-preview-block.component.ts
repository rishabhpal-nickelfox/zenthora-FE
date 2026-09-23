import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SafeHtml} from '@angular/platform-browser';
import {
  ReceiptTemplateComponentEnum
} from '../../../enums/companymanagement/companysettings/receipt-template-component.enum';
import {
  ReceiptTemplateFieldEnum
} from '../../../enums/companymanagement/companysettings/receipt-template-field.enum';
import {ReceiptTemplateModel} from '../../../models/sale/receipt/receipt-template-config.model';
import {ReceiptTemplateHelper} from './receipt-template-helper';
import {ReceiptTemplatePreviewDataService} from './receipt-template-preview-data.service';
import {HtmlSanitizerService} from '../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
  selector: 'app-receipt-template-preview-block',
  templateUrl: './receipt-template-preview-block.component.html',
  styleUrls: ['./receipt-template-preview-block.component.scss']
})
export class ReceiptTemplatePreviewBlockComponent {
  @Input() component: ReceiptTemplateComponentEnum;
  @Input() config: ReceiptTemplateModel;
  @Input() editable = false;
  @Input() showLogoPlaceholder = false;
  @Input() saleTableLabel = 'SALE:';
  @Input() amountLabel = 'Amt Paid';
  @Output() removeField = new EventEmitter<ReceiptTemplateFieldEnum>();

  readonly ReceiptTemplateComponentEnum = ReceiptTemplateComponentEnum;
  readonly ReceiptTemplateFieldEnum = ReceiptTemplateFieldEnum;

  constructor(private htmlSanitizer: HtmlSanitizerService, public preview: ReceiptTemplatePreviewDataService) {
  }

  get safeMessage(): SafeHtml {
    return this.htmlSanitizer.sanitizeToSafeHtml(this.config?.message || '');
  }

  hasField(field: ReceiptTemplateFieldEnum): boolean {
    return ReceiptTemplateHelper.hasReceiptTemplateField(this.config, field);
  }

  onRemoveField(field: ReceiptTemplateFieldEnum): void {
    this.removeField.emit(field);
  }
}
