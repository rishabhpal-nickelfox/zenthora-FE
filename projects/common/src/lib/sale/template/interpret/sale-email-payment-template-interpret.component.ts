import {ActivatedRoute} from '@angular/router';
import {ChangeDetectorRef, Directive, ElementRef, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DomSanitizer, SafeHtml, SafeStyle} from '@angular/platform-browser';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  SaleAdditionalInfoTemplateData,
  SaleEmailTemplateData,
  SaleShortInfoTemplateData, Template
} from "../../../models/sale/template/sale-email-template-data.model";
import {ErrorService} from "../../../utils/errorhandler/error.service";
import {ComponentWithSubscriptions} from "../../../components/component-with-subscriptions";
import {DocTypeEnum, DocTypeEnumValue} from "../../../enums/sale/doc-type.enum";
import {PaymentStatusEnum, PaymentStatusEnumValue} from "../../../enums/sale/payment-status.enum";
import {isDefined} from "../../../helpers/object.helper";
import {getMessage} from "../../../helpers/string.helper";

@Directive()
export abstract class SaleEmailPaymentTemplateInterpretComponent extends ComponentWithSubscriptions implements OnInit {

  styles: SafeHtml;

  readonly SaleStatusEnum = PaymentStatusEnum;
  readonly SaleStatusEnumValue = PaymentStatusEnumValue;
  readonly DocTypeEnumValue = DocTypeEnumValue;

  @Input() showSaleStatus: boolean;
  @Input() docType: DocTypeEnum;

  constructor(public elementRef: ElementRef,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              protected _fb: FormBuilder,
              protected modalService: NgbModal,
              protected sanitizer: DomSanitizer,
              public errorService: ErrorService) {
    super();
  }

  protected _model: SaleEmailTemplateData;

  get model(): SaleEmailTemplateData {
    return this._model;
  }

  @Input() set model(saleEmailModel: SaleEmailTemplateData) {
    this._model = saleEmailModel;
    this.fontColor = this.getTemplate()?.fontColor;
    this.colorEven = this.getTemplate()?.colorEven;
    this.colorOdd = this.getTemplate()?.colorOdd;
    this.fontSize = this.getTemplate()?.fontSize;
  }


  private _fontColor = '#666666';

  get fontColor(): string {
    return this._fontColor;
  }

  set fontColor(color) {
    this._fontColor = isDefined(color) ? color : this._fontColor;
  }

  private _colorEven = '#ffffff';

  get colorEven(): string {
    return this._colorEven;
  }

  set colorEven(color) {
    this._colorEven = isDefined(color) ? color : this._colorEven;
  }

  private _colorOdd = '#f4f4f4';

  get colorOdd(): string {
    return this._colorOdd;
  }

  set colorOdd(color) {
    this._colorOdd = isDefined(color) ? color : this._colorOdd;
  }

  private _fontSize: number;

  set fontSize(value: number) {
    this._fontSize = value;
  }

  get fontSize(): number {
    return isDefined(this._fontSize) ? this._fontSize : 10;
  }

  get logoSource(): { logo: string, logoContentType: string } {
    return this.model.logo;
  }

  get logoPreview() {
    return this.logoSource ? 'data:' + this.logoSource.logoContentType + ';base64,' + this.logoSource.logo : null;
  }

  get logoMaxWidth(): string {
    return '185px';
  }

  get logoMaxHeight(): string {
    return '185px';
  }

  ngOnInit(): void {
    this.styles = this.sanitizer.bypassSecurityTrustHtml(`
                  <style>
                        .sale-template-interpret * {
                        font-size: ${this.fontSize}pt
                        }
                  </style>
                `);
    this.ch.detectChanges();
  }

  print() {
    window.print();
    return false;
  }

  protected abstract getTemplate(): Template;

  get componentsTemplate() {
    return this.getTemplate().components;
  }

  getGridTemplateRows(): SafeStyle {
    const maxHeight = Math.max.apply(Math, this.componentsTemplate.map(o => o.y + o.rows));
    return this.sanitizer.bypassSecurityTrustStyle(getMessage('repeat($s, 1fr)', maxHeight + 1));
  }

  getGridArea(key): SafeStyle {
    const component = this.componentsTemplate.find(comp => comp.id == key);
    if (component) {
      return this.sanitizer
        .bypassSecurityTrustStyle(
          getMessage('%s / %s / span %s / span %s', [component.y + 1, component.x + 1, component.rows, component.cols]));
    }
    return null;
  }


  get saleShortInfo(): SaleShortInfoTemplateData {
    return this.model.saleShortInfo;
  }

  get saleAdditionalInfo(): SaleAdditionalInfoTemplateData {
    return this.model.saleAdditionalInfo;
  }
}
