import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ItemsTablePreviewComponent} from '../items-table-preview.component';
import {SafeHtml} from "@angular/platform-browser";
import {InvoiceItemsTableColumnsEnum
} from "../../../../../enums/sale/invoice-items-table-columns.enum";
import {CountryEnum} from "../../../../../enums/utils/county.enum";
import {GridAreaModel
} from "../../../../../models/sale/template/invoice-template.model";
import {InvoiceItemsTableTotalsEnum
} from '../../../../../enums/sale/invoice-items-table-totals.enum';
import {InvoiceItemsDataService} from "../invoice-items-data.service";
import {InvoiceItemsTableTemplateLayoutService} from "./invoice-items-table-template-layout.service";
import {ObjectHelper} from "../../../../../helpers/object.helper";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {SaleEmailTemplateData
} from "../../../../../models/sale/template/sale-email-template-data.model";
import {GridColumnsHelper} from "../../../../../helpers/grid-columns.helper";
import {InvoiceTotalsPreviewHelper} from "../invoice-totals-preview.helper";


@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-invoice-items',
  templateUrl: './invoice-items.component.html',
  styleUrls: ['./invoice-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemsComponent
  extends ItemsTablePreviewComponent<InvoiceItemsTableTemplateLayoutService> implements OnInit {

  styles: SafeHtml;
  readonly InvoiceItemsTableColumnsEnum = InvoiceItemsTableColumnsEnum;


  currency: { code: string } = {code: 'CAD'};
  qboCountry: CountryEnum;

  totalsRows = InvoiceTotalsPreviewHelper.getRows(InvoiceItemsDataService.templateData, []);

  private _layout: GridAreaModel[];
  private _totals: InvoiceItemsTableTotalsEnum[];
  protected readonly data: SaleEmailTemplateData = InvoiceItemsDataService.templateData;

  constructor(protected viewService: InvoiceItemsTableTemplateLayoutService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
    super(ch);
  }

  get isUS(): boolean {
    return this.viewService.qboCountry === CountryEnum.US;
  }

  ngOnInit() {
    this.updateLayout();
    this.updateTotals();
    this.updateStyles();
    this.viewService.layoutChanged.subscribe(
      () => {
        this.updateLayout();
      }
    );
    this.viewService.totalsChanged.subscribe(
      () => {
        this.updateTotals();
      }
    );
    this.viewService.settingsChanged.subscribe(
      () => {
        this.updateStyles();
      }
    );
  }

  show(colId) {
    return GridColumnsHelper.hasColumn(this.layout, colId);
  }

  getOrder(colId): number {
    return GridColumnsHelper.getColumnOrder(this.layout, colId);
  }

  isTotalRowPresented(row: string): boolean {
    return ObjectHelper.isDefined(this.viewService.totals.find(c => c == row));
  }

  protected readonly InvoiceItemsTableTotalsEnum = InvoiceItemsTableTotalsEnum;

  private updateStyles() {
    const customerMemoBackground = this.viewService.customerMemoColor
      ? `.tr:nth-child(even) > .memo-totals-row > .td.customer-memo {
            background: ${this.viewService.customerMemoColor};
         }

         .tr:nth-child(odd) > .memo-totals-row > .td.customer-memo {
            background: ${this.viewService.customerMemoColor};
         }`
      : '';
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>

                      app-invoice-email-payment-template-invoice-items {
                        --border: ${this.viewService.border};
                        --fontColor: ${this.viewService.fontColor};
                        --colorEven: ${this.viewService.colorEven};
                        --colorOdd: ${this.viewService.colorOdd};
                        --titleColor: ${this.viewService.titleColor};


                          color: var(--fontColor);

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        .td, .th {
                          border-bottom: var(--border);
                          border-right: var(--border);
                        }

                        .th {
                             background: var(--titleColor);
                        }

                        .tr:nth-child(even) > .td,
                        .tr:nth-child(even) > .memo-totals-row > .td {
                            background: var(--colorEven);
                        }

                        .tr:nth-child(odd) > .td,
                        .tr:nth-child(odd) > .memo-totals-row > .td {
                            background: var(--colorOdd);
                        }

                        ${customerMemoBackground}
                      }
                      </style>`);
    this.ch.detectChanges();
  }

  get layout(): GridAreaModel[] {
    return this._layout;
  }


  get totals(): InvoiceItemsTableTotalsEnum[] {
    return this._totals;
  }

  updateLayout() {
    this._layout = this.currentLayout;
    this.ch.detectChanges();
  }

  getMemoTotalsColumns() {
    return this.viewService.getMemoTotalsColumns(this.currentLayout, this.currentAutoColumnWidths);
  }

  getTotalsColumns() {
    return this.viewService.getTotalsColumns(this.currentLayout, this.currentAutoColumnWidths);
  }

  updateTotals() {
    this._totals = this.viewService.totals;
    this.totalsRows = InvoiceTotalsPreviewHelper.getRows(this.data, this._totals);
    this.ch.detectChanges();
  }

  protected readonly ObjectHelper = ObjectHelper;
}
