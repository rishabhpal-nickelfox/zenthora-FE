import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CustomerServiceUrl} from "./customer-service-url";
import {SaleService} from "./sale.service";
import {SalePortalPaymentService} from "./sale-portal-payment.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class SalesOrderService extends SaleService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, protected salePaymentService: SalePortalPaymentService) {
    super(http, settingsProvider, salePaymentService);
  }

  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.SALES_ORDER}`;
  }


}
