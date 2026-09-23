import {Component, OnInit, ViewChild} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {ExtendedDatePickerComponent} from '../../components/datepicker/extended-date-picker.component';
import {isDefined} from "../../helpers/object.helper";
import {SERVER_SHORT_DATE_FORMAT} from "../../helpers/date.helper";

@Component({
  standalone: false,
  selector: 'app-filter-date-range-open-boundaries',
  template: `
    <div class="d-flex flex-column">
      <app-extended-datepicker [ngModel]="filterFrom" #filterDateFromComponent (ngModelChange)="onFilterFromChange($event)"
                               class="pb-1"
                               [placeholder]="'From'"></app-extended-datepicker>
      <app-extended-datepicker [ngModel]="filterTo" #filterDateToComponent (ngModelChange)="onFilterToChange($event)"
                               [placeholder]="'To'"></app-extended-datepicker>
    </div>`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterDateRangeOpenBoundariesComponent extends FilterBaseComponent implements OnInit {
  nullable = true;

  @ViewChild('filterDateFromComponent', { static: true }) filterDateFromComponent: ExtendedDatePickerComponent;
  @ViewChild('filterDateToComponent', { static: true }) filterDateToComponent: ExtendedDatePickerComponent;

  set params(params: any) {
    this.nullable = isDefined(params.nullable) ? params.nullable : this.nullable;
  }

  get filterFrom() {
    return this._filterValue ? this._filterValue[0] : null;
  }

  get filterTo() {
    return this._filterValue ? this._filterValue[1] : null;
  }

  onFilterFromChange(date) {
    this._filterValue[0] = date;
    if (!this.filterDateFromComponent.invalidDate) {
      this.onFilterChange();
    }
  }

  onFilterToChange(date) {
    this._filterValue[1] = date;
    if (!this.filterDateToComponent.invalidDate) {
      this.onFilterChange();
    }
  }

  onFilterChange() {
    this.debouncer.next(this.filterValue);
  }

  get filterValue() {
    return [this._filterValue[0] ? this._filterValue[0].format(SERVER_SHORT_DATE_FORMAT) : null,
      this._filterValue[1] ? this._filterValue[1].format(SERVER_SHORT_DATE_FORMAT) : null];
  }

  ngOnInit(): void {
    this._filterValue = [null, null];
  }

  reset() {
    this._filterValue = [null, null];
  }
}
