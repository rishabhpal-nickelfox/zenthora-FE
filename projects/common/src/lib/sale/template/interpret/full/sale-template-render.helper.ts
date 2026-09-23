import {InvoiceEmailPaymentLineStyleEnum} from "../../../../enums/sale/invoice-email-payment-line-style.enum";
import {CompanyInfoRowsEnum} from "../../../../enums/sale/company-info-rows.enum";
import {InvoiceItemsTableTotalsEnum} from "../../../../enums/sale/invoice-items-table-totals.enum";
import {TotalsTemplateModel} from "../../../../models/sale/template/invoice-template.model";
import {SaleEmailTemplateData} from "../../../../models/sale/template/sale-email-template-data.model";
import {ObjectHelper} from "../../../../helpers/object.helper";
import {replacePlaceholders} from "../../../../helpers/string.helper";

export const SALE_TYPE_PLACEHOLDER = "{{SALE_TYPE}}";
export const COMPANY_DISPLAY_NAME_PLACEHOLDER = "{{COMPANY_DISPLAY_NAME}}";

export class SaleTemplateRenderHelper {

  static getLineCss(color: string, width: number, style: InvoiceEmailPaymentLineStyleEnum): string {
    return `${width}pt ${style.toLowerCase()} ${color};`;
  }

  static replacePlaceholdersInHeader(header: string, displayName: string): string {
    return displayName
      ? replacePlaceholders(header, new Map<string, string>([
        [COMPANY_DISPLAY_NAME_PLACEHOLDER, displayName]
      ]))
      : header;
  }

  static isPresented(source: CompanyInfoRowsEnum[], column: string): boolean {
    return ObjectHelper.isDefined(source) && ObjectHelper.isDefined(source.find(c => c == column));
  }

  static isAnyPresented(source: CompanyInfoRowsEnum[], columns: string[]): boolean {
    return ObjectHelper.isDefined(source) && ObjectHelper.isDefined(columns.find(column => this.isPresented(source, column)));
  }

  static getHeader(total: InvoiceItemsTableTotalsEnum, totals: TotalsTemplateModel, model: SaleEmailTemplateData): string {
    switch (total) {
      case InvoiceItemsTableTotalsEnum.AMOUNT_DUE:
        return totals.amountDueHeader;
      case InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT:
        return totals.appliedAmountHeader;
      case InvoiceItemsTableTotalsEnum.DISCOUNT:
        return `${totals.discountHeader}`;
      case InvoiceItemsTableTotalsEnum.SHIPPING_COST:
        return model.shippingCost ? totals.shippingCostHeader : null;
      case InvoiceItemsTableTotalsEnum.SUBTOTAL:
        return totals.subtotalHeader;
      case InvoiceItemsTableTotalsEnum.TAX:
        return ObjectHelper.isDefined(model.taxPercentage)
          ? `${totals.taxHeader} (${model.taxPercentage}%)`
          : totals.taxHeader;
      case InvoiceItemsTableTotalsEnum.TOTAL:
        return totals.totalHeader;
      case InvoiceItemsTableTotalsEnum.TIP:
        return totals.tipHeader;
      default:
        throw new Error('Unsupported InvoiceItemsTableTotalsEnum ' + total);
    }
  }

  static getValue(total: InvoiceItemsTableTotalsEnum, model: SaleEmailTemplateData): number {
    switch (total) {
      case InvoiceItemsTableTotalsEnum.AMOUNT_DUE:
        return model.amountDue;
      case InvoiceItemsTableTotalsEnum.APPLIED_AMOUNT:
        return model.appliedAmount;
      case InvoiceItemsTableTotalsEnum.DISCOUNT:
        return ObjectHelper.isDefined(model.total) ? model.total : 0;
      case InvoiceItemsTableTotalsEnum.SHIPPING_COST:
        return model.shippingCost;
      case InvoiceItemsTableTotalsEnum.SUBTOTAL:
        return model.subTotal;
      case InvoiceItemsTableTotalsEnum.TAX:
        return model.taxAmount;
      case InvoiceItemsTableTotalsEnum.TOTAL:
        return model.total;
      case InvoiceItemsTableTotalsEnum.TIP:
        return model.tip;
      default:
        throw new Error('Unsupported InvoiceItemsTableTotalsEnum');
    }
  }
}
