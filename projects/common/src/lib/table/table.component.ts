import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ComponentWithSubscriptions} from '../components/component-with-subscriptions';
import {Router} from '@angular/router';
import {TableViewSettingsService} from '../utils/table-view-settings.service';
import {FilterComponent} from './filter/filter.component';
import {Observable} from 'rxjs';
import {ObjectOperatingService} from '../utils/object-operating.service';
import {page_sizes} from '../common-environment';
import {finalize} from 'rxjs/operators';
import {isDefined} from "../helpers/object.helper";
import {isEmptyString} from "../helpers/string.helper";
import cloneDeep from 'lodash/cloneDeep';
import {FileService} from "../utils/file.service";
import { v4 as uuid } from 'uuid';

@Component({
  standalone: false,
  selector: 'app-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends ComponentWithSubscriptions implements OnInit, AfterViewInit {

  @Input('headers') set headers(headers: ExtendedTableHeader[]) {
    this._headers = headers;
    headers.forEach((header, index) => {
      this.collapsedMap.set(index, this.tableViewSettingsService.getCollapsedStateSettings(this.tableName, header.key));
    });

    const defaultSortHeader = this.headers.find(header => isDefined(header.sortOrder) && header.sortOrder != '');
    this._sort = this.tableViewSettingsService.getSortValue(this.tableName, defaultSortHeader);
  }

  get headers(): ExtendedTableHeader[] {
    return this._headers || [];
  }

  constructor(protected elementRef: ElementRef,
              protected router: Router,
              protected tableViewSettingsService: TableViewSettingsService,
              protected cd: ChangeDetectorRef,
              protected fileService: FileService) {
    super();
    this.id = uuid();
    this.tableName = this.router.url + '/' + this.elementRef.nativeElement.tagName.toLowerCase();
  }

  get needToUpdateCollapsedState(): boolean {
    return this._needToUpdateCollapsedState;
  }

  get sortProperty(): string {
    return this._sort.sortProperty;
  }

  get sortOrder(): string {
    return this._sort.sortOrder;
  }

  get isSortOrderASC(): boolean {
    return this.sortOrder == 'asc';
  }

  set sortProperty(sortField: string) {
    this._sort.sortProperty = sortField;
  }

  set sortOrder(sortOrder: string) {
    this._sort.sortOrder = sortOrder;
  }

  get pageSizes(): number[] {
    return page_sizes;
  }
  private _headers: ExtendedTableHeader[] = [];
  private _sort: TableSort;
  @Input() filters: ExtendedTableFilter[] = [];
  @Input() buttonsPanelTemplate: TemplateRef<any>;
  @Input() rowTemplate: TemplateRef<any>;

  @Input() objectOperatingService: ObjectOperatingService;

  id;

  perPage = 20;

  protected filterMap = new Map();

  elements: any[] = [];
  currentPage = 1;
  totalElements = 0;
  loading = true;

  private _needToUpdateCollapsedState = false;
  protected collapsedMap = new Map();
  private tableName;
  private _max = Math.pow(2, 31) - 1;
  @ViewChild('table', { static: true }) table: ElementRef;
  @ViewChildren(FilterComponent) private _filterComponents: QueryList<FilterComponent>;

  get filterComponents(): QueryList<FilterComponent>{
    return this._filterComponents || new QueryList<FilterComponent>();
  }

  ngOnInit() {
    this.perPage = Number(this.tableViewSettingsService.getPerPageValue(this.tableName)) || 20;
    this.refresh();
  }

  ngAfterViewInit(): void {
    this.updateCollapsedState();

    this.filterMap.forEach((value: string | string[], property: string | string[]) => {
      const fc = this.filterComponents.find(filterComponent =>
        JSON.stringify(filterComponent.filterProperty) === JSON.stringify(property));
      if (fc) {
        fc.filterValue = value;
      }
    });

    this.cd.detectChanges();

  }

  refresh() {
    this.currentPage = 1;
    this.elements = [];
    this.getPage(this.currentPage);
    return false;
  }

  getPage(page) {
    this.loading = true;
    this.subscriptions.add(
      this.getAllWithPaging(page)
        .pipe(finalize(() => {
          this.loading = false;
          this._needToUpdateCollapsedState = true;
          this.cd.detectChanges();
        }))
        .subscribe(res => {
          this.elements = this.getFromResponse(res);
          this.totalElements = res.totalElements;
          this.currentPage = page;
          this.onResult(res);
        })
    );
  }

  getAllWithPaging(page): Observable<any> {
    return this.objectOperatingService.getAllWithPaging(page - 1, this.perPage, this.filterMap, this.sortProperty, this.sortOrder);
  }

  getFromResponse(res) {
    return this.objectOperatingService.getFromResponse(res);
  }

  protected onResult(res) {
  }

  onFilterChange(e) {
    if (isDefined(e.filterProperty)) {
      if (Array.isArray(e.filterProperty)) {
        e.filterProperty.forEach((p, i) => {
          this.updateFilter(e.filterProperty[i], e.value ? e.value[i] : null);
        });
      } else if (Array.isArray(e.value)) {
        this.updateFilter(e.filterProperty, e.value.filter(v => isDefined(v)));
      } else {
        this.updateFilter(e.filterProperty, e.value);
      }
      this.currentPage = 1;
      this.getPage(this.currentPage);
    }
  }

  onChangePerPage(perPage) {
    this.perPage = perPage;
    this.tableViewSettingsService.updatePerPageValue(this.tableName, this.perPage);
    this.refresh();
  }

  private updateFilter(filterProperty, filterValue) {
    if (isDefined(filterValue) && !isEmptyString(filterValue)) {
      this.setFilter(filterProperty, filterValue);
    } else {
      this.deleteFilter(filterProperty);
    }
  }

  private setFilter(property, value) {
    this.filterMap.set(property, value);
  }

  private deleteFilter(property) {
    if (Array.isArray(property)) {
      property.forEach((p, i) => {
        this.filterMap.delete(p);
      });
    } else {
      this.filterMap.delete(property);
    }
  }

  onSortChange(header: ExtendedTableHeader) {
    if (this.isDefined(header.sortProperty)) {
      if (this.sortProperty === header.sortProperty) {
        this.sortOrder = this.isSortOrderASC ? 'desc' : 'asc';
      } else {
        this.sortProperty = header.sortProperty;
        this.sortOrder = 'asc';
      }
      this.tableViewSettingsService.updateSortValue(this.tableName, this._sort);
      this.getPage(this.currentPage);
    }
  }

  onCollapseButton(index) {
    const htmlTable = <HTMLTableElement>this.table.nativeElement;
    for (let i = 0; i < htmlTable.rows.length; i++) {
      const toggleIndex = this.findToggleIndex(htmlTable.rows.item(i), index);
      if (isDefined(htmlTable.rows.item(i).cells[toggleIndex])) {
        htmlTable.rows.item(i).cells[toggleIndex].classList.toggle('collapsed');
      }
    }
    const collapsed = htmlTable.rows.item(0).cells.item(index).classList.contains('collapsed');
    this.collapsedMap.set(index, collapsed);

    this.tableViewSettingsService.updateCollapsedStateSettings(this.tableName, this.headers[index].key, collapsed);
    return false;
  }

  private findToggleIndex(row: HTMLTableRowElement, index) {
    let toggleIndex = 0;
    let i = 0;
    while (i < index) {
      i += row.cells.item(toggleIndex).colSpan;
      toggleIndex++;
    }
    return toggleIndex;
  }

  private updateCollapsedState() {
    const htmlTable = <HTMLTableElement>this.table.nativeElement;
    for (let i = 0; i < htmlTable.rows.length; i++) {
      const row = htmlTable.rows.item(i);
      this.collapsedMap.forEach((value, key) => {
        if (value) {
          const collapsedIndex = this.findToggleIndex(row, key);
          if (isDefined(htmlTable.rows.item(i).cells.item(collapsedIndex))) {
            htmlTable.rows.item(i).cells.item(collapsedIndex).classList.add('collapsed');
          }
        }
      });
    }
    this._needToUpdateCollapsedState = false;
  }

  isCollapsed(index) {
    return this.collapsedMap.get(index);
  }

  isHeaderASC(sortPropertyName) {
    return isDefined(sortPropertyName) && sortPropertyName === this.sortProperty && this.isSortOrderASC;
  }

  isHeaderDESC(sortPropertyName) {
    return isDefined(sortPropertyName) && sortPropertyName === this.sortProperty && !this.isSortOrderASC;
  }

  setStaticFilter(key, value) {
    this.setFilter(key, value);
  }

  removeStaticFilter(key) {
    this.deleteFilter(key);
  }

  clearFilters() {
    this.filterComponents.forEach(component => {
      component.reset();
      this.deleteFilter(component.filterProperty);
    });
    this.refresh();
    return false;
  }


  get hasFilters(): boolean {
    return isDefined(
      Array.from(this.filterMap.keys())
                .find(key => this.filterComponents.map(filterComponent => filterComponent.filterProperty)
                      .find(filterProperty => filterProperty === key)
        ));
  }

  get filterValues(): Map<string,string>{
    return cloneDeep(this.filterMap);
  }


  get filterValuesWithCollapsedState(): Map<string, string>{
    const filterValues = this.filterValues;

    const cols = [...this.collapsedMap.entries()]
        .filter(col => col[1] == true)
        .map(col => `${this.headers[col[0]].key}Collapsed`);

    cols.forEach(col => {
      filterValues.set(col, String(true));
    });

    return filterValues;
  }


  export() {
    this.loading = true;

    this.subscriptions.add(this.objectOperatingService.export(this.filterValuesWithCollapsedState, this.sortProperty, this.sortOrder)
      .pipe(finalize(() => {
        this.loading = false;
        this.cd.detectChanges();
      }))
      .subscribe(data => {
        this.fileService.guessTypeAndDownloadFile(data.name, data.value);
      }));
  }
}


export class ExtendedTableHeader {
  key;
  value = '';
  sortProperty = null;
  width ? = null;
  sortOrder ? = null;
  collapsible  = true;
  template?: TemplateRef<any>

  constructor(init?: Partial<ExtendedTableHeader>) {
    Object.assign(this, init);
  }
}

export class ExtendedTableFilter {
  filterProperty;
  componentType;
  componentParams;
}

export class TableSort {
  sortProperty: string;
  sortOrder: string;
}
