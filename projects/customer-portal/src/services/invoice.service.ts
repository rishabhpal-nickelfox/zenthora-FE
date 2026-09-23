import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CustomerServiceUrl} from "./customer-service-url";
import {SaleService} from "./sale.service";
import {SalePortalPaymentService} from "./sale-portal-payment.service";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {isDefined} from "../../../common/src/lib/helpers/object.helper";
import {InvoiceMultiplePaymentModelConverter} from "../models/invoice-multiple-payment-model-converter";
import moment from "moment";
import {Observable} from "rxjs";
import {
  InvoiceMultiplePaymentInfo,
  InvoiceMultiplePaymentResult,
  InvoiceTableModel,
  ReloadInvoiceMultipleResponse
} from "../models/invoice.model";
import {map} from "rxjs/operators";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class InvoiceService extends SaleService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, protected salePaymentService: SalePortalPaymentService) {
    super(http, settingsProvider, salePaymentService);
  }

  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.INVOICE}`;
  }


  getFromResponse(requestResult) {
    return requestResult.content.map(json => InvoiceTableModel.fromJSON(json));
  }


  payMultiple(payments: {
                invoice: InvoiceTableModel;
                paymentAmount: number
              }[], surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel,
              authorizationMessage: string
  ): Observable<InvoiceMultiplePaymentResult> {
    let paymentObservable;
    if (isDefined(paymentMethod.id)) {
      paymentObservable = this.payMultipleWithSavedPaymentMethod(payments, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage);
    } else {
      paymentObservable = this.payMultipleWithPaymentMethodData(payments, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage)
    }
    return paymentObservable.pipe(map(result => InvoiceMultiplePaymentResult.toInvoiceMultiplePaymentResult(result)))
  }

  private payMultipleWithSavedPaymentMethod(payments: {
                                              invoice: InvoiceTableModel;
                                              paymentAmount: number
                                            }[], surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel,
                                            authorizationMessage: string
  ): Observable<InvoiceMultiplePaymentResult> {
    return this.http.post<any>(`${this.baseUrl}/multiple/payment/payment-methods/${paymentMethod.id}?tzOffset=${moment().utcOffset()}`,
      InvoiceMultiplePaymentModelConverter.toPayWithSavedPaymentMethodRequest(payments, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage)
    );
  }

  private payMultipleWithPaymentMethodData(payments: {
                                             invoice: InvoiceTableModel;
                                             paymentAmount: number
                                           }[], surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel,
                                           authorizationMessage: string
  ): Observable<InvoiceMultiplePaymentResult> {
    return this.http.post<any>(`${this.baseUrl}/multiple/payment?tzOffset=${moment().utcOffset()}`,
      InvoiceMultiplePaymentModelConverter.toPayWithPaymentMethodDataRequest(payments, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage)
    );
  }


  getMultiplePaymentInfo(invoiceIds: number[]): Observable<InvoiceMultiplePaymentInfo> {
    return this.http.post<any>(`${this.baseUrl}/multiple/payment/info?tzOffset=${moment().utcOffset()}`,
      {invoiceIds});
  }

  getMultipleInvoices(invoiceIds: number[]): Observable<ReloadInvoiceMultipleResponse> {
    return this.http.post<any>(`${this.baseUrl}/multiple/reload`,
      {invoiceIds}).pipe(map(response => ReloadInvoiceMultipleResponse.toReloadInvoiceMultipleResponse(response)));
  }
}
