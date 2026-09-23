import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as moment from "moment";
import {SaleEmailPaymentViewModel} from "../models/sale-email-payment-view.model";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {CustomerServiceUrl} from "./customer-service-url";
import {CurrentCustomerSuitableForSaleResponseModel} from "../models/current-customer-suitable-for-sale-response.model";
import {SaleEmailPaymentModelConverter} from "../models/sale-email-payment-model-converter";
import {SalePaymentService} from "./sale-payment.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";


@Injectable()
export class SaleEmailPaymentService extends SalePaymentService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http, settingsProvider);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.EMAIL_SALE}`;
  }

  getPayWithSavedPaymentMethodUrl(token: string, paymentMethodId: number): string {
    return `${this.baseUrl}/payment/${token}/payment-methods/${paymentMethodId}?tzOffset=${moment().utcOffset()}`
  }

  getPayWithPaymentMethodDataUrl(token: string): any {
    return `${this.baseUrl}/payment/${token}?tzOffset=${moment().utcOffset()}`;
  }

  getSale(token: string): Observable<SaleEmailPaymentViewModel> {
    return this.http.get<any>(`${this.baseUrl}/payment/${token}?tzOffset=${moment().utcOffset()}`).pipe(map(result => SaleEmailPaymentModelConverter.toViewModel(result)));
  }

  pay(token: string, version: string, paymentAmount: number, surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number, recaptchaToken?: string): Observable<{
    authorizationId: string,
    approvalId: string,
    creditCardPaymentAmountLeft: number;
  }> {
    let headers = new HttpHeaders();
    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.EMAIL_PAYMENT);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }
    return this.payWithPaymentMethod(token, version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue, headers);
  }


  isCurrentCustomerSuitableForSale(token: string) {
    return this.http.get<CurrentCustomerSuitableForSaleResponseModel>(`${this.baseUrl}/${token}/current-customer-suitable`);
  }


}
