import {ActivatedRoute} from '@angular/router';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {SaleEmailTemplateData} from "../../../../models/sale/template/sale-email-template-data.model";
import {InvoiceTemplateInterpretViewService} from "./invoice-template-interpret-view.service";
import {CompanyInfoRowsEnum} from '../../../../enums/sale/company-info-rows.enum';
import {SaleTemplateRenderHelper} from './sale-template-render.helper';
import {isEmptyString} from '../../../../helpers/string.helper';
import {ObjectHelper} from "../../../../helpers/object.helper";
import {
  InvoiceItemsTableTotalsEnum
} from "../../../../enums/sale/invoice-items-table-totals.enum";
import {DecimalPipe} from "@angular/common";

@Component({
  standalone: false,
  selector: 'app-sale-email-full-payment-template-interpret',
  templateUrl: './sale-email-payment-full-template-interpret.component.html',
  styleUrls: ['./sale-email-payment-full-template-interpret.component.scss'],
  providers: [InvoiceTemplateInterpretViewService]
})
export class SaleEmailPaymentFullTemplateInterpretComponent implements OnInit, AfterViewInit {
  styles: SafeHtml;

  @ViewChildren('gridElement', {read: ElementRef}) gridElements: QueryList<ElementRef>;


  constructor(public elementRef: ElementRef,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              protected sanitizer: DomSanitizer,
              public viewService: InvoiceTemplateInterpretViewService,
              public decimalPipe: DecimalPipe) {
  }


  private _invoiceTemplateDataModel: SaleEmailTemplateData;

  get invoiceTemplateDataModel(): SaleEmailTemplateData {
    return this._invoiceTemplateDataModel;
  }

  @Input() set showInvoiceStatus(showInvoiceStatus: boolean) {
    this.viewService.showInvoiceStatus = showInvoiceStatus;
  }


  @Input() set invoiceTemplateDataModel(emailInvoiceModel: SaleEmailTemplateData) {
    this.viewService.invoiceTemplateDataModel = emailInvoiceModel;
    this.updateStyles();
  }

  public ngAfterViewInit(): void {
    this.viewService.setTotalsBackground(this.elementRef);
    this.runLegacyLayout();
    this.ch.detectChanges();
  }

  // Legacy layout only: measure the rendered grid and snap rows to the 45pt grid
  private runLegacyLayout(): void {
    if (!this.viewService.legacyLayout) {
      return;
    }
    this.viewService.updateGrid(this.gridElements?.toArray());
    setTimeout(() => {
      this.viewService.updateGrid(this.gridElements?.toArray());
      this.ch.detectChanges();
    }, 100);
  }

  protected readonly CompanyInfoRowsEnum = CompanyInfoRowsEnum;
  protected readonly TotalsViewService = SaleTemplateRenderHelper;


  protected readonly isEmptyString = isEmptyString;

  ngOnInit(): void {
  }

  private updateStyles(): void {
    const lineHeightDecl = this.viewService.legacyLayout
      ? '--line-height: 1;'
      : ObjectHelper.isDefined(this.viewService.lineHeight)
        ? `--line-height: ${this.viewService.lineHeight};`
        : '';
    this.styles = this.sanitizer.bypassSecurityTrustHtml(`
                  <style>
                  .invoice-template-interpret {
                          --font-size: ${this.viewService.fontSize}pt !important;
                          ${lineHeightDecl}
                          --default-border: ${this.viewService.border};
                          color: ${this.viewService.fontColor};

                        * {
                           font-size: var(--font-size);
                        }
                        .EMAIL_PAYMENT {
                            font-size: var(--font-size);
                            ${this.viewService.legacyLayout ? '' : `grid-auto-rows: ${this.viewService.minimizeVerticalSize ? 'auto' : 'minmax(60px, auto)'};
                            grid-gap: ${this.viewService.gridGap + "px"};`}
                        }

                        .td, .th {
                          border-bottom: var(--default-border);
                          border-right: var(--default-border);
                        }

                        .SALE_FULL_INFO {
                          --border: ${this.viewService.getBorderFromColor(this.viewService.saleFullInfoTemplate.borderColor)};
                          --colorEven: ${this.viewService.saleFullInfoTemplate.colorEven};
                          --colorOdd: ${this.viewService.saleFullInfoTemplate.colorOdd};

                          * {
                            color:  ${this.viewService.saleFullInfoTemplate.fontColor};
                          }
                          .table {
                            border-top: var(--border);
                            border-left: var(--border);

                          }

                          .td {
                            border-bottom: var(--border);
                            border-right: var(--border);
                            padding-top: 0;
                            padding-bottom: 0;
                          }

                          .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                          }

                          .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                          }

                          .td > strong {
                            float: right;
                          }

                        }

                        .ITEMS {
                          --border: ${this.viewService.getBorderFromColor(this.viewService.itemTableTemplate.borderColor)};
                          --colorEven: ${this.viewService.itemTableTemplate.colorEven};
                          --colorOdd: ${this.viewService.itemTableTemplate.colorOdd};
                          --titleColor: ${this.viewService.itemTableTemplate.titleColor};

                          * {
                            color: ${this.viewService.itemTableTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .tr:nth-child(even) > .td,
                          .tr:nth-child(even) > .memo-totals-row > .td {
                            background: var(--colorEven);
                          }

                          .tr:nth-child(odd) > .td,
                          .tr:nth-child(odd) > .memo-totals-row > .td {
                            background: var(--colorOdd);
                          }

                          .th {
                            background: var(--titleColor);
                          }
                          .empty.right {
                            border-right: var(--border);
                          }

                          .total:nth-last-child(1) > .empty {
                            border-bottom: var(--border);
                          }

                          ${this.viewService.getItemTableCustomerMemoCSS()}
                        }

                        .ITEMS_ROWS {
                          --border: ${this.viewService.getBorderFromColor(this.viewService.itemsRowsTemplate.borderColor)};
                          --colorEven: ${this.viewService.itemsRowsTemplate.colorEven};
                          --colorOdd: ${this.viewService.itemsRowsTemplate.colorOdd};
                          --titleColor: ${this.viewService.itemsRowsTemplate.titleColor};

                          * {
                            color: ${this.viewService.itemsRowsTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                          }

                          .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                          }

                          .th {
                            background: var(--titleColor);
                          }

                        }

                               .TOTALS {

                          --border: ${this.viewService.getBorderFromColor(this.viewService.totalsTemplate.borderColor)};
                          --colorOdd: ${this.viewService.totalsTemplate.colorOdd};
                          --colorEven: ${this.viewService.totalsTemplate.colorEven};

                          * {
                            color: ${this.viewService.totalsTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-top-width: 1px;
                            border-bottom: var(--border);
                            border-bottom-width: 1px;
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-bottom-width: 1px;
                            border-right: var(--border);
                            border-top: var(--border);
                            border-top-width: 1px;
                          }

                          .tr > .td:not(.d-none) {
                            border-left: var(--border);
                          }

                         .tr > .td:not(.d-none) ~ .td:not(.d-none) {
                            border-left: none !important;
                          }

                         .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                          }

                          .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                          }

                        }

                        .SALE_SHORT_INFO {
                          --border: ${this.viewService.getBorderFromColor(this.viewService.saleShortInfoTemplate.borderColor)};
                          --colorOdd: ${this.viewService.saleShortInfoTemplate.colorOdd};
                          --titleColor: ${this.viewService.saleShortInfoTemplate.titleColor};

                          * {
                            color: ${this.viewService.saleShortInfoTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }

                        }
                        .BILLING_ADDRESS {

                          --border: ${this.viewService.getBorderFromColor(this.viewService.billToTemplate.borderColor)};
                          --colorOdd: ${this.viewService.billToTemplate.colorOdd};
                          --titleColor: ${this.viewService.billToTemplate.titleColor};

                          * {
                            color: ${this.viewService.billToTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }
                        }

                        .SHIPPING_ADDRESS {

                          --border: ${this.viewService.getBorderFromColor(this.viewService.shipToTemplate.borderColor)};
                          --colorOdd: ${this.viewService.shipToTemplate.colorOdd};
                          --titleColor: ${this.viewService.shipToTemplate.titleColor};

                          * {
                            color: ${this.viewService.shipToTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }
                        }

                         .SHIPPING_INFO {
                          --border: ${this.viewService.getBorderFromColor(this.viewService.shippingInfoTemplate.borderColor)};
                          --colorOdd: ${this.viewService.shippingInfoTemplate.colorOdd};
                          --titleColor: ${this.viewService.shippingInfoTemplate.titleColor};

                          * {
                            color: ${this.viewService.shippingInfoTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }

                        }

                        .CUSTOMER_MEMO {

                          --border: ${this.viewService.getBorderFromColor(this.viewService.customerMemoTemplate.borderColor)};
                          --colorOdd: ${this.viewService.customerMemoTemplate.colorOdd};

                          * {
                            color: ${this.viewService.customerMemoTemplate.fontColor};
                          }

                          .table {
                            border-top: var(--border);
                            border-left: var(--border);
                          }

                          .td, .th {
                            border-bottom: var(--border);
                            border-right: var(--border);
                          }

                          .td {
                            background: var(--colorOdd);
                          }
                          .th {
                            background: var(--titleColor);
                          }
                        }

                        ${this.viewService.getLineCSS()}
                        ${this.viewService.getCustomFieldsCSS()}
                        ${this.viewService.getCustomerNameCSS()}
                        ${this.viewService.getCompanyInfoCSS()}
                        ${this.viewService.getSaleAdditionalInfoCSS()}
                                     }
                      </style>`);
    this.ch.detectChanges();
  }

  protected readonly ObjectHelper = ObjectHelper;
  protected readonly InvoiceItemsTableTotalsEnum = InvoiceItemsTableTotalsEnum;
}
