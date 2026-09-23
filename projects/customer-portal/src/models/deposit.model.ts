import {DocTypeEnum} from "@eps/common";
import {SalePortalPaymentViewModel} from "./sale-portal-payment-view.model";

export class DepositModel extends SalePortalPaymentViewModel {
  readonly docType = DocTypeEnum.DEPOSIT;
}

