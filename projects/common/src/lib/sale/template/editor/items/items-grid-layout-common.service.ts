import {Injectable} from '@angular/core';
import {InvoiceEmailTemplateLayoutCommonService} from '../invoice-email-template-layout-common.service';
import {GridAreaModel} from '../../../../models/sale/template/invoice-template.model';
import {TemplateRenderSizes} from '../../template-render-sizes';
import {GridColumnsHelper} from '../../../../helpers/grid-columns.helper';

@Injectable()
export abstract class ItemsGridLayoutCommonService extends InvoiceEmailTemplateLayoutCommonService {

  static readonly DEFAULT_RENDER_WIDTH_PX = TemplateRenderSizes.WIDTH_PX;

  readonly GRID_UNITS = GridColumnsHelper.GRID_UNITS;
  readonly MIN_COLUMN_WIDTH_PX = TemplateRenderSizes.ITEMS_MIN_COLUMN_WIDTH_PX;

  private _autoColumnWidths: boolean;
  private _editorAutoWidths: boolean;
  private _renderWidthPx: number = ItemsGridLayoutCommonService.DEFAULT_RENDER_WIDTH_PX;
  private _contentWidthPx = 0;

  abstract get advancedFieldsEnabled(): boolean;

  protected abstract readonly fixedRightWidthsPx: number[];

  protected getAutoWidths(columnCount: number): number[] {
    if (columnCount < 1) {
      return [];
    }
    const fixed = columnCount < this.fixedRightWidthsPx.length
      ? this.fixedRightWidthsPx.slice(this.fixedRightWidthsPx.length - columnCount)
      : this.fixedRightWidthsPx;
    const autoCount = columnCount - fixed.length;
    const contentWidth = this.renderWidthPx - fixed.reduce((sum, width) => sum + width, 0);
    const autoWidth = Math.max(this.MIN_COLUMN_WIDTH_PX, contentWidth / Math.max(1, autoCount));
    return [...Array(autoCount).fill(autoWidth), ...fixed];
  }

  protected getAutoColumns(layout: GridAreaModel[]): string | null {
    const fixed = this.fixedRightWidthsPx;
    return fixed.length < 2
      ? null
      : GridColumnsHelper.getAutoColumns(layout.length, `${fixed[0]}px`, `${fixed[1]}px`);
  }

  getColumns(): string | null {
    return this.getColumnsFor(this.layout);
  }

  getColumnsFor(layout: GridAreaModel[], autoColumnWidths: boolean = this.autoColumnWidths): string | null {
    return autoColumnWidths
      ? this.getAutoColumns(layout)
      : GridColumnsHelper.getWeightedColumns(layout, this.MIN_COLUMN_WIDTH);
  }

  get MIN_COLUMN_WIDTH(): string {
    return `${this.MIN_COLUMN_WIDTH_PX}px`;
  }

  get renderWidthPx(): number {
    return this._renderWidthPx;
  }

  get unitWidthPx(): number {
    return this._renderWidthPx / this.GRID_UNITS;
  }

  get gridWidthPx(): number {
    return Math.max(this._renderWidthPx, this._contentWidthPx);
  }

  setRenderWidth(widthPx: number): void {
    this._renderWidthPx = widthPx > 0 ? widthPx : ItemsGridLayoutCommonService.DEFAULT_RENDER_WIDTH_PX;
    this._contentWidthPx = 0;
  }

  setContentWidth(widthPx: number): void {
    this._contentWidthPx = Math.max(0, widthPx);
  }

  setRenderTypography(fontSizePt: number, lineHeight: number): void {
    if (fontSizePt > 0) {
      this._fontSize = fontSizePt;
    }
    if (lineHeight > 0) {
      this._lineHeight = lineHeight;
    }
  }

  get lineHeight(): number {
    return this._lineHeight ?? 1.5;
  }

  addItem(layout: GridAreaModel[], componentRef): boolean {
    const lastX = layout.reduce((max, item) => Math.max(max, item.x ?? 0), -1);
    layout.push({cols: 1, id: componentRef, rows: 1, x: lastX + 1, y: 0});
    this.applyEditorUnits(layout);
    return false;
  }

  deleteItem(layout: GridAreaModel[], id) {
    const removed = super.deleteItem(layout, id);
    this.applyEditorUnits(layout);
    return removed;
  }

  applyEditorUnits(layout: GridAreaModel[], measuredWidths?: number[]): void {
    if (!layout?.length) {
      return;
    }
    if (!this.editorAutoWidths) {
      GridColumnsHelper.fitToUnits(layout, this.GRID_UNITS, this.getMinUnits(layout.length));
      return;
    }
    const widths = measuredWidths?.length === layout.length ? measuredWidths : this.getAutoWidths(layout.length);
    GridColumnsHelper.applyUnits(layout, GridColumnsHelper.toUnits(widths, this.GRID_UNITS, 1));
  }

  get editorAutoWidths(): boolean {
    return this._editorAutoWidths ?? this.autoColumnWidths;
  }

  setEditorAutoWidths(value: boolean): void {
    this._editorAutoWidths = value;
  }

  getMinUnits(columnCount: number): number {
    const byMinWidth = Math.ceil(this.MIN_COLUMN_WIDTH_PX / this.unitWidthPx);
    const evenShare = Math.floor(this.GRID_UNITS / Math.max(1, columnCount));
    return Math.max(1, Math.min(byMinWidth, evenShare));
  }

  get autoColumnWidths(): boolean {
    return this._autoColumnWidths;
  }

  set autoColumnWidths(value: boolean) {
    this._autoColumnWidths = value;
  }
}
