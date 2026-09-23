import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  ACCOUNT_DISABLED,
  COMPANY_DISABLED,
  JWT_TOKEN_EXPIRED,
  USER_EXISTS_ERROR_CODE
} from '../../enums/error-message.enum';
import {DefaultErrorService} from './default-error.service';
import {AlertService} from "../alert.service";
import {ValidationMessageService} from "../validation-message.service";
import {ServerErrorService} from "../server-error.service";

@Injectable({
    providedIn: 'root'
})
export class ErrorService extends DefaultErrorService {

  constructor(public alertService: AlertService,
              public validationService: ValidationMessageService,
              protected serverErrorService: ServerErrorService) {
    super(alertService, validationService, serverErrorService);
  }

  isUserAlreadyExistsError(serverError: HttpErrorResponse) {
    return this.is400CustomError(serverError) && serverError.error.errorCode === USER_EXISTS_ERROR_CODE;
  }

  isJWTTokenExpiredError(serverError: HttpErrorResponse): boolean {
    return this.is401Error(serverError) && serverError.error.errorCode === JWT_TOKEN_EXPIRED;
  }

  isEntityDisabledError(serverError: HttpErrorResponse) {
    return serverError.error.errorCode === COMPANY_DISABLED;
  }

  isAccountDisabledError(serverError: HttpErrorResponse) {
    return serverError.error.errorCode === ACCOUNT_DISABLED;
  }

}
