import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {CreditCardModel} from '../../../../common/src/lib/models/sale/credit-card.model';
import {RecaptchaService} from '../../../../common/src/lib/utils/recaptcha.service';
import {RecaptchaActionEnum} from '../../../../common/src/lib/enums/utils/recaptcha-action.enum';
import {PaymentFormDataItem, PaymentFormResponse} from "../../models/payment-form-payment.model";
import {PaymentFormTemplateItem} from "../../../../common/src/lib/models/paymentform/payment-form-template.model";
import {PaymentFormControlType} from "../../../../common/src/lib/enums/payment-form-control-type.enum";
import {ObjectHelper} from "../../../../common/src/lib/helpers/object.helper";
import {formatDate, SERVER_SHORT_DATE_FORMAT} from "../../../../common/src/lib/helpers/date.helper";

@Injectable()
export class PaymentFormPaymentService {

  constructor(private http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) private settingsProvider: BaseSettingsProvider) {
  }

  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/forms`;
  }

  getPaymentForm(paymentFormsCompanyId: string, paymentFormCode: string): Observable<PaymentFormResponse> {
    return this.http.get<PaymentFormResponse>(`${this.baseUrl}/${paymentFormsCompanyId}/${paymentFormCode}?tzOffset=${moment().utcOffset()}`);
  }

  processPayment(paymentFormsCompanyId: string,
                 paymentFormCode: string,
                 paymentAmount: number,
                 surchargeAmount: number,
                 authorizationMessage: string,
                 paymentFormTemplate: PaymentFormTemplateItem[],
                 creditCard: CreditCardModel,
                 recaptchaToken?: string): Observable<{
    authorizationId: string,
    approvalId: string
  }> {
    let headers = new HttpHeaders();
    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.EMAIL_PAYMENT);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }
    return this.http.post<any>(`${this.baseUrl}/${paymentFormsCompanyId}/${paymentFormCode}?tzOffset=${moment().utcOffset()}`, {
      paymentAmount,
      surchargeAmount,
      authorizationMessage,
      paymentFormData: this.getPaymentFormData(paymentFormTemplate),
      creditCardData: CreditCardModel.toJSON(creditCard)
    }, {headers});
  }

  private getPaymentFormData(paymentFormTemplate: PaymentFormTemplateItem[]): PaymentFormDataItem[] {
    return paymentFormTemplate.map(item => {
      return {
        id: item.id,
        type: item.type,
        label: item.label ?? null,
        value: item.type == PaymentFormControlType.DATE && ObjectHelper.isDefined(item.value) ? formatDate(item.value, SERVER_SHORT_DATE_FORMAT): item.value
      };
    });
  }
}
