import {EventEmitter, Injectable, Output} from '@angular/core';
import {
  InvoiceComponentTemplateModel
} from "../../../models/sale/template/invoice-template.model";
import {
  COMPANY_DISPLAY_NAME_PLACEHOLDER as LIB_COMPANY_DISPLAY_NAME_PLACEHOLDER,
  SALE_TYPE_PLACEHOLDER as LIB_SALE_TYPE_PLACEHOLDER
} from "../interpret/full/sale-template-render.helper";

@Injectable()
export abstract class InvoiceEmailTemplateViewCommonService {

  protected _templates: any[];
  @Output() settingsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() titleColorChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() colorEvenChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() colorOddChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() fontColorChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() borderColorChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() customerMemoColorChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  static readonly SALE_TYPE_PLACEHOLDER = LIB_SALE_TYPE_PLACEHOLDER;

  static readonly COMPANY_DISPLAY_NAME_PLACEHOLDER = LIB_COMPANY_DISPLAY_NAME_PLACEHOLDER;

  constructor() {
    this.fontColorChanged.subscribe((ids) =>
      this.settingsChanged.emit(ids)
    );
    this.titleColorChanged.subscribe((ids) =>
      this.settingsChanged.emit(ids)
    );
    this.colorEvenChanged.subscribe((ids) =>
      this.settingsChanged.emit(ids)
    );
    this.colorOddChanged.subscribe((ids) =>
      this.settingsChanged.emit(ids)
    );
    this.borderColorChanged.subscribe((ids) =>
      this.settingsChanged.emit(ids)
    );
    this.customerMemoColorChanged.subscribe((ids) =>
      this.settingsChanged.emit(ids)
    );
  }

  protected _titleColor: string;
  protected _colorEven: string;
  protected _colorOdd: string;
  protected _fontColor: string;
  protected _borderColor: string;

  protected get templatesIds(): string[] {
    return this._templates?.map(template => template.id) ?? [];
  }

  get borderColor(): string {
    return this._borderColor;
  }

  set borderColor(value: string) {
    this._borderColor = value;
    this._templates?.forEach(template => {
      template.borderColor = value;
    });
    this.borderColorChanged.emit(this.templatesIds);
  }

  get fontColor(): string {
    return this._fontColor;
  }

  set fontColor(value: string) {
    this._fontColor = value;
    this._templates?.forEach(template => {
      template.fontColor = value;
    })
    this.fontColorChanged.emit(this.templatesIds);
  }

  get colorOdd(): string {
    return this._colorOdd;
  }

  set colorOdd(value: string) {
    this._colorOdd = value;
    this._templates?.forEach(template => {
      template.colorOdd = value;
    });
    this.colorOddChanged.emit(this.templatesIds);
  }

  get colorEven(): string {
    return this._colorEven;
  }

  set colorEven(value: string) {
    this._colorEven = value;
    this._templates?.forEach(template => {
      template.colorEven = value;
    });
    this.colorEvenChanged.emit(this.templatesIds);
  }

  get titleColor(): string {
    return this._titleColor;
  }

  set titleColor(value: string) {
    this._titleColor = value;
    this._templates?.forEach(template => {
      template.titleColor = value;
    });
    this.titleColorChanged.emit(this.templatesIds);
  }

  get border(): string {
    return this.getBorderFromColor(this.borderColor);
  }

  getBorderFromColor(borderColor: string) {
    return borderColor == 'none' ? 'none' : `solid 2px ${borderColor}`;
  }

  get template(): InvoiceComponentTemplateModel {
    return {
      titleColor: this.titleColor,
      colorEven: this.colorEven,
      colorOdd: this.colorOdd,
      fontColor: this.fontColor,
      borderColor: this.borderColor
    };
  }
}
