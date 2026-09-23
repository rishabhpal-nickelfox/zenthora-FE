import {DocTypeEnum} from "@eps/common";
import {SalePortalPaymentViewModel} from "./sale-portal-payment-view.model";

export class SalesOrderModel extends SalePortalPaymentViewModel {
  readonly docType = DocTypeEnum.SALES_ORDER;
}

