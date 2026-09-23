import {
  InvoiceItemsTableTotalsEnum,
  InvoiceItemsTableTotalsEnumValue,
  InvoiceItemsTableTotalsField,
  InvoiceItemsTableTotalsOrdered
} from '../../../../enums/sale/invoice-items-table-totals.enum';
import {SaleEmailTemplateData} from '../../../../models/sale/template/sale-email-template-data.model';
import {ObjectHelper} from '../../../../helpers/object.helper';

export class InvoiceTotalsPreviewHelper {

  static getRows(data: SaleEmailTemplateData, totals: InvoiceItemsTableTotalsEnum[]) {
    return InvoiceItemsTableTotalsOrdered
      .filter(id => (totals ?? []).includes(id))
      .map(id => ({
        id,
        label: InvoiceTotalsPreviewHelper.getLabel(id, data),
        amount: Number(data?.[InvoiceItemsTableTotalsField.get(id)] ?? 0)
      }));
  }

  private static getLabel(id: InvoiceItemsTableTotalsEnum, data: SaleEmailTemplateData): string {
    const name = InvoiceItemsTableTotalsEnumValue.get(id) ?? id;
    return id === InvoiceItemsTableTotalsEnum.TAX && ObjectHelper.isDefined(data?.taxPercentage)
      ? `${name} (${data.taxPercentage}%)`
      : name;
  }
}
