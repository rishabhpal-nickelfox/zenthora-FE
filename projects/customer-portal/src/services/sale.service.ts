import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ObjectOperatingService} from "../../../common/src/lib/utils/object-operating.service";
import {Observable} from "rxjs";
import {SaleTableModel} from "../models/sale-portal-payment-view.model";
import {map} from "rxjs/operators";
import moment from "moment";
import {CustomerServiceUrl} from "./customer-service-url";
import {SalePortalPaymentModelConverter} from "../models/sale-portal-payment-model-converter";
import {SalePortalPaymentService} from "./sale-portal-payment.service";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export abstract class SaleService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, protected salePaymentService: SalePortalPaymentService) {
    super(http);
  }

  abstract get baseUrl();

  create(object: any, ...additional: any): Observable<any> {
    return undefined;
  }

  getAdditionalInfo(id) {
    return this.http.get<any>(`${this.settingsProvider.apiUrl}/${CustomerServiceUrl.SALE}/${id}?tzOffset=${moment().utcOffset()}`).pipe(map(result => SalePortalPaymentModelConverter.toViewModel(result)));
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(json => SaleTableModel.fromJSON(json));
  }

  update(object: any, ...additional: any): Observable<any> {
    return undefined;
  }

  pay(id: number, version: string, paymentAmount: number, surchargeAmount: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number): Observable<{
    authorizationId: string,
    approvalId: string,
    creditCardPaymentAmountLeft: number;
  }> {
    return this.salePaymentService.pay(id, version, paymentAmount, surchargeAmount, paymentMethodType, paymentMethod, authorizationMessage, controlAmountDue);
  }

}
