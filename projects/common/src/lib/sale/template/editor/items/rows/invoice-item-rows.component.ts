import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ItemsTablePreviewComponent} from '../items-table-preview.component';
import {SafeHtml} from '@angular/platform-browser';
import {InvoiceItemsDataService} from '../invoice-items-data.service';
import {InvoiceItemRowsTemplateLayoutService} from './invoice-item-rows-template-layout.service';
import {InvoiceItemsTableColumnsEnum
} from "../../../../../enums/sale/invoice-items-table-columns.enum";
import {CountryEnum} from "../../../../../enums/utils/county.enum";
import {GridAreaModel
} from "../../../../../models/sale/template/invoice-template.model";
import {SaleEmailTemplateData
} from "../../../../../models/sale/template/sale-email-template-data.model";
import {ObjectHelper} from "../../../../../helpers/object.helper";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {GridColumnsHelper} from "../../../../../helpers/grid-columns.helper";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-invoice-items-rows',
  templateUrl: './invoice-item-rows.component.html',
  styleUrls: ['./invoice-item-rows.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceItemRowsComponent
  extends ItemsTablePreviewComponent<InvoiceItemRowsTemplateLayoutService> implements OnInit {

  styles: SafeHtml;

  currency: { code: string } = {code: 'CAD'};
  qboCountry: CountryEnum;

  private _layout: GridAreaModel[];
  protected readonly data: SaleEmailTemplateData = InvoiceItemsDataService.templateData;

  constructor(protected viewService: InvoiceItemRowsTemplateLayoutService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
    super(ch);
  }

  get isUS(): boolean {
    return this.viewService.qboCountry === CountryEnum.US;
  }

  ngOnInit() {
    this.updateLayout();
    this.updateStyles();
    this.viewService.layoutChanged.subscribe(
      () => {
        this.updateLayout();
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

  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>

                      app-invoice-email-payment-template-invoice-items-rows {
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

                        .empty.right {
                          border-right: var(--border);
                        }

                        .total:nth-last-child(1) > .empty {
                         border-bottom: var(--border);
                        }

                        .th {
                             background: var(--titleColor);
                        }

                        .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                        }

                        .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                        }

                        .empty.even {
                            background: var(--colorEven);
                        }

                        .empty.odd {
                            background: var(--colorOdd);
                        }

                      }
                      </style>`);
    this.ch.detectChanges();
  }

  get layout(): GridAreaModel[] {
    return this._layout;
  }

  updateLayout() {
    this._layout = this.currentLayout;
    this.ch.detectChanges();
  }


  protected readonly InvoiceItemsTableColumnsEnum = InvoiceItemsTableColumnsEnum;
  protected readonly ObjectHelper = ObjectHelper;
}
