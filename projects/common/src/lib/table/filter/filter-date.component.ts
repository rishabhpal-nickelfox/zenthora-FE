import {Component, ViewChild} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {ExtendedDatePickerComponent} from '../../components/datepicker/extended-date-picker.component';
import {DEFAULT_DATE_CONFIG, SERVER_SHORT_DATE_FORMAT} from "../../helpers/date.helper";

import {DateTime} from 'luxon';

@Component({
  standalone: false,
  selector: 'app-new-extended-filter-date',
  template: `
    <div class="p-2">
      <app-extended-datepicker [ngModel]="getFilterDate()" (ngModelChange)="onFilterChange($event)" #filter
                               [ngClass]="{'has-error':hasError}"></app-extended-datepicker>
      <div class="val-message" *ngIf="hasError">Cannot be blank</div>
    </div>`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterDateComponent extends FilterBaseComponent {
  config = DEFAULT_DATE_CONFIG;
  nullable = true;

  @ViewChild('filter', { static: true }) filter: ExtendedDatePickerComponent;

  set params(params: any) {
    this.nullable = params.nullable;
  }

  getFilterDate() {
    return this._filterValue && this._filterValue.isValid() && !this.filter.invalidDate ? this._filterValue : null;
  }

  onFilterChange(value) {
    this._filterValue = value;
    this.debouncer.next(this.filterValue);
  }

  get hasError() {
    return !this.nullable && !this.filter.stringModel;
  }

  get filterValue() {
    if (this.getFilterDate()) {
      return this.getFilterDate().format(SERVER_SHORT_DATE_FORMAT);
    } else {
      return null;
    }
  }

  reset() {
    this._filterValue = null;
  }
}
