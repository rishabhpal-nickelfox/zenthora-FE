import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {CustomFieldsTableTemplateLayoutService} from './custom-fields-table-template-layout.service';
import {FormPageStateService} from "../../../../utils/form-page-state.service";
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {CustomFieldsTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {GridColumnsHelper} from "../../../../helpers/grid-columns.helper";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFieldsComponent extends InvoiceEmailTemplateAbstractComponent implements OnInit {
  private _template: CustomFieldsTemplateModel;

  constructor(protected viewService: CustomFieldsTableTemplateLayoutService, protected ch: ChangeDetectorRef, private readonly htmlSanitizer: HtmlSanitizerService) {
    super(ch);
  }

  ngOnInit() {
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

  get customFields() {
    return this._template?.customFields ?? [];
  }

  private updateStyles() {
    this._template = this.viewService.getTemplate(this.id);
    if (this._template) {
      this.styles = this.htmlSanitizer.trustHtml(`
                  <style>

                      app-invoice-email-payment-template-custom-fields {
                      .${this.id}{
                        --border: ${this.viewService.getBorderFromColor(this._template.borderColor)};
                        --fontColor: ${this._template.fontColor};
                        --colorOdd: ${this._template.colorOdd};
                        --titleColor: ${this._template.titleColor};

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
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
                      }
                      </style>`);
      this.ch.detectChanges();
    }
  }


  getOrder(colId): number {
    return GridColumnsHelper.getColumnOrder(this.customFields, colId);
  }

}
