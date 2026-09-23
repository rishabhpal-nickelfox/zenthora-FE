import {GridsterConfig} from 'angular-gridster2';
import {TemplateComponent, CompanyInfoRowsEnum} from "@eps/common";
import {Injectable} from "@angular/core";
import {isDefined} from '../../../../../../../../../../common/src/lib/helpers/object.helper';

@Injectable()
export abstract class SaleEmailTemplateLayoutCommonService {

  public options: GridsterConfig;
  private _layout: TemplateComponent[] = [];

  private _colorEven: string;
  private _colorOdd: string;
  private _fontColor: string;
  protected _fontSize: number;


  abstract addItem(componentRef);

  deleteItem(id) {
    const item = this.layout.find(d => d.id === id);
    this.layout.splice(this.layout.indexOf(item), 1);
  }

  wasAdded(id) {
    return isDefined(this.layout.find(d => d.id === id));
  }

  set layout(layout) {
    this._layout = [...layout];
  }

  get layout(): TemplateComponent[] {
    return this._layout;
  }

  get fontColor() {
    return isDefined(this._fontColor) ? this._fontColor : '#000000';
  }

  set fontColor(value) {
    this._fontColor = value;
  }

  get colorOdd() {
    return isDefined(this._colorOdd) ? this._colorOdd : '#f4f4f4';
  }

  set colorOdd(value) {
    this._colorOdd = value;
  }

  get colorEven() {
    return isDefined(this._colorEven) ? this._colorEven : '#ffffff';
  }

  set colorEven(value) {
    this._colorEven = value;
  }

  get fontSize() {
    return isDefined(this._fontSize) ? this._fontSize : 10;
  }

  set fontSize(value) {
    this._fontSize = value;
  }


  private _fontSizes: number[];

  get fontSizes(): number[] {
    if (!isDefined(this._fontSizes)) {
      this._fontSizes = [];
      for (let i = 8; i <= 16; i += 2) {
        this._fontSizes.push(i);
      }
    }
    return this._fontSizes;
  }


  private _companyInfoRows: CompanyInfoRowsEnum[] = [];

  get companyInfoRows(): CompanyInfoRowsEnum[] {
    return [...this._companyInfoRows];
  }

  set companyInfoRows(value: CompanyInfoRowsEnum[]) {
    if (isDefined(value)) {
      this._companyInfoRows = value;
    } else {
      this._companyInfoRows = Object.values(CompanyInfoRowsEnum);
    }
  }


  protected _hasLogo: boolean;

  set hasLogo(value: boolean) {
    this._hasLogo = value;
  }

}
