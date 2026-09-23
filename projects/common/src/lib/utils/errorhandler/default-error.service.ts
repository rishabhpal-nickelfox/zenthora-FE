import {HttpErrorResponse} from '@angular/common/http';
import {AlertService} from '../alert.service';
import {ValidationMessageService} from '../validation-message.service';
import {DEFAULT_ERROR_HEADER, DEFAULT_ERROR_MSG, getErrorMessageOrDefault} from '../../enums/error-message.enum';
import {Injectable, Optional} from '@angular/core';
import {CommonErrorService} from './common-error.service';
import {getMessage} from "../../helpers/string.helper";
import {HttpCodeDescriptions} from "../../enums/utils/http-code-description";
import {ServerErrorService} from "../server-error.service";
import {getScrollBehavior} from '../../helpers/dom.helper';

@Injectable({
  providedIn: 'root',
})
export class DefaultErrorService extends CommonErrorService {


  constructor(public alertService: AlertService,
              public validationService: ValidationMessageService,
              @Optional() protected serverErrorService?: ServerErrorService) {
    super(alertService, validationService);
  }

  is500ServerError(serverError: HttpErrorResponse) {
    return serverError.status == 500 && serverError.error && serverError.error.error;
  }

  is500CustomError(serverError: HttpErrorResponse) {
    return serverError.status == 500 && serverError.error.errorCode;
  }

  is500CustomNotCheckedError(serverError: HttpErrorResponse) {
    return this.is500CustomError(serverError) && !this.isCheckedErrorResponse(serverError);
  }


  is401NotCheckedError(serverError: HttpErrorResponse) {
    return this.is401Error(serverError) && !this.isCheckedErrorResponse(serverError);
  }

  is4xxLogicNotCheckedError(serverError: HttpErrorResponse) {
    return this.is400LogicError(serverError) && !this.isCheckedErrorResponse(serverError);
  }

  is400LogicError(serverError: HttpErrorResponse) {
    return this.is400CustomError(serverError) && !this.is400FieldValidationError(serverError) && !this.is400ExistsError(serverError)
        && !this.is404NotFound(serverError);
  }

  is400CustomError(serverError: HttpErrorResponse) {
    return serverError.status == 400 && serverError.error.errorCode;
  }

  is400FieldValidationError(serverError: HttpErrorResponse) {
    return this.is400CustomError(serverError) && (serverError.error.errorCode === 'data_error') && serverError.error.metadata;
  }

  is400ExistsError(serverError: HttpErrorResponse) {
    return this.is400CustomError(serverError) && serverError.error.errorCode.includes('_exists');
  }

  showDefaultError(error) {
    this.alertService.showError(getMessage(DEFAULT_ERROR_HEADER, [error.status, HttpCodeDescriptions.get(error.status)]), DEFAULT_ERROR_MSG);
  }

  showFieldValidationError(serverError: HttpErrorResponse) {
    const defaultHeader = getMessage(DEFAULT_ERROR_HEADER, [serverError.status, HttpCodeDescriptions.get(serverError.status)]);

    if (this.is400ExistsError(serverError)) {
      const fieldName = serverError.error.errorCode.split('_exists')[0];
      this.addServerErrorToField(getErrorMessageOrDefault(serverError.error.errorCode), fieldName, defaultHeader);
      return;
    }

    serverError.error.metadata.forEach(errorField => {
      this.addServerErrorToField(getErrorMessageOrDefault(errorField.code), errorField.fieldName, defaultHeader);
    });
  }

  private addServerErrorToField(template: string, wsFieldName: string, defaultHeader: string) {
    const message = getMessage(template, wsFieldName);
    const formControl = this.serverErrorService?.getFormControl(wsFieldName);

    if (formControl) {
      formControl.markAsDirty();
      formControl.setErrors({...formControl.errors, server: message});
      this.showAlertIfFieldErrorIsNotVisible(defaultHeader, wsFieldName, message);
    } else {
      this.alertService.showError(defaultHeader, `${wsFieldName}: ${message}`);
    }
  }

  private showAlertIfFieldErrorIsNotVisible(defaultHeader: string, wsFieldName: string, message: string) {
    window.requestAnimationFrame(() => {
      const el = Array.from(document.querySelectorAll<HTMLElement>('.val-message'))
        .find(errorElement => errorElement.innerText.includes(message) && this.isVisible(errorElement));

      if (el) {
        el.scrollIntoView({behavior: getScrollBehavior(), block: 'center', inline: 'nearest'});
      } else {
        this.alertService.showError(defaultHeader, `${wsFieldName}: ${message}`);
      }
    });
  }

  private isVisible(el: HTMLElement) {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && style.opacity !== '0'
      && rect.width > 0
      && rect.height > 0;
  }

  is404NotFound(serverError: HttpErrorResponse): boolean {
    return serverError.status === 404 && serverError.error && serverError.error.errorCode === 'not_found';
  }


}
