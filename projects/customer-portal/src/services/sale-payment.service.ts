import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SalePaymentModelConverter} from "../models/sale-payment-model-converter";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {Observable} from "rxjs";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {isDefined} from '../../../common/src/lib/helpers/object.helper';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";


@Injectable()
export abstract class SalePaymentService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
  }

  abstract getPayWithSavedPaymentMethodUrl(id: string | number, paymentMethodId: number): string;

  abstract getPayWithPaymentMethodDataUrl(id: string | number): string;

  protected payWithPaymentMethod(id: string | number, version: string, paymentAmount: number, surchargeAmount: number,paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number, headers: HttpHeaders): Observable<{
    authorizationId: string,
    approvalId: string,
    creditCardPaymentAmountLeft: number
  }> {
    if (isDefined(paymentMethod.id)) {
      return this.payWithSavedPaymentMethod(id, version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue, headers);
    } else {
      return this.payWithPaymentMethodData(id, version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue, headers)
    }
  }


  private payWithSavedPaymentMethod(id: string | number, version: string, paymentAmount: number, surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number, headers: HttpHeaders): Observable<{
    authorizationId: string,
    approvalId: string,
    creditCardPaymentAmountLeft: number
  }> {
    return this.http.post<any>(`${this.getPayWithSavedPaymentMethodUrl(id, paymentMethod.id)}`,
      SalePaymentModelConverter.toPayWithSavedPaymentMethodRequest(version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue),
      {headers: headers}
    );
  }

  private payWithPaymentMethodData(id: string | number, version: string, paymentAmount: number, surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number, headers: HttpHeaders): Observable<{
    authorizationId: string,
    approvalId: string,
    creditCardPaymentAmountLeft: number
  }> {
    return this.http.post<any>(`${this.getPayWithPaymentMethodDataUrl(id)}`,
      SalePaymentModelConverter.toPayWithPaymentMethodDataRequest(version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue),
      {headers: headers}
    );
  }
}
