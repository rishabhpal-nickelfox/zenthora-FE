import {IDatePickerConfig} from 'ng2-date-picker';
import * as moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

export const SDFM = 'MMM, YYYY';
export const SDF = 'MM/DD/YYYY';
export const LONG_DATE = "LL";
export const SDFT = 'MM/DD/YYYY HH:mm:ss';
export const SERVER_SHORT_DATE_FORMAT = 'YYYY-MM-DD';

export const MAX_DAYS = 100000;

export const DEFAULT_DATE_CONFIG: IDatePickerConfig = {
  firstDayOfWeek: 'su',
  monthFormat: SDFM,
  disableKeypress: true,
  allowMultiSelect: false,
  closeOnSelect: true,
  closeOnSelectDelay: 100,
  onOpenDelay: 0,
  weekDayFormat: 'ddd',
  drops: 'down',
  opens: 'right',
  showNearMonthDays: true,
  showWeekNumbers: false,
  enableMonthSelector: true,
  format: SDF,
  yearFormat: 'YYYY',
  showGoToCurrent: true,
  dayBtnFormat: 'DD',
  monthBtnFormat: 'MMM',
  hours12Format: 'hh',
  hours24Format: 'HH',
  meridiemFormat: 'A',
  minutesFormat: 'mm',
  minutesInterval: 1,
  secondsFormat: 'ss',
  secondsInterval: 1,
  showSeconds: false,
  showTwentyFourHours: true,
  timeSeparator: ':',
  multipleYearsNavigateBy: 10,
  showMultipleYearsNavigation: false
};

export const DEFAULT_MONTH_CONFIG = function () {
  const c = cloneDeep(DEFAULT_DATE_CONFIG);
  c.format = c.monthFormat;
  return c;
};

export function convertToDate(d, format?) {
  if (!(moment.isDate(d))) {
    return moment(d, format).toDate();
  }
  return d;
}

export function toISO(d) {
  return moment(d).toISOString();
}

export function formatDate(d, format) {
  return moment(d).format(format);
}

export function convertDateMaskToString(mask) {
 let maskToString = '^';
    mask.forEach(m => {
        if (m.toString() == '/\\d/') {
          maskToString += '\\d';
        }
        else {
          maskToString += m;
        }
      }
    );
    maskToString += '$';
    return maskToString;
}
