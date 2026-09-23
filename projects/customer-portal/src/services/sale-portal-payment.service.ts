import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {Observable} from "rxjs";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {CustomerServiceUrl} from "./customer-service-url";
import {SalePaymentService} from "./sale-payment.service";
import * as moment from "moment/moment";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";


@Injectable()
export class SalePortalPaymentService extends SalePaymentService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http, settingsProvider);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.SALE}`;
  }

  pay(id: number, version: string, paymentAmount: number, surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number): Observable<{
    authorizationId: string,
    approvalId: string,
    creditCardPaymentAmountLeft: number
  }> {
    let headers = new HttpHeaders();
    return this.payWithPaymentMethod(id, version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue, headers);
  }

  getPayWithSavedPaymentMethodUrl(id: number, paymentMethodId: number): string {
    return `${this.baseUrl}/${id}/payment/payment-methods/${paymentMethodId}?tzOffset=${moment().utcOffset()}`
  }

  getPayWithPaymentMethodDataUrl(id: number): any {
    return `${this.baseUrl}/${id}/payment?tzOffset=${moment().utcOffset()}`;
  }

}
