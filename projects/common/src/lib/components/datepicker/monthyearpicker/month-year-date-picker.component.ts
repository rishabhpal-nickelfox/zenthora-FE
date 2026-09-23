import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {ErrorService} from "../../../utils/errorhandler/error.service";
import {isDefined} from "../../../helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-monthyear-datepicker',
  templateUrl: './month-year-date-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthYearDatePickerComponent),
      multi: true
    }
  ]

})
export class MonthYearDatePickerComponent implements OnInit, ControlValueAccessor {

  _minDate = moment({year: 2009, month: 0, date: 1});
  _maxDate = moment({year: 2029, month: 11, date: 31});

  @Input() disabledYear = false;
  @Input() disabledMonth = false;

  year;
  month;

  years: any[];
  months: any[];

  @Output() select = new EventEmitter<NgbDate>();
  onChange: (value: any) => void = (value) => {
  }


  constructor(public errorService: ErrorService) {

  }

  ngOnInit(): void {
    this.years = [];
    this.months = [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledMonth = isDisabled;
    this.disabledYear = isDisabled;
  }

  writeValue(obj: any): void {
    if (isDefined(obj) && obj.isValid()) {
      this.year = obj.year();
      this.month = obj.month();
    } else {
      this.year = null;
      this.month = null;
    }
    this.updateMonthsAndYearsValues();
    this.onChange(this.value);
  }

  private updateMonthsAndYearsValues() {
    this.years = this.generateYears();
    this.months = this.generateMonths();
  }

  get value() {
    if (isDefined(this.year) && isDefined(this.month)) {
      return moment({date: 1, month: this.month, year: this.year});
    } else {
      return null;
    }
  }


  private generateMonths() {
    let months = Array.apply(0, Array(12)).map((val, i) => i);

    if (this.year === this.minDate.year()) {
      const index = months.findIndex(month => month === this.minDate.month());
      months = months.slice(index);
    }

    if (this.year === this.maxDate.year()) {
      const index = months.findIndex(month => month === this.maxDate.month());
      months = months.slice(0, index + 1);
    }

    return months;
  }

  private generateYears() {
    return Array.from({length: this.maxDate.year() - this.minDate.year() + 1}, (e, i) => this.minDate.year() + i);
  }

  getMonthLabel(month) {
    return moment.monthsShort(month);
  }

  changeYear(year) {
    this.year = year === 'null' ? null : year;
    this.onChange(this.value);
  }


  changeMonth(month) {
    this.month = month === 'null' ? null : month;
    this.onChange(this.value);
  }


  set minDate(m) {
    this._minDate = m;
    this.updateMonthsAndYearsValues();
  }

  get minDate() {
    return this._minDate;
  }

  set maxDate(m) {
    this._maxDate = m;
    this.updateMonthsAndYearsValues();
  }

  get maxDate() {
    return this._maxDate;
  }
}
