import {Component, OnInit, ViewChild} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {ExtendedDatePickerComponent} from '../../components/datepicker/extended-date-picker.component';
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-filter-timestamp-range-open-boundaries',
  template: `
    <div class="d-flex flex-column">
      <app-extended-datepicker [ngModel]="filterFrom" #filterFromComponent (ngModelChange)="onFilterFromChange($event)"
                               [class.has-error]="fromHasError"
                               [placeholder]="'From'"></app-extended-datepicker>
      <app-extended-datepicker [ngModel]="filterTo" #filterToComponent (ngModelChange)="onFilterToChange($event)"
                               [class.has-error]="toHasError"
                               [placeholder]="'To'"></app-extended-datepicker>
    </div>`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterTimestampRangeOpenBoundariesComponent extends FilterBaseComponent implements OnInit {
  nullable = true;

  @ViewChild('filterFromComponent', { static: true }) filterFromComponent: ExtendedDatePickerComponent;
  @ViewChild('filterToComponent', { static: true }) filterToComponent: ExtendedDatePickerComponent;

  set params(params: any) {
    this.nullable = isDefined(params.nullable) ? params.nullable : this.nullable;
  }

  get filterFrom() {
    return this._filterValue ? this._filterValue[0] : null;
  }

  get filterTo() {
    return this._filterValue ? this._filterValue[1] : null;
  }

  get fromHasError() {
    return !this.nullable && !isDefined(this.filterFrom) && isDefined(this.filterTo);
  }

  get toHasError() {
    return !this.nullable && isDefined(this.filterFrom) && !isDefined(this.filterTo);
  }

  onFilterFromChange(date) {
    this._filterValue[0] = date && !date.invalidDate ? date.startOf('day') : date;
    if (!this.filterFromComponent.invalidDate) {
      this.onFilterChange();
    }
  }

  onFilterToChange(date) {
    this._filterValue[1] = date && !date.invalidDate ? date.date(date.date() + 1).startOf('day') : date;
    if (!this.filterToComponent.invalidDate) {
      this.onFilterChange();
    }
  }

  onFilterChange() {
    const fromString = this._filterValue[0] ? this._filterValue[0].toISOString() : null;
    const toString = this._filterValue[1] ? this._filterValue[1].toISOString() : null;
    if (this.nullable || fromString && toString || !fromString && !toString) {
      this.debouncer.next([fromString, toString]);
    }
  }

  ngOnInit(): void {
    this._filterValue = [null, null];
  }

  reset() {
    this._filterValue = [null, null];
  }
}
