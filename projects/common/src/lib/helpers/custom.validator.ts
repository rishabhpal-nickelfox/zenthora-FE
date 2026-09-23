import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {isDefined, ObjectHelper} from "./object.helper";
import {isMoment, Moment} from "moment";
import {
  FormValidatorErrorModel,
  FormValidatorMaxAmountErrorModel,
  FormValidatorMaxLengthErrorModel,
  FormValidatorMaxValueErrorModel,
  FormValidatorMinAmountErrorModel,
  FormValidatorMinItemsErrorModel,
  FormValidatorMinLengthErrorModel,
  FormValidatorMinValueErrorModel, FormValidatorMinValueStrictErrorModel, FormValidatorZipErrorModel
} from "../models/common/form-validator-error.model";
import {CountryEnum} from "../enums/utils/county.enum";
import {CountryISOEnum} from "../enums/utils/country-iso.enum";

export class CustomValidator {
  static readonly phone = Validators.pattern('^\\+\\d[\\(]\\d{3}[\\)]\\s\\d{3}[\\-]\\d{4}|(\\+\\d{11})$');
  static readonly zip = Validators.pattern('^\\d{5}$|^\\d{5}\\-\\d{4}$');
  static readonly digitFirst = Validators.pattern('^\\d.*$');
  static readonly login = Validators.pattern('^.+@.+$');
  static readonly emailRegexp = /^[^<>\s,;@]+@[^<>\s,;@]+\.[^<>\s,;@]+$/;
  static readonly email = Validators.pattern(CustomValidator.emailRegexp);
  static readonly namedEmail = Validators.pattern('^[^<>]+<[^<>\\s,;@]+@[^<>\\s,;@]+>$');
  static readonly url = Validators.pattern('^https?:\\/\\/(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9-]{1,63}(:[0-9]{1,5})?(\\/.*)?$');

  static required(label: string): ValidatorFn {
    return (control: AbstractControl) => Validators.required(control) ? {required: new FormValidatorErrorModel(label)} : null;
  }


  static max(label: string, maxValue: number): ValidatorFn {
    return (control: AbstractControl) => Validators.max(maxValue)(control) ? {maxvalue: new FormValidatorMaxValueErrorModel(label, maxValue)} : null;
  }

  static maxAmount(label: string, maxAmount: number, currency: string): ValidatorFn {
    return (control: AbstractControl) => Validators.max(maxAmount)(control) ? {maxAmount: new FormValidatorMaxAmountErrorModel(label, maxAmount, currency)} : null;
  }


  static maxLength(label: string, maxLength: number): ValidatorFn {
    return (control: AbstractControl) => Validators.maxLength(maxLength)(control) ? {maxlength: new FormValidatorMaxLengthErrorModel(label, maxLength)} : null;
  }

  static minLength(label: string, minLength: number): ValidatorFn {
    return (control: AbstractControl) => Validators.minLength(minLength)(control) ? {minlength: new FormValidatorMinLengthErrorModel(label, minLength)} : null;
  }

  static minItems(label: string, minItems: number): ValidatorFn {
    return (control: AbstractControl) => {
      const length = Array.isArray(control.value) ? control.value.length : 0;
      return length < minItems ? {minitems: new FormValidatorMinItemsErrorModel(label, minItems)} : null;
    };
  }

  static minValue(label: string, minValue: number): ValidatorFn {
    return (control: AbstractControl) => Validators.min(minValue)(control) ? {minvalue: new FormValidatorMinValueErrorModel(label, minValue)} : null;
  }

  static minValueStrict(label: string, minValue: number): ValidatorFn {
    return (control: AbstractControl) => ObjectHelper.isDefined(control.value) && control.value <= minValue ? {minvalueStrict: new FormValidatorMinValueStrictErrorModel(label, minValue)} : null;
  }

  static minAmountStrict(label: string, minAmount: number, currency: string): ValidatorFn {
    return (control: AbstractControl) => control.value <= minAmount ? {minAmountStrict: new FormValidatorMinAmountErrorModel(label, minAmount, currency)} : null;
  }

  static emailValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => this.email(control) ? {email: new FormValidatorErrorModel(label)} : null;
  }

  static loginValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => this.login(control) ? {email: new FormValidatorErrorModel(label)} : null; //login validation is less strict, doesn't require '.'
  }

  static emailRegularOrNamedValidation(label: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value ?? '').trim();

      if (!value) {
        return null;
      }

      if (/[\r\n]/.test(value)) {
        return {emailRegularOrNamed: new FormValidatorErrorModel(label)};
      }

      const regularInvalid = !!this.email(control);
      const namedInvalid = !!this.namedEmail(control);

      if (regularInvalid && namedInvalid) {
        return {emailRegularOrNamed: new FormValidatorErrorModel(label)};
      }

      return null;
    };
  }

  static multipleEmailValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => !this.multipleEmail(control) ? {emails: new FormValidatorErrorModel(label)} : null;
  }


  static phoneValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => this.phone(control) ? {phone: new FormValidatorErrorModel(label)} : null;
  }

  static urlValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => this.url(control) ? {pattern: new FormValidatorErrorModel(label)} : null;
  }

  static noJavascriptValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => this.noJavascriptValidator()(control) ? {noJavaScript: new FormValidatorErrorModel(label)} : null;
  }

  static noJavascriptValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const value = String(control.value ?? '').trim();

      if (!value) return null;

      const hasJavascriptScheme = /javascript\s*:/i.test(value);
      const hasScriptTag = /<\s*script\b/i.test(value);
      const hasEventHandlers = /\son\w+\s*=/i.test(value);

      if (hasJavascriptScheme || hasScriptTag || hasEventHandlers) {
        return { noJavaScript: true };
      }

      return null;
    };
  }

  static addIf(validationFn: ValidatorFn, condition?: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return condition === undefined || condition === null || condition
        ? validationFn(control)
        : null;
    };
  }

  static countryZip(countryCode: CountryEnum) {
    if (countryCode === CountryEnum.CA) {
      return Validators.pattern('^[a-zA-Z0-9]{6}$');
    } else {
      return Validators.pattern('^\\d{5}$');
    }
  }

  static countryZipValidation(label: string, countryCode: CountryISOEnum): ValidatorFn {
    let pattern;
    if (countryCode === CountryISOEnum.CA) {
      pattern = Validators.pattern('^[a-zA-Z0-9]{3}[ ][a-zA-Z0-9]{3}$');
    } else if (countryCode === CountryISOEnum.US) {
      pattern = Validators.pattern('^\\d{5}$|^\\d{5}\\-\\d{4}$');
    }
    return (control: AbstractControl) => isDefined(pattern) && pattern(control) ? {zip: new FormValidatorZipErrorModel(label, countryCode)} : null;
  }

  static pattern(label: string, pattern: string): ValidatorFn {
    return (control: AbstractControl) => Validators.pattern(pattern)(control) ? {pattern: new FormValidatorErrorModel(label)} : null;
  }


  static minDate(control: AbstractControl, minDate: Moment): ValidationErrors {
    if (isDefined(control.value) && isMoment(control.value) && control.value.isValid() && isDefined(minDate)) {
      return minDate.isAfter(control.value) ? {minDate: {value: control.value}} : null;
    }
    return null;
  }

  static checkboxGroupRequired(control: AbstractControl) {
    if (isDefined(control.value)) {
      return control.value.filter(ch => ch.checked).length <= 0 ? {required: control.value} : null;
    }
    return null;
  }

  static checkboxGroupRequiredValidation(label: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (isDefined(control.value)) {
        return control.value.filter(ch => ch.checked).length <= 0 ? {required: new FormValidatorErrorModel(label)} : null;
      }
      return null;
    };
  }

  static multipleEmail(control: AbstractControl): boolean {
    let isValid = true;
    if (isDefined(control.value) && control.value.length > 0) {
      const emails = control.value.split(/[ ,;]+/).map(v => v.trim()).filter(v => v.length > 0);
      for (let i = 0; i < emails.length; i++) {
        isValid = isValid && isDefined(emails[i].match(CustomValidator.emailRegexp));
      }
    }
    return isValid;
  }
}
