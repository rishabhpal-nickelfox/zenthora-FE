import {EventEmitter, Injectable, Output} from '@angular/core';
import {
  InvoiceTemplateModel,
  LineTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../../helpers/object.helper";
import {
  InvoiceEmailPaymentLineStyleEnum
} from "../../../../enums/sale/invoice-email-payment-line-style.enum";
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";
import {SaleTemplateRenderHelper} from "../../interpret/full/sale-template-render.helper";

@Injectable()
export class LineViewService {
  private _lineTemplates: LineTemplateModel[];
  private _defaultColor: string;

  @Output() settingsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  get templates(): LineTemplateModel[] {
    return this._lineTemplates;
  }

  initTemplates(lineTemplates: LineTemplateModel[], defaultLineColor: string) {
    this._lineTemplates = lineTemplates;
    this._defaultColor = defaultLineColor;
    this.settingsChanged.emit([undefined, ...this._lineTemplates.map(lineTemplate => lineTemplate.id)]);
  }

  getTemplate(lineId: string): LineTemplateModel {
    return this._lineTemplates && ObjectHelper.isDefined(lineId) ? this._lineTemplates.find(line => line.id == lineId) : new LineTemplateModel(lineId, this._defaultColor);
  }

  updateTemplate(lineId: string, color: string, width: number, style: InvoiceEmailPaymentLineStyleEnum): void {
    const lineTemplate = this.getTemplate(lineId);
    lineTemplate.color = color;
    lineTemplate.width = width;
    lineTemplate.style = style;
    this.settingsChanged.emit([lineId]);
  }

  static getLineCss(color: string, width: number, style: InvoiceEmailPaymentLineStyleEnum) {
    return SaleTemplateRenderHelper.getLineCss(color, width, style);
  }

  createLine(defaultColor: string): string {
    const newId = InvoiceTemplateModel.generateGridAreaId('line');
    const newLineTemplate = new LineTemplateModel(newId, defaultColor);
    this._lineTemplates.push(newLineTemplate);
    return newId;
  }
}
