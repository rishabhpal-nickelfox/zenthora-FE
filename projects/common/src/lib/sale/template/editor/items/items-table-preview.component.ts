import {Directive, Input} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from '../invoice-email-template-abstract.component';
import {GridAreaModel} from '../../../../models/sale/template/invoice-template.model';
import {ItemsGridLayoutCommonService} from './items-grid-layout-common.service';

@Directive()
export abstract class ItemsTablePreviewComponent<TViewService extends ItemsGridLayoutCommonService>
  extends InvoiceEmailTemplateAbstractComponent {

  @Input() previewLayout: GridAreaModel[];
  @Input() previewAutoColumnWidths: boolean;

  protected abstract viewService: TViewService;

  getColumns(): string | null {
    return this.previewLayout
      ? this.viewService.getColumnsFor(this.previewLayout, this.previewAutoColumnWidths)
      : this.viewService.getColumns();
  }

  protected get currentLayout(): GridAreaModel[] {
    return this.previewLayout ?? this.viewService.layout;
  }

  protected get currentAutoColumnWidths(): boolean {
    return this.previewLayout ? this.previewAutoColumnWidths : this.viewService.autoColumnWidths;
  }
}
