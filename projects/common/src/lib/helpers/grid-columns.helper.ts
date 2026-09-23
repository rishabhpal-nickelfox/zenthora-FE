import {GridAreaModel} from '../models/sale/template/invoice-template.model';

export class GridColumnsHelper {

  static readonly GRID_UNITS = 96;

  // memo, labels and amount take at least one column each
  static readonly MIN_LABEL_COLUMN = 2;
  static readonly MIN_AMOUNT_COLUMN = 3;

  static getWeightedColumns(layout: GridAreaModel[], minWidth: string): string {
    return GridColumnsHelper.sortByX(layout)
      .map(item => `minmax(${minWidth}, ${item.cols ?? 1}fr)`)
      .join(' ');
  }

  // spans are counted from the right, returns 1-based start columns
  static normalizeTotalsSplit(columnCount: number, labelColumnSpan?: number, amountColumnSpan?: number)
    : { labelStart: number, amountStart: number } {
    const amountStart = Math.max(columnCount + 1 - (amountColumnSpan ?? 1), GridColumnsHelper.MIN_AMOUNT_COLUMN);
    const labelStart = Math.max(amountStart - (labelColumnSpan ?? 1), GridColumnsHelper.MIN_LABEL_COLUMN);
    return {labelStart, amountStart};
  }

  // widths of memo, labels and amount in grid units
  static getTotalsSplitUnits(layout: GridAreaModel[], labelColumnSpan?: number, amountColumnSpan?: number)
    : { memo: number, label: number, amount: number } {
    const items = GridColumnsHelper.sortByX(layout);
    const {labelStart, amountStart} =
      GridColumnsHelper.normalizeTotalsSplit(items.length, labelColumnSpan, amountColumnSpan);
    return {
      memo: GridColumnsHelper.sumUnits(items.slice(0, labelStart - 1)),
      label: GridColumnsHelper.sumUnits(items.slice(labelStart - 1, amountStart - 1)),
      amount: GridColumnsHelper.sumUnits(items.slice(amountStart - 1))
    };
  }

  static getWeightedTotalsColumns(layout: GridAreaModel[], minWidth: string,
                                  labelColumnSpan?: number, amountColumnSpan?: number): string {
    const {label, amount} = GridColumnsHelper.getTotalsSplitUnits(layout, labelColumnSpan, amountColumnSpan);
    return `${GridColumnsHelper.weightedTrack(minWidth, label)} ${GridColumnsHelper.weightedTrack(minWidth, amount)}`;
  }

  static getWeightedMemoTotalsColumns(layout: GridAreaModel[], minWidth: string,
                                      labelColumnSpan?: number, amountColumnSpan?: number): string {
    const {memo, label, amount} = GridColumnsHelper.getTotalsSplitUnits(layout, labelColumnSpan, amountColumnSpan);
    return `${GridColumnsHelper.weightedTrack(minWidth, memo)} ${GridColumnsHelper.weightedTrack(minWidth, label + amount)}`;
  }

  static getAutoMemoTotalsColumns(beforeLastWidth: string, lastWidth: string): string {
    return `minmax(0, 1fr) calc(${beforeLastWidth} + ${lastWidth})`;
  }

  static getAutoColumns(columnCount: number, beforeLastWidth: string, lastWidth: string): string {
    const tracks: string[] = [];
    for (let i = 0; i < columnCount - 2; i++) {
      tracks.push('minmax(0, auto)');
    }
    if (columnCount > 1) {
      tracks.push(GridColumnsHelper.shrinkable(beforeLastWidth));
    }
    tracks.push(GridColumnsHelper.shrinkable(lastWidth));
    return tracks.join(' ');
  }

  static getAutoTotalsColumns(beforeLastWidth: string, lastWidth: string): string {
    return `${beforeLastWidth} ${lastWidth}`;
  }

  static toUnits(widths: number[], totalUnits: number, minUnits: number): number[] {
    const count = widths.length;
    if (count < 1) {
      return [];
    }
    if (count * minUnits >= totalUnits) {
      return Array(count).fill(Math.max(1, Math.floor(totalUnits / count)));
    }
    const totalWidth = Math.max(1, widths.reduce((sum, width) => sum + width, 0));
    const exact = widths.map(width => Math.max(minUnits, width / totalWidth * totalUnits));
    const units = exact.map(value => Math.floor(value));
    const byLostFraction = exact
      .map((value, index) => index)
      .sort((a, b) => GridColumnsHelper.fraction(exact[b]) - GridColumnsHelper.fraction(exact[a]));

    let rest = totalUnits - units.reduce((sum, value) => sum + value, 0);
    for (let i = 0; i < rest; i++) {
      units[byLostFraction[i % count]]++;
    }
    const donors = [...byLostFraction].reverse();
    while (rest < 0) {
      const before = rest;
      donors.forEach(index => {
        if (rest < 0 && units[index] > minUnits) {
          units[index]--;
          rest++;
        }
      });
      if (rest === before) {
        break;
      }
    }
    return units;
  }

  static applyUnits(layout: GridAreaModel[], units: number[]): void {
    const items = GridColumnsHelper.sortByX(layout);
    items.forEach((item, index) => item.cols = units[index] ?? 1);
    GridColumnsHelper.applyOrder(items);
  }

  static fitToUnits(layout: GridAreaModel[], totalUnits: number, minUnits: number): void {
    const items = GridColumnsHelper.sortByX(layout);
    GridColumnsHelper.applyUnits(items, GridColumnsHelper.toUnits(items.map(item => item.cols ?? 1), totalUnits, minUnits));
  }

  static reorder<T extends GridAreaModel>(layout: T[], from: number, to: number): boolean {
    if (from === to || !layout?.[from] || !layout?.[to]) {
      return false;
    }
    const [moved] = layout.splice(from, 1);
    layout.splice(to, 0, moved);
    GridColumnsHelper.applyOrder(layout);
    return true;
  }

  static applyOrder(layout: GridAreaModel[]): void {
    let x = 0;
    (layout ?? []).forEach(item => {
      item.x = x;
      x += item.cols ?? 1;
    });
  }

  static sortByX(layout: GridAreaModel[]): GridAreaModel[] {
    return [...(layout ?? [])].sort((a, b) => a.x - b.x);
  }

  static getColumnOrder(layout: GridAreaModel[], colId): number {
    return GridColumnsHelper.sortByX(layout).map(col => col.id).indexOf(colId) + 1;
  }

  static hasColumn(layout: GridAreaModel[], colId): boolean {
    return (layout ?? []).some(col => col.id === colId);
  }

  // one column for grid-template-columns, width in grid units
  private static weightedTrack(minWidth: string, units: number): string {
    return `minmax(${minWidth}, ${Math.max(1, units)}fr)`;
  }

  private static sumUnits(items: GridAreaModel[]): number {
    return items.reduce((sum, item) => sum + (item.cols ?? 1), 0);
  }

  private static shrinkable(width: string): string {
    return `minmax(min-content, ${width})`;
  }

  private static fraction(value: number): number {
    return value - Math.floor(value);
  }
}
