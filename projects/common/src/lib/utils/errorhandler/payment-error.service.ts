import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DefaultErrorService} from './default-error.service';


@Injectable({
  providedIn: 'root',
})
export class PaymentErrorService extends DefaultErrorService {

  isSaleHasChangedError(serverError: HttpErrorResponse) {
    return serverError.error?.errorCode === 'invoice_has_changed';
  }

  is4xxInvoiceHasChangedError(serverError: HttpErrorResponse) {
    return this.is400CustomError(serverError) && this.isSaleHasChangedError(serverError);
  }

  isBadPaymentAmountError(serverError: HttpErrorResponse) {
    return serverError.error?.errorCode === 'payment_amount_exceeds_amount_due';
  }

  is4xxBadPaymentAmountError(serverError: HttpErrorResponse) {
    return this.is400CustomError(serverError) && this.isSaleHasChangedError(serverError);
  }

  isCCPaymentsDisabledError(serverError: HttpErrorResponse) {
    return serverError.error?.errorCode === 'cc_payments_disabled';
  }

  isACHPaymentsDisabledError(serverError: HttpErrorResponse) {
    return serverError.error?.errorCode === 'ach_payments_disabled';
  }

  isPartialPaymentsDisabledError(serverError: HttpErrorResponse) {
    return serverError.error?.errorCode === 'partial_payments_disabled';
  }

}
