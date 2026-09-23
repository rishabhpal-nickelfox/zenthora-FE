import {Injectable} from '@angular/core';
import {vsprintf} from 'sprintf-js';
import {AbstractControl, FormGroup} from '@angular/forms';
import {FormHelper} from "../helpers/form.helper";

@Injectable({providedIn: 'root'})
export class ValidationMessageService {
  REQUIRED = '%s cannot be blank';
  MAXLENGTH = (length) => `%s must be no more than ${length} characters`;
  MINLENGTH = (length) => `%s must be at least ${length} characters`;
  EXACT_LENGTH = (length) => `%s must be ${length} characters`;
  EMAIL = 'Please enter a valid email';
  PHONE = 'Please enter a valid phone number';
  PATTERN = '%s must be valid';
  DATE = 'Invalid date';
  DIGITS = '%s must contain only digits';
  IP = '%s must contain digits, characters from A to F, \'.\' or \':\'';
  ZIP = 'Please enter a valid zip code';
  MAXVALUE = (maxvalue) => `%s must be less than or equal to ${maxvalue}`;
  MAXVALUE_STRICT = (maxvalue) => `%s must be less than ${maxvalue}`;
  MINVALUE = (minvalue) => `%s must be greater than or equal to ${minvalue}`;
  MINVALUE_STRICT = (minvalue) => `%s must be greater than ${minvalue}`;
  STARTS_WITH_DIGIT = '%s must start with a digit';
  CANNOT_BE_EARLIER  = (date) => `%s cannot be earlier than ${date}`;
  ALREADY_EXISTS = '%s already exists';
  SELECT_FROM_LIST = '%s must be from the list';
  MUST_BE_THE_SAME = (sameValueAs) => `%s must be the same as ${sameValueAs}`;

  getMessage(template: string, parameters) {
    return vsprintf(template, parameters);
  }


  displayFieldCss(form: FormGroup, field: string) {
    return {
      'form-control-danger': FormHelper.isFieldNotValid(form, field),
    };
  }

  addServerError(form: FormGroup, fieldCode: string, message: string) {
    const control: AbstractControl = form.get(fieldCode);
    const updatedErrors = Object.assign({}, control.errors, {'server': message});
    control.setErrors(updatedErrors);
  }
}
