import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import * as moment from 'moment-timezone';
import {NgbCalendar, NgbDatepickerConfig, NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {Moment} from "moment";
import {Mask} from "../../helpers/mask";
import {convertDateMaskToString, SDF} from "../../helpers/date.helper";
import {isDefined, ObjectHelper} from "../../helpers/object.helper";
import {ErrorService} from "../../utils/errorhandler/error.service";

@Component({
  standalone: false,
  selector: 'app-extended-datepicker',
  templateUrl: './extended-date-picker.component.html',
  styleUrls: ['./extended-date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExtendedDatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ExtendedDatePickerComponent),
      multi: true,
    },
    NgbDatepickerConfig
  ]

})
export class ExtendedDatePickerComponent implements OnInit, ControlValueAccessor, Validator {
  stringModel = null;
  calendarModel = null;
  timeModel = null;

  mask = new Mask().DATE_MMDDYYYY;
  maskToString = '';
  invalidDate = false;
  invalidDateErrorMessage;
  isDisabled = false;

  @Input() placeholder = 'MM/DD/YYYY';

  @Input('disabled') set disabled(disabled: boolean | string) {
    this.isDisabled = ObjectHelper.isDefined(disabled) && disabled !== false && disabled !== 'false';
  }

  @Input('minDate') set minDate(minDate: Moment) {
    this.config.minDate = {day: minDate.date(), month: minDate.month() + 1, year: minDate.year()};
  }

  @Input('maxDate') set maxDate(maxDate: Moment) {
    this.config.maxDate = {day: maxDate.date(), month: maxDate.month() + 1, year: maxDate.year()};
  }

  onChange: (value: any) => void = (value) => {
  }


  constructor(popoverConfig: NgbPopoverConfig, protected config: NgbDatepickerConfig, protected calendar: NgbCalendar, public errorService: ErrorService) {
    popoverConfig.placement = 'right';

    config.minDate = {year: 1900, month: 1, day: 1};
    config.maxDate = {year: 2099, month: 12, day: 31};
    this.calendarModel = this.calendar.getToday();
    config.startDate = this.calendarModel;
    this.invalidDateErrorMessage = this.errorService.validationService.DATE;
    this.maskToString = convertDateMaskToString(this.mask);
  }

  ngOnInit(): void {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: any): void {
    let changed = false;
    if (isDefined(obj) && obj.isValid()) {
      if (this.stringModel != obj.format(SDF)) {
        changed = true;
        this.stringModel = obj.format(SDF);
        this.calendarModel = {day: obj.date(), month: obj.month() + 1, year: obj.year()};
        this.timeModel = obj.format('HH:mm:ss');
      }
    } else if (this.stringModel != null) {
      changed = true;
      this.stringModel = null;
      this.calendarModel = this.calendar.getToday();
      this.timeModel = null;
    }
    if (changed) {
      this.config.startDate = this.calendarModel;
      this.invalidDate = false;
    }
  }

  onDateSelect(t, popover) {
    const date = moment();
    date.date(t.day);
    date.month(t.month - 1);
    date.year(t.year);
    this.stringModel = date.format(SDF);
    this.timeModel = date.format('HH:mm:ss');
    this.config.startDate = t;
    popover?.close();
    this.onChange(this.value);
  }

  onInputChanged(t) {
    this.stringModel = t;
    const m = moment(t, SDF);
    this.calendarModel = m.isValid() ? {day: m.date(), month: m.month() + 1, year: m.year()} : null;
    this.timeModel = moment().format('HH:mm:ss');
    this.config.startDate = this.calendarModel;
    this.onChange(this.value);
  }

  onCalendarButtonClicked(event?: Event) {
    if (this.isDisabled) {
      event?.preventDefault();
      event?.stopPropagation();
    }
    return false;
  }

  closePopoverOnTab(e, popover) {
    if (e.code === 'Tab' || (e.shiftKey && e.key === 'Tab')) {
      popover?.close();
    }
  }

  get value() {
    const m = isDefined(this.stringModel) && this.stringModel !== '' ? moment(this.stringModel, SDF) : null;
    if (isDefined(m) && isDefined(this.timeModel)) {
      const momentTime = moment(this.timeModel, 'HH:mm:ss');
      m.hours(momentTime.get('h'));
      m.minutes(momentTime.get('m'));
      m.seconds(momentTime.get('s'));
    }
    const regexp = new RegExp(this.maskToString);
    this.invalidDate = m !== null && (!m.isValid() || !regexp.test(this.stringModel));
    return m;
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.invalidDate ? {'invalidDateFormat': ''} : null;
  }

}
