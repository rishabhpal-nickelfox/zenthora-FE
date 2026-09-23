import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../../invoice-email-template-abstract.component';
import {SafeHtml} from '@angular/platform-browser';
import {InvoiceItemsDataService} from '../invoice-items-data.service';
import {TotalsViewService} from './totals-view.service';
import {CountryEnum} from "../../../../../enums/utils/county.enum";
import {TotalsTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {InvoiceItemsTableTotalsEnum, InvoiceItemsTableTotalsOrdered
} from "../../../../../enums/sale/invoice-items-table-totals.enum";

class InvoiceInfoTemplateModel {
}

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-totals',
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalsComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {

  styles: SafeHtml;


  currency: { code: string } = {code: 'CAD'};
  qboCountry: CountryEnum;

  totalsTemplateModel: TotalsTemplateModel;
  protected readonly data: InvoiceInfoTemplateModel = InvoiceItemsDataService.templateData;

  constructor(protected viewService: TotalsViewService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
    super(ch);
  }

  get isUS(): boolean {
    return this.viewService.qboCountry === CountryEnum.US;
  }

  ngOnInit() {
    this.updateStyles();
    this.viewService.settingsChanged.subscribe(
      () => {
        this.updateStyles();
      }
    );
    this.viewService.totalsChanged.subscribe(
      () => {
        this.updateStyles();
      }
    );
  }

  protected readonly InvoiceItemsTableTotalsEnum = InvoiceItemsTableTotalsEnum;

  private updateStyles() {
    this.totalsTemplateModel = this.viewService.template;
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>

                      app-invoice-email-payment-template-totals {
                        --border: ${this.viewService.border};
                        --fontColor: ${this.viewService.fontColor};
                        --colorEven: ${this.viewService.colorEven};
                        --colorOdd: ${this.viewService.colorOdd};
                          color: var(--fontColor);

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        .td  {
                          border-bottom: var(--border);
                          border-right: var(--border);
                        }

                        .tr:nth-child(even) > .td {
                            background: var(--colorEven);
                        }

                        .tr:nth-child(odd) > .td {
                            background: var(--colorOdd);
                        }

                      }
                      </style>`);

    this.ch.detectChanges();
  }


  get orderedTotals(){
    return [...(this.totalsTemplateModel.totals ?? [])].sort((a, b) =>
      InvoiceItemsTableTotalsOrdered.indexOf(a) - InvoiceItemsTableTotalsOrdered.indexOf(b)
    );
  }

  protected readonly Object = Object;


  protected readonly TotalsViewService = TotalsViewService;
  protected readonly InvoiceItemsDataService = InvoiceItemsDataService;
}
