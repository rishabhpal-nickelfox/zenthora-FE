import {Directive, Input} from '@angular/core';

@Directive()
export abstract class SaleEmailTemplateAbstractComponent {

  titleColor: string;
  colorEven: string;
  colorOdd: string;
  fontColor: string;
  fontSize: number;

  @Input('params') public set params(p) {
    this.titleColor = p.titleColor;
    this.colorEven = p.colorEven;
    this.colorOdd = p.colorOdd;
    this.fontColor = p.fontColor;
    this.fontSize = p.fontSize;
  }
}
