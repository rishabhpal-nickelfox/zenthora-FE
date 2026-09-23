import {Inject, Injectable} from '@angular/core';
import {TableSettingsEnum} from '../enums/utils/table-settings.enum';
import {ExtendedTableHeader, TableSort} from '../table/table.component';
import {isDefined} from "../helpers/object.helper";
import {isEmptyString} from "../helpers/string.helper";
import {BaseCurrentDataService} from "./base-current-data.service";

@Injectable()
export abstract class TableViewSettingsService {

  constructor(protected currentDataService: BaseCurrentDataService) {
  }

  getCollapsedStateSettings(tableName: string, columnKey: string): boolean {
    return !!this.getTableSettings(tableName, columnKey + TableSettingsEnum.COLUMN_IS_COLLAPSED);
  }

  getPerPageValue(tableName: string): string {
    return this.getTableSettings(tableName, TableSettingsEnum.PER_PAGE);
  }

  getSortValue(tableName: string, defaultSortHeader: ExtendedTableHeader): TableSort {
    const sortSettings = this.getTableSettings(tableName, TableSettingsEnum.SORT);
    if (isDefined(sortSettings) && !isEmptyString(sortSettings)) {
      return JSON.parse(sortSettings);
    } else if (defaultSortHeader) {
      return {sortProperty: defaultSortHeader.sortProperty, sortOrder: defaultSortHeader.sortOrder};
    }
    return {sortProperty: null, sortOrder: 'asc'};

  }

  updateCollapsedStateSettings(tableName: string, columnKey: string, collapsed: boolean): void {
    const tableColumnCollapsedSettingsName = this.getTableSettingsName(tableName, columnKey + TableSettingsEnum.COLUMN_IS_COLLAPSED);
    if (isDefined(tableColumnCollapsedSettingsName)) {
      if (collapsed) {
        localStorage.setItem(tableColumnCollapsedSettingsName, '1');
      } else {
        localStorage.removeItem(tableColumnCollapsedSettingsName);
      }
    }

  }

  updatePerPageValue(tableName: string, value): void {
    const tablePerPageSettingsName = this.getTableSettingsName(tableName, TableSettingsEnum.PER_PAGE);
    if (isDefined(tablePerPageSettingsName)) {
      localStorage.setItem(tablePerPageSettingsName, value);
    }
  }

  updateSortValue(tableName: string, sort: TableSort): void {
    const tableSortSettingsName = this.getTableSettingsName(tableName, TableSettingsEnum.SORT);
    if (isDefined(tableSortSettingsName)) {
      localStorage.setItem(tableSortSettingsName, JSON.stringify(sort));
    }
  }

  private getTableSettingsName(tableName: string, key: string) {
    return `${this.currentDataService.prefix}_${tableName}_${key}`;
  }

  private getTableSettings(tableName: string, key: string) {
    const tableSettingsName = this.getTableSettingsName(tableName, key);
    return localStorage.getItem(tableSettingsName) ?? null;
  }
}
