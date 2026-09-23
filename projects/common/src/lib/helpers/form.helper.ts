import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {isDefined} from './object.helper';
import {isEmptyString} from './string.helper';

export class FormHelper {

  private static getFormControls(group: FormGroup, enabledOnly: boolean, exceptionKeys?: string[]): FormControl[] {
    const returnArray = [];
    Object.keys(group.controls).forEach(key => {
      const control = group.controls[key];
      if ((control instanceof FormGroup)) {
        returnArray.push(...FormHelper.getFormControls(control, enabledOnly, exceptionKeys));
        return;
      } else if ((!enabledOnly || control.enabled) && (!exceptionKeys || exceptionKeys.indexOf(key) < 0)) {
        returnArray.push(control);
      }
    });
    return returnArray;
  }

  static getAllFormControls(group: FormGroup, exceptionKeys?: string[]): FormControl[] {
    return this.getFormControls(group, false, exceptionKeys);
  }

  static getEnabledFormControls(group: FormGroup, exceptionKeys?: string[]): FormControl[] {
    return this.getFormControls(group, false, exceptionKeys);
  }


  static  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      this.validateField(formGroup, field);
    });
  }

  static validateField(formGroup: FormGroup, field: string) {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsDirty({onlySelf: true});
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  }

  static isFieldNotValid(form: FormGroup, fieldName: string) {
    return form.get(fieldName) && !form.get(fieldName).disabled && !form.get(fieldName).valid && form.get(fieldName).dirty;
  }

  static updateGroupValidation(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach(fieldName => {
      const field = group.get(fieldName);
      if (field instanceof FormGroup) {
        this.updateGroupValidation(field);
      } else {
        field.updateValueAndValidity();
      }
    });
  }

  static isFormGroupValid(group: FormGroup) {
    let isValid = group.valid || group.disabled;
    Object.keys(group.controls).forEach(fieldName => {
      const field = group.get(fieldName);
      if (field instanceof FormGroup) {
        isValid = isValid && this.isFormGroupValid(field);
      }
    });
    return isValid;
  }

  static findInDictionaryById(dictionary, id) {
    return isDefined(dictionary) && isDefined(id) ? dictionary.find(v => v.id.toString() === id.toString()) : null;
  }

  static validateControl(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.markAsDirty({onlySelf: true});
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  }

  static validateIfNotEmpty(control: AbstractControl) {
    if (isDefined(control.value) && !isEmptyString(control.value)) {
      control.markAsTouched();
      control.markAsDirty();
      this.validateControl(control);
    } else {
      control.markAsPristine();
    }
  }

}
