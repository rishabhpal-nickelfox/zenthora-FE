import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ReceiptPrintWidthEnumValue
} from '../../../enums/companymanagement/companysettings/receipt-print-width.enum';
import {
  ReceiptTemplateComponentEnum,
  ReceiptTemplateComponentEnumLabel
} from '../../../enums/companymanagement/companysettings/receipt-template-component.enum';
import {
  ReceiptTemplateFieldEnum,
  ReceiptTemplateFieldLabel
} from '../../../enums/companymanagement/companysettings/receipt-template-field.enum';
import {ReceiptTemplateModel} from '../../../models/sale/receipt/receipt-template-config.model';
import {ReceiptTemplateHelper} from './receipt-template-helper';
import {
  ComponentWithSubscriptions
} from '../../../components/component-with-subscriptions';

@Component({
  standalone: false,
  selector: 'app-receipt-template-block-edit',
  templateUrl: './receipt-template-block-edit.component.html',
  styleUrls: ['./receipt-template-block-edit.component.scss', '../../../modals/external-modal.scss']
})
export class ReceiptTemplateBlockEditComponent extends ComponentWithSubscriptions implements OnInit {
  @Input() component: ReceiptTemplateComponentEnum;
  @Input() templateConfig: ReceiptTemplateModel;

  readonly ReceiptPrintWidthEnumValue = ReceiptPrintWidthEnumValue;
  readonly ReceiptTemplateComponentEnum = ReceiptTemplateComponentEnum;
  readonly ReceiptTemplateComponentEnumLabel = ReceiptTemplateComponentEnumLabel;
  readonly ReceiptTemplateFieldLabel = ReceiptTemplateFieldLabel;

  protected config: ReceiptTemplateModel;

  constructor(public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
    this.config = ReceiptTemplateModel.fromJSON(this.templateConfig);
  }

  get fields(): ReceiptTemplateFieldEnum[] {
    return ReceiptTemplateHelper.getReceiptTemplateFieldsByComponent(this.component);
  }

  hiddenFields(): ReceiptTemplateFieldEnum[] {
    return this.fields.filter(field => !this.hasField(field));
  }

  hasField(field: ReceiptTemplateFieldEnum): boolean {
    return ReceiptTemplateHelper.hasReceiptTemplateField(this.config, field);
  }

  save(): void {
    this.activeModal.close(this.fields.filter(field => this.hasField(field)));
  }

  addField(field: ReceiptTemplateFieldEnum): void {
    ReceiptTemplateHelper.addReceiptTemplateField(this.config, field);
  }

  removeField(field: ReceiptTemplateFieldEnum): void {
    ReceiptTemplateHelper.removeReceiptTemplateField(this.config, field);
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
