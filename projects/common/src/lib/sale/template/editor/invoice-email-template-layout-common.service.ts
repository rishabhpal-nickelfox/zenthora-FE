import {GridsterConfig} from 'angular-gridster2';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from './invoice-email-template-view-common.service';
import {GridAreaModel, InvoiceTemplateModel} from "../../../models/sale/template/invoice-template.model";
import {ObjectHelper} from "../../../helpers/object.helper";

@Injectable()
export abstract class InvoiceEmailTemplateLayoutCommonService extends InvoiceEmailTemplateViewCommonService {
  @Output() layoutChanged: EventEmitter<void> = new EventEmitter<void>();


  public options: GridsterConfig;
  private _layout: GridAreaModel[] = [];

  protected _fontSize: number;
  private _fontSizes: number[];

  protected _lineHeight: number;
  private _lineHeights: number[];

  abstract addItem(layout, componentRef);

  deleteItem(layout: GridAreaModel[], id) {
    const item = layout.find(d => d.id === id);
    return this.checkAndSplice(layout, item);
  }

  protected checkAndSplice(layout: GridAreaModel[], item: GridAreaModel) {
    if (ObjectHelper.isDefined(item)) {
      return layout.splice(layout.indexOf(item), 1);
    }
  }

  wasAdded(layout: GridAreaModel[], id) {
    return ObjectHelper.isDefined(layout?.find(d => d.id === id));
  }

  set layout(layout) {
    this._layout = [...layout];
    this.layoutChanged.emit();
  }

  get layout(): GridAreaModel[] {
    return this._layout;
  }

  get fontSize() {
    return ObjectHelper.isDefined(this._fontSize) ? this._fontSize : 14;
  }

  get fontSizes(): number[] {
    if (!ObjectHelper.isDefined(this._fontSizes)) {
      this._fontSizes = [];
      for (let i = 8; i <= 16; i += 2) {
        this._fontSizes.push(i);
      }
    }
    return this._fontSizes;
  }

  get lineHeights(): number[] {
    if (!ObjectHelper.isDefined(this._lineHeights)) {
      this._lineHeights = [...InvoiceTemplateModel.LINE_HEIGHTS];
    }
    return this._lineHeights;
  }

}
