import {Component, Input, OnChanges} from '@angular/core';
import {ErrorService} from "../../utils/errorhandler/error.service";
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-extended-input',
  templateUrl: './extended-input.component.html',
  styleUrls: ['./extended-input.component.scss']
})
export class ExtendedInputComponent implements OnChanges {
  @Input() labelText = '';
  @Input() required = false;
  @Input() inputErrors: any;
  @Input() errorDefs: any;
  @Input() hasError = false;
  @Input() verticalMode = false;
  @Input() labelContainerClass = '';
  @Input() labelClass = '';

  errors = {};

  constructor(private errorService: ErrorService) {
  }

  ngOnChanges(changes: any): void {
    this.errors = (changes.inputErrors && changes.inputErrors.currentValue) || {};
  }

  getErrorMsg(errorKey) {
    if (errorKey === 'server') {
      return this.errors[errorKey];
    } else if (this.hasError) {
      const params = this.labelText ? [this.labelText] : [];
      const errorDef = this.errorDefs[errorKey];
      if (isDefined(errorDef)) {
        if (isDefined(errorDef.params) && errorDef.params instanceof Array) {
          params.push(...errorDef.params);
        } else {
          params.push(isDefined(errorDef.params) ? errorDef.params : '');
        }
        return this.errorService.validationService.getMessage(errorDef.template, params);
      }
    }
    return null;
  }

  get errorKeys() {
    return this.errors ? Object.keys(this.errors): [];
  }
}
