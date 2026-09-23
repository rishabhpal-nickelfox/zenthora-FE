import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ReceiptPrintWidthEnum,
  ReceiptPrintWidthEnumLabel,
  ReceiptPrintWidthEnumValue
} from '../../../enums/companymanagement/companysettings/receipt-print-width.enum';
import {
  ReceiptTemplateComponentEnum,
  ReceiptTemplateComponentEnumLabel
} from '../../../enums/companymanagement/companysettings/receipt-template-component.enum';
import {ReceiptTemplateFieldEnum} from '../../../enums/companymanagement/companysettings/receipt-template-field.enum';
import {ReceiptTemplateModel} from '../../../models/sale/receipt/receipt-template-config.model';
import {ReceiptTemplateHelper} from './receipt-template-helper';
import {
  ComponentWithSubscriptions
} from '../../../components/component-with-subscriptions';
import {ReceiptTemplateBlockEditComponent} from './receipt-template-block-edit.component';
import {ReceiptTemplatePreviewDataService} from './receipt-template-preview-data.service';
import {ReceiptTemplateMessageEditComponent} from './receipt-template-message-edit.component';

@Component({
  standalone: false,
  selector: 'app-receipt-template-editor',
  templateUrl: './receipt-template-editor.component.html',
  styleUrls: ['./receipt-template-editor.component.scss']
})
export class ReceiptTemplateEditorComponent extends ComponentWithSubscriptions implements OnChanges {
  readonly receiptWidthOptions = Object.values(ReceiptPrintWidthEnum);
  readonly receiptComponents = [
    ReceiptTemplateComponentEnum.COMPANY_INFO,
    ReceiptTemplateComponentEnum.SALE_INFO,
    ReceiptTemplateComponentEnum.PAYMENT_INFO,
    ReceiptTemplateComponentEnum.SIGNATURE,
    ReceiptTemplateComponentEnum.MESSAGE,
  ];
  readonly ReceiptPrintWidthEnumLabel = ReceiptPrintWidthEnumLabel;
  readonly ReceiptPrintWidthEnumValue = ReceiptPrintWidthEnumValue;
  readonly ReceiptTemplateComponentEnumLabel = ReceiptTemplateComponentEnumLabel;
  readonly ReceiptTemplateComponentEnum = ReceiptTemplateComponentEnum;

  private _template: ReceiptTemplateModel;

  @Input() tabId = 'default';
  @Input() saleTableLabel = 'SALE:';
  @Input() amountLabel = 'Amt Paid';
  @Input() externalWidth: ReceiptPrintWidthEnum | null = null;
  @Input() excludedPlaceholders: string[] = [];

  @Input() set companyInfo(value: any) {
    this.preview.setCompanyInfo(value);
  }

  constructor(private modalService: NgbModal, private dialogService: NbDialogService, private preview: ReceiptTemplatePreviewDataService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalWidth'] && this._template && this.externalWidth) {
      this._template.width = this.externalWidth;
    }
  }

  get width(): ReceiptPrintWidthEnum {
    return this.externalWidth ?? this._template?.width;
  }

  set width(value: ReceiptPrintWidthEnum) {
    if (!this._template || this.externalWidth) {
      return;
    }

    this._template.width = value;
  }

  get template(): ReceiptTemplateModel {
    return this._template;
  }

  reInit(template: ReceiptTemplateModel): void {
    this._template = this.copyTemplate(template);
    if (this.externalWidth && this._template) {
      this._template.width = this.externalWidth;
    }
  }

  hasComponent(component: ReceiptTemplateComponentEnum): boolean {
    return ReceiptTemplateHelper.hasReceiptTemplateComponent(this._template, component);
  }

  hasField(field: ReceiptTemplateFieldEnum): boolean {
    return ReceiptTemplateHelper.hasReceiptTemplateField(this._template, field);
  }

  fields(component: ReceiptTemplateComponentEnum): ReceiptTemplateFieldEnum[] {
    return ReceiptTemplateHelper.getReceiptTemplateFieldsByComponent(component);
  }

  visibleComponents(): ReceiptTemplateComponentEnum[] {
    return this.receiptComponents.filter(component => this.hasComponent(component));
  }

  hiddenComponents(): ReceiptTemplateComponentEnum[] {
    return this.receiptComponents.filter(component => !this.hasComponent(component));
  }

  toggleComponent(component: ReceiptTemplateComponentEnum, enabled: boolean): void {
    if (enabled) {
      ReceiptTemplateHelper.addReceiptTemplateComponent(this._template, component);
      return;
    }

    ReceiptTemplateHelper.removeReceiptTemplateComponent(this._template, component);
  }

  trackByValue(index: number, value: string): string {
    return value;
  }

  addComponent(component: ReceiptTemplateComponentEnum): void {
    this.toggleComponent(component, true);
  }

  editComponent(component: ReceiptTemplateComponentEnum): void {
    if (component === ReceiptTemplateComponentEnum.MESSAGE) {
      this.editMessage();
      return;
    }

    const modalRef = this.modalService.open(ReceiptTemplateBlockEditComponent, {
      backdrop: 'static',
      size: this.width === ReceiptPrintWidthEnum.LETTER ? 'xl' : undefined
    });
    modalRef.componentInstance.component = component;
    modalRef.componentInstance.templateConfig = this.copyTemplate(this._template);
    modalRef.result.then((fields: ReceiptTemplateFieldEnum[]) => {
      ReceiptTemplateHelper.replaceReceiptTemplateComponentFields(this._template, component, fields);
    }, () => {
    });
  }

  removeComponent(component: ReceiptTemplateComponentEnum): void {
    this.toggleComponent(component, false);
  }

  canEditComponent(component: ReceiptTemplateComponentEnum): boolean {
    return this.fields(component).length > 0 || component === ReceiptTemplateComponentEnum.MESSAGE;
  }

  private editMessage(): void {
    const modalRef = this.dialogService.open(ReceiptTemplateMessageEditComponent, {
      context: {
        templateConfig: this.copyTemplate(this._template),
        excludedPlaceholders: this.excludedPlaceholders
      },
      closeOnBackdropClick: false,
      hasBackdrop: true,
      hasScroll: true,
      dialogClass: 'top-dialog'
    });
    this.subscriptions.add(modalRef.onClose.subscribe((message: Pick<ReceiptTemplateModel, 'message'>) => {
      if (!message) {
        return;
      }

      this._template.message = message.message;
    }));
  }

  private copyTemplate(template: ReceiptTemplateModel): ReceiptTemplateModel {
    return template ? {
      ...template,
      components: [...template.components],
      fields: [...template.fields],
    } : null;
  }
}
