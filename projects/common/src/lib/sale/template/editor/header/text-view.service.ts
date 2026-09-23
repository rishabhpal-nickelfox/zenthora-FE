import {EventEmitter, Injectable, Output} from '@angular/core';
import {
  InvoiceTemplateModel,
  TextTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../../helpers/object.helper";
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";


@Injectable()
export class TextViewService {
  protected _templates: TextTemplateModel[];
  private _defaultColor: string;

  @Output() settingsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  get templates(): TextTemplateModel[] {
    return this._templates;
  }

  initTemplates(textTemplates: TextTemplateModel[], defaultLineColor: string) {
    this._templates = textTemplates;
    this._defaultColor = defaultLineColor;
    this.settingsChanged.emit([undefined, ...this._templates.map(textTemplate => textTemplate.id)]);
  }

  getTemplate(textId: string): TextTemplateModel {
    return this._templates && ObjectHelper.isDefined(textId) ? this._templates.find(text => text.id == textId) : new TextTemplateModel(textId, this._defaultColor);
  }

  updateTemplate(textId: string, content: string): void {
    const textTemplate = this.getTemplate(textId);
    textTemplate.content = content;
    this.settingsChanged.emit([textId]);
  }


  createText(): string {
    const newId = InvoiceTemplateModel.generateGridAreaId('text');
    const newText = new TextTemplateModel(newId);
    this._templates.push(newText);
    return newId;
  }
}
