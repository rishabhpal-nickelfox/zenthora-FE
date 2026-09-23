import {AfterViewInit, ChangeDetectorRef, Directive, ElementRef, inject, ViewChild} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {FormControl} from '@angular/forms';
import {FormPageComponent} from '../../../../pages/form-page.component';
import {GridAreaModel} from '../../../../models/sale/template/invoice-template.model';
import {
  InvoiceItemsTableAdvancedColumns,
  InvoiceItemsTableColumnsEnum,
  InvoiceItemsTableColumnsEnumValue
} from '../../../../enums/sale/invoice-items-table-columns.enum';
import {GridColumnsHelper} from '../../../../helpers/grid-columns.helper';
import {ItemsGridLayoutCommonService} from './items-grid-layout-common.service';

export interface ItemsColumnField {
  control: FormControl<string>;
  property: string;
}

@Directive()
export abstract class ItemsColumnsEditComponent<TViewService extends ItemsGridLayoutCommonService>
  extends FormPageComponent implements AfterViewInit {

  layout: GridAreaModel[] = [];

  protected abstract readonly columnFields: Map<string, ItemsColumnField>;

  protected _autoColumnWidths = new FormControl<boolean>(true);

  @ViewChild('columnsProbe') protected columnsProbe: { updateLayout(): void };
  @ViewChild('columnsProbe', {read: ElementRef}) protected columnsProbeRef: ElementRef<HTMLElement>;

  private readonly _measuredWidthPx = new Map<string, number>();
  private _syncTimer;
  private _headerHeightTimer;
  private _stopResize: () => void;

  private _viewService: TViewService;

  protected readonly ch = inject(ChangeDetectorRef);

  get viewService(): TViewService {
    return this._viewService;
  }

  set viewService(value: TViewService) {
    this._viewService = value;
    this.reInit();
  }

  ngAfterViewInit(): void {
    this.syncHeaderHeights();
  }

  protected onDestroy(): void {
    clearTimeout(this._syncTimer);
    clearTimeout(this._headerHeightTimer);
    this._stopResize?.();
  }

  canAddColumn(key: string): boolean {
    const isAdvanced = InvoiceItemsTableAdvancedColumns.includes(InvoiceItemsTableColumnsEnum[key]);
    return !this.viewService.wasAdded(this.layout, key)
      && (this.viewService.advancedFieldsEnabled || !isAdvanced);
  }

  addColumn(key: string): void {
    this.viewService.addItem(this.layout, key);
    this.onColumnsChanged();
  }

  deleteColumn(key: string): void {
    this.viewService.deleteItem(this.layout, key);
    this.onColumnsChanged();
  }

  columnTitle(columnId: string, control: FormControl<string>): string {
    const name = InvoiceItemsTableColumnsEnumValue.get(columnId) ?? columnId;
    return control?.value && control.value !== name ? `${name}: ${control.value}` : name;
  }

  syncHeaderHeights(): void {
    clearTimeout(this._headerHeightTimer);
    this._headerHeightTimer = setTimeout(() => {
      const fields: HTMLTextAreaElement[] = Array.from(
        this.elementRef.nativeElement.querySelectorAll('.columns-row .th textarea'));
      if (!fields.length) {
        return;
      }
      fields.forEach(field => field.style.height = 'auto');
      const borders = fields.map(field => field.offsetHeight - field.clientHeight);
      const tallest = Math.max(...fields.map(field => field.scrollHeight));
      fields.forEach((field, index) => field.style.height = `${tallest + borders[index]}px`);
    });
  }

  protected initColumns(layout: GridAreaModel[]): void {
    this._autoColumnWidths.reset(this.viewService.autoColumnWidths ?? true);
    this.viewService.setEditorAutoWidths(this._autoColumnWidths.value);
    this.viewService.applyEditorUnits(layout);
    this.layout = GridColumnsHelper.sortByX(layout);
    this.subscriptions.add(this._autoColumnWidths.valueChanges.subscribe(value => {
      this.viewService.setEditorAutoWidths(value);
      this.syncColumnWidths();
    }));
    this.syncColumnWidths();
  }

  protected saveColumns(): void {
    this.viewService.autoColumnWidths = this._autoColumnWidths.value;
    this.viewService.layout = this.layout;
  }

  protected columnWidthPx(item: GridAreaModel): number {
    return this._measuredWidthPx.get(item.id) ?? (item.cols ?? 1) * this.viewService.unitWidthPx;
  }

  protected onColumnWidthsChanged(): void {
  }

  protected onColumnDrop(event: CdkDragDrop<GridAreaModel[]>): void {
    if (GridColumnsHelper.reorder(this.layout, event.previousIndex, event.currentIndex)) {
      this.syncColumnWidths();
    }
  }

  protected startResize(event: PointerEvent, index: number): void {
    if (this._autoColumnWidths.value || !this.layout[index] || !this.layout[index + 1]) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const startCols = this.layout.map(item => item.cols ?? 1);
    const startX = event.clientX;
    const minUnits = this.viewService.getMinUnits(this.layout.length);

    const move = (moveEvent: PointerEvent) => {
      const delta = Math.round((moveEvent.clientX - startX) / this.viewService.unitWidthPx);
      const cols = [...startCols];
      const draggingRight = delta > 0;
      const indexes = cols.map((width, i) => i);
      const donors = draggingRight ? indexes.slice(index + 1) : indexes.slice(0, index + 1).reverse();
      const receiver = draggingRight ? index : index + 1;
      let taken = 0;
      donors.forEach(donor => {
        const give = Math.min(Math.abs(delta) - taken, cols[donor] - minUnits);
        if (give > 0) {
          cols[donor] -= give;
          taken += give;
        }
      });
      cols[receiver] += taken;

      this.layout.forEach((item, i) => item.cols = cols[i]);
      GridColumnsHelper.applyOrder(this.layout);
      this.onColumnWidthsChanged();
      this.ch.detectChanges();
    };

    this.trackPointerDrag(move, () => this.syncColumnWidths());
  }

  protected trackPointerDrag(move: (event: PointerEvent) => void, done?: () => void): void {
    this._stopResize?.();
    const stop = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', stop);
      this._stopResize = null;
      done?.();
    };
    this._stopResize = stop;
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stop);
  }

  protected syncColumnWidths(): void {
    this.ch.detectChanges();
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => this.applyColumnWidths());
  }

  private onColumnsChanged(): void {
    this.getForm().updateValueAndValidity();
    this.syncColumnWidths();
  }

  private applyColumnWidths(): void {
    const measured = this._autoColumnWidths.value ? this.measurePreviewWidths() : [];
    const totalPx = measured.reduce((sum, width) => sum + width, 0);

    this._measuredWidthPx.clear();
    if (totalPx > 0 && measured.length === this.layout.length) {
      this.layout.forEach((item, index) => this._measuredWidthPx.set(item.id, measured[index]));
    }
    this.viewService.setContentWidth(totalPx);
    this.viewService.applyEditorUnits(this.layout, measured);

    this.onColumnWidthsChanged();
    this.ch.detectChanges();
    this.syncHeaderHeights();
  }

  private measurePreviewWidths(): number[] {
    this.columnsProbe?.updateLayout();
    const table = this.columnsProbeRef?.nativeElement?.querySelector('.table') as HTMLElement;
    if (!table) {
      return [];
    }
    return getComputedStyle(table).gridTemplateColumns
      .split(' ')
      .map(width => parseFloat(width))
      .filter(width => !isNaN(width));
  }
}
