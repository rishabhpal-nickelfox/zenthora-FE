import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDialogRef} from '@nebular/theme';
import {
  ComponentWithSubscriptions
} from '../../../components/component-with-subscriptions';
import {
  ReceiptTemplateComponentEnum,
  ReceiptTemplateComponentEnumLabel
} from '../../../enums/companymanagement/companysettings/receipt-template-component.enum';
import {
  ReceiptTemplatePlaceholderEnumValue
} from '../../../enums/sale/receipt-template-placeholder.enum';
import {ReceiptTemplateModel} from '../../../models/sale/receipt/receipt-template-config.model';

@Component({
  standalone: false,
  selector: 'app-receipt-template-message-edit',
  templateUrl: './receipt-template-message-edit.component.html',
  styleUrls: ['./receipt-template-message-edit.component.scss', '../../../modals/external-modal.scss']
})
export class ReceiptTemplateMessageEditComponent extends ComponentWithSubscriptions implements OnInit {
  @Input() templateConfig: ReceiptTemplateModel;
  @Input() excludedPlaceholders: string[] = [];

  readonly ReceiptTemplateComponentEnum = ReceiptTemplateComponentEnum;
  readonly ReceiptTemplateComponentEnumLabel = ReceiptTemplateComponentEnumLabel;

  placeholders: Map<string, string> = ReceiptTemplatePlaceholderEnumValue;
  readonly editorOptions = {
    selectFontSize: true,
    selectFontColor: false,
    selectBackgroundColor: false,
    selectFontStyle: true,
    selectListStyle: false
  };
  readonly allowedFontSizes = [6, 8, 10, 12, 14, 16];
  readonly fontSizeMode = 'style';
  readonly defaultFontSize = 12;
  readonly defaultColor = '#000000';

  form = new FormGroup({
    message: new FormControl<string>(null, Validators.maxLength(4000)),
  });

  constructor(protected dialogRef: NbDialogRef<ReceiptTemplateMessageEditComponent>) {
    super();
  }

  ngOnInit(): void {
    if (this.excludedPlaceholders?.length) {
      this.placeholders = new Map([...ReceiptTemplatePlaceholderEnumValue]
        .filter(([placeholder]) => !this.excludedPlaceholders.includes(placeholder)));
    }

    const template = ReceiptTemplateModel.fromJSON(this.templateConfig);
    this.form.reset({
      message: template.message,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  close(): void {
    this.dialogRef.close();
  }
}
