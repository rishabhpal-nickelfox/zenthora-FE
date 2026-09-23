import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {CompanyInfoViewService} from './company-info-view.service';
import {CompanyInfoTemplateModel
} from '../../../../models/sale/template/invoice-template.model';
import {ObjectHelper} from '../../../../helpers/object.helper';
import {CompanyInfoRowsEnum} from '../../../../enums/sale/company-info-rows.enum';
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInfoComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {
  private _template: CompanyInfoTemplateModel;

  constructor(protected viewService: CompanyInfoViewService,
    protected ch: ChangeDetectorRef,
    private readonly htmlSanitizer: HtmlSanitizerService
  ) {
    super(ch);
  }

  ngOnInit(): void {
    this.updateStyles();

    this.viewService.settingsChanged.subscribe(ids => {
      if (ids.indexOf(this.id) >= 0) {
        this.updateStyles();
      }
    });

    this.viewService.companyInfoChanged.subscribe(() => {
      this.ch.detectChanges();
    });

    this.ch.detectChanges();
  }

  isPresented(column: string): boolean {
    return CompanyInfoViewService.isPresented(this._template?.companyInfoRows, column);
  }

  isAnyPresented(columns: string[]): boolean {
    return ObjectHelper.isDefined(columns.find(column => this.isPresented(column)));
  }

  get hideHeader(): boolean {
    return this.viewService.getHideHeader(this.id);
  }

  get displayedHeader(): string {
    return this.viewService.getDisplayedHeader(this.id);
  }

  protected readonly CompanyInfoRowsEnum = CompanyInfoRowsEnum;

  private updateStyles(): void {
    this._template = this.viewService.getTemplate(this.id);
    if (this._template) {
      this.styles = this.htmlSanitizer.trustHtml(`
      <style>
        app-invoice-email-payment-template-company-info {
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

      this.ch.detectChanges();
    }
  }
}
