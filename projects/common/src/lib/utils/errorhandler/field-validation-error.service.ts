import {HttpErrorResponse} from '@angular/common/http';
import {DEFAULT_ERROR_HEADER, getErrorMessageOrDefault} from '../../enums/error-message.enum';
import {AlertService} from '../alert.service';
import {ValidationMessageService} from '../validation-message.service';
import {DefaultErrorService} from './default-error.service';
import {Injectable} from '@angular/core';
import {FormComponent} from "../../pages/form.component";
import {getMessage} from "../../helpers/string.helper";
import {HttpCodeDescriptions} from "../../enums/utils/http-code-description";

@Injectable({
  providedIn: 'root',
})
export class FieldValidationErrorService extends DefaultErrorService {

  constructor(protected _alertService: AlertService, protected _validationService: ValidationMessageService) {
    super(_alertService, _validationService);
  }

  error(serverError: HttpErrorResponse, form: FormComponent) {
    if (this.is400ExistsError(serverError)) {
      this.processExistsError(serverError, form);
    } else if (this.is400FieldValidationError(serverError)) {
      this.processFieldValidationError(serverError, form);
    }
    form.scrollToFirstElementWithError();
  }

  private processFieldValidationError(serverError: HttpErrorResponse, form?: FormComponent) {
    serverError.error.metadata.forEach(errorField => {
      this.addErrorMessageToField(serverError.status, getErrorMessageOrDefault(errorField.code), errorField.fieldName, form);
    });
  }

  private processExistsError(serverError: HttpErrorResponse, form?: FormComponent) {
    const fieldName = serverError.error.errorCode.split('_exists')[0];
    this.addErrorMessageToField(serverError.status, getErrorMessageOrDefault(serverError.error.errorCode), fieldName, form);
  }

  private addErrorMessageToField(statusCode: number, template: string, wsFieldName: string, form: FormComponent) {
    form.addErrorMessageToField(template, wsFieldName, getMessage(DEFAULT_ERROR_HEADER,
        [statusCode, HttpCodeDescriptions.get(statusCode)]));
  }


}
