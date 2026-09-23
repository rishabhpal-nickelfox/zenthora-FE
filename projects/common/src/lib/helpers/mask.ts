import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';
import {conformToMask} from 'text-mask-core/dist/textMaskCore';
import {Decimal} from 'decimal.js';
import {isDefined, isNumber} from './object.helper';
import {CountryISOEnum} from "../enums/utils/country-iso.enum";
import {isEmptyString} from "./string.helper";

export class Mask {
  static PHONE = ['+', /\d/, '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  US_PHONE = ['+', '1', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  YEAR = [/\d/, /\d/, /\d/, /\d/];
  DATE_YYYYMMDD = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
  DATE_MMDDYYYY = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  static ARRAY_FIELD_NAME = /^.*\[\d+\].*$/;
  static UNMASKED = (length: number) => Array(length).fill(/./);

  static unmaskPhone(val) {
    if (isEmptyString(val)) {
      return null;
    }

    const unmasked = this.removeMask(val);
    return `+${unmasked}`;
  }


  static maskPhone(val) {
    return Mask.transformValueToMaskedValue(val, Mask.PHONE);
  }

  static removeMask(val) {
    return !isEmptyString(val) ? val.toString().replace(/\D+/g, '') : null;
  }

  static unmaskNumber(val) {
    return !isEmptyString(val) ? val.toString().replace(/[^0-9\.\-]/g, '') : null;
  }

  static unmaskZip(val) {
    return !isEmptyString(val) ? val.toString().replace(/[^0-9\.]/g, '') : null;
  }

  static unmaskCreditCardNumber(val) {
    return !isEmptyString(val) ? val.toString().replace(/[^0-9\.\*]/g, '') : null;
  }


  static transformValueToMaskedFloat(value, numberMask, decimalMax, decimalMin) {
    if (isNumber(Mask.unmaskNumber(value))) {
      const decimalValue = new Decimal(Mask.unmaskNumber(value)).toDecimalPlaces(decimalMax);
      const decimalPlaces = decimalValue.decimalPlaces();

      let numberValue;

      if (isDefined(decimalMin) && decimalPlaces < decimalMin) {
        numberValue = decimalValue.toFixed(decimalMin);
      } else {
        numberValue = decimalValue.toString();
      }

      const mask = numberMask(numberValue).filter((val) => val !== '[]');
      return conformToMask(
        numberValue,
        mask,
        {guide: false}
      ).conformedValue;
    }
    return null;
  }


  static transformValueToMaskedValue(value, mask) {
    return isDefined(value) ? conformToMask(
      value,
      mask,
      {guide: false}
    ).conformedValue : null;
  }

  transformValueToMaskedValue(value, mask) {
    return Mask.transformValueToMaskedValue(value, mask);
  }

  US_FULL_ZIP = function (rawValue) {
    if (Mask.removeMask(rawValue)?.length > 5) {
      return [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
    return [/\d/, /\d/, /\d/, /\d/, /\d/];
  };

  INTEGER = function (prefix?, suffix?) {
    return createNumberMask({
      prefix: prefix ? prefix : '',
      suffix: suffix ? suffix : '',
      includeThousandsSeparator: false,
      allowDecimal: false,
      integerLimit: 9,
      requireDecimal: false,
      allowNegative: false,
      allowLeadingZeroes: false
    });
  };

  private static CANADA_ZIP_MAX_LENGTH = 6;

  CANADA_ZIP(rawValue) {
    const canadaZIPMask = [];
    for (let i = 0; i < 6; i++) {
      if (i == 3) {
        canadaZIPMask.push(' ');
      }
      canadaZIPMask.push(/[a-zA-Z0-9]/);
    }
    return canadaZIPMask;
  }

  private static US_SHORT_ZIP_MAX_LENGTH = 5;
  private static US_FULL_ZIP_DIGITS_MAX_LENGTH = 10;

  US_SHORT_ZIP(rawValue) {
    const usZipMask = [];
    for (let i = 0; i < 5; i++) {
      usZipMask.push(/[0-9]/);
    }
    return usZipMask;
  }

  COUNTRY_ZIP(rawValue: string, code: CountryISOEnum) {
    const mask = new Mask();
    const cleaned = !isEmptyString(rawValue) ? rawValue.replace(/[^a-zA-Z0-9]/g, '') : '';

    switch (code) {
      case CountryISOEnum.CA:
        if (cleaned.length <= Mask.CANADA_ZIP_MAX_LENGTH) {
          return mask.CANADA_ZIP(rawValue);
        }
        break;
      case CountryISOEnum.US:
        if (cleaned.length <= Mask.US_FULL_ZIP_DIGITS_MAX_LENGTH) {
          return mask.US_FULL_ZIP(rawValue);
        }
        break;
      default:
        return Mask.UNMASKED(255);
    }
    return Mask.UNMASKED(255);
  }

  HTTP_URL = rawValue => {
    return this.URL(rawValue, 'http://', 'https://');
  }

  HTTPS_URL = rawValue => {
    return this.URL(rawValue, 'https://', 'http://');
  }

  URL = function (rawValue, defaultPrefix, allowablePrefix) {
    const anyNonWhiteSpace = /[^\s]/;
    let str = rawValue.length;
    const urlMask = [];

    if (rawValue && rawValue.startsWith(allowablePrefix)) {
      str += allowablePrefix.length;
      urlMask.push([allowablePrefix]);
    } else {
      str += defaultPrefix.length;
      urlMask.push([defaultPrefix]);
    }
    for (let i = 0; i <= str; i++) {
      urlMask.push(anyNonWhiteSpace);
    }

    return urlMask;

  }

  DIGITS = function (rawValue: string): RegExp[] {
    const digitMask = /[0-9]/;
    const strLength = rawValue.length;
    const mask: RegExp[] = [];

    for (let i = 0; i <= strLength; i++) {
      mask.push(digitMask);
    }

    return mask;

  }
}
