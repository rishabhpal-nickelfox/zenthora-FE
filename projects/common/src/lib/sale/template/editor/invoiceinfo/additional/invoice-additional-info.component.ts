import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../../invoice-email-template-abstract.component';
import {InvoiceAdditionalInfoLayoutService} from './invoice-additional-info-layout.service';
import {GridAreaModel,
  InvoiceAdditionalInfoTemplateModel
} from '../../../../../models/sale/template/invoice-template.model';
import {HtmlSanitizerService} from '../../../../../utils/html-sanitizer.service';
import {SaleAdditionalInfoColumnsEnum
} from '../../../../../enums/sale/sale-additional-info-columns.enum';

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-invoice-additional-info',
  templateUrl: './invoice-additional-info.component.html',
  styleUrls: ['./invoice-additional-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceAdditionalInfoComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {
  private _template: InvoiceAdditionalInfoTemplateModel;
  private _layout: GridAreaModel[] = [];

  constructor(protected viewService: InvoiceAdditionalInfoLayoutService,
    protected ch: ChangeDetectorRef,
    private readonly htmlSanitizer: HtmlSanitizerService
  ) {
    super(ch);
  }

  ngOnInit(): void {
    this.updateStyles();
    this.viewService.settingsChanged.subscribe(
      (ids) => {
        if (ids && ids.indexOf(this.id) >= 0) {
          this.updateStyles();
        }
      }
    );
    this.viewService.layoutChanged.subscribe(
      () => this.ch.detectChanges()
    )
  }

  private updateStyles(): void {
    this._template = this.viewService.getTemplate(this.id);
    if (this._template) {
      this._layout = this._template.additionalInfo ?? [];
      this.styles = this.htmlSanitizer.trustHtml(`
      <style>
        app-invoice-email-payment-template-invoice-additional-info {
        .${this.id}{
          --border: ${this.viewService.getBorderFromColor(this._template.borderColor)};
          --fontColor: ${this._template.fontColor};
          --colorOdd: ${this._template.colorOdd};
          --titleColor: ${this._template.titleColor};

          .table {
            border-top: var(--border);
            border-left: var(--border);
            color: var(--fontColor);
          }
          .td, .th {
            border-bottom: var(--border);
            border-right: var(--border);
          }
          .td { background: var(--colorOdd); }
          .th { background: var(--titleColor); }
          }
        }
      </style>
    `);
    }
    this.ch.detectChanges();
  }


  get layout(): GridAreaModel[] {
    return this._layout;
  }

  show(columnId: SaleAdditionalInfoColumnsEnum): boolean {
    return this.viewService.show(this._layout, columnId);
  }

  getOrder(columnId: SaleAdditionalInfoColumnsEnum): number {
    return this.viewService.getOrder(this._layout, columnId);
  }

  protected readonly SaleAdditionalInfoColumnsEnum = SaleAdditionalInfoColumnsEnum;

  columns = [
    {key: SaleAdditionalInfoColumnsEnum.DUE_DATE, getHeader: () => this._template?.dueDateHeader, dataKey: 'dueDate'},
    {key: SaleAdditionalInfoColumnsEnum.TERMS, getHeader: () => this._template?.termsHeader, dataKey: 'terms'},
    {
      key: SaleAdditionalInfoColumnsEnum.SALES_REP,
      getHeader: () => this._template?.salesRepHeader,
      dataKey: 'salesRep'
    },
    {
      key: SaleAdditionalInfoColumnsEnum.SHIP_DATE,
      getHeader: () => this._template?.shipDateHeader,
      dataKey: 'shipDate'
    },
    {
      key: SaleAdditionalInfoColumnsEnum.SHIP_METHOD,
      getHeader: () => this._template?.shipMethodHeader,
      dataKey: 'shipMethod'
    },
    {
      key: SaleAdditionalInfoColumnsEnum.TRACKING_NUMBER,
      getHeader: () => this._template?.trackingNumberHeader,
      dataKey: 'trackingNumber'
    },
    {key: SaleAdditionalInfoColumnsEnum.FOB, getHeader: () => this._template?.fobHeader, dataKey: 'fob'},
    {key: SaleAdditionalInfoColumnsEnum.PO_NUMBER, getHeader: () => this._template?.poNumberHeader, dataKey: 'poNumber'},
    {key: SaleAdditionalInfoColumnsEnum.OTHER, getHeader: () => this._template?.otherHeader, dataKey: 'other'}
  ];
}
