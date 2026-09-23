import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertService} from '../alert.service';
import {ValidationMessageService} from '../validation-message.service';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonErrorService {

  constructor(public alertService: AlertService, public validationService: ValidationMessageService) {
  }


  isConnectionError(serverError: HttpErrorResponse) {
    return serverError.error && serverError.error instanceof ProgressEvent && serverError.status === 0;
  }

  is401Error(serverError: HttpErrorResponse) {
    return serverError.status === 401;
  }

  showError(header, body) {
    this.alertService.showError(header, body);
  }


  showSuccess(header, body) {
    this.alertService.showSuccess(header, body);
  }


  throwCheckedErrorResponse(errorResponse: HttpErrorResponse) {
    errorResponse.error.checked = true;
    return throwError(errorResponse);
  }

  isCheckedErrorResponse(error: HttpErrorResponse) {
    return error.error && error.error.checked;
  }
}
