import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DefaultErrorService} from './default-error.service';

@Injectable({
  providedIn: 'root',
})
export class ForbiddenErrorService extends DefaultErrorService {
  private static readonly ACCESS_DENIED_ERROR_CODE = 'access_is_denied';
  private static readonly USER_MUST_CHANGE_PASSWORD_ERROR_CODE = 'user_must_change_password';
  private static readonly GOOGLE_RECAPTCHA_FAILED = 'google_recaptcha_failed';

  is403Error(serverError: HttpErrorResponse): boolean {
    return serverError.status === 403 && serverError.error;
  }


  isForbidden(serverError: HttpErrorResponse): boolean {
    return this.is403Error(serverError) && serverError.error.errorCode === ForbiddenErrorService.ACCESS_DENIED_ERROR_CODE;
  }

  isMustChangePasswordError(serverError: HttpErrorResponse) {
    return this.is403Error(serverError) && serverError.error.errorCode === ForbiddenErrorService.USER_MUST_CHANGE_PASSWORD_ERROR_CODE;
  }

  isGoogleRecaptchaError(serverError: HttpErrorResponse): boolean {
    return this.is403Error(serverError) && serverError.error.errorCode === ForbiddenErrorService.GOOGLE_RECAPTCHA_FAILED;
  }
}
