import {Component} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {TextSearchTypeEnum, TextSearchTypeEnumValue} from '../../enums/utils/text-search-type.enum';
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-extended-filter-input',
  template: `<select [ngModel]="searchType"
                     (ngModelChange)="onSearchTypeChange($event)" class="form-control qbo-form-control filter mb-1">
    <option *ngFor="let type of searchTypes" [value]="type">
      {{TextSearchTypeEnumValue.get(type)}}
    </option>
  </select>
  <input class="qbo-form-control form-control filter" [placeholder]="placeholder" [ngModel]="searchString"
         (ngModelChange)="onSearchStringChange($event)"/>`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterWithSearchTypeComponent extends FilterBaseComponent {
  placeholder;

  TextSearchTypeEnum = TextSearchTypeEnum;
  TextSearchTypeEnumValue = TextSearchTypeEnumValue;

  protected _filterValue: any[] = [null, TextSearchTypeEnum.STARTS_WITH];

  private _searchTypes = [];

  set params(params: any) {
    this.placeholder = params.placeholder;
    this._searchTypes = params.searchTypes || Object.keys(this.TextSearchTypeEnum);
  }

  onFilterChange(value) {
    if (isDefined(this.searchString) && this.searchString != '') {
      this.debouncer.next(value);
    } else {
      this.debouncer.next(null);
    }

  }

  onSearchStringChange(value) {
    this.searchString = value;
    this.onFilterChange(this.filterValue);
  }

  onSearchTypeChange(value) {
    this.searchType = value;
    if (this.searchString) {
      this.onFilterChange(this.filterValue);
    }
  }

  get searchTypes() {
    return this._searchTypes;
  }

  get searchString() {
    return this._filterValue[0];
  }

  set searchString(value: string) {
    this._filterValue[0] = value;
  }

  get searchType() {
    return this._filterValue[1];
  }

  set searchType(value: TextSearchTypeEnum) {
    this._filterValue[1] = value;
  }

  reset() {
    this._filterValue = [null, TextSearchTypeEnum.STARTS_WITH];
  }
}
