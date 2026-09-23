import {PaymentStatusEnum} from "../../../enums/sale/payment-status.enum";
import {SaleEmailTemplateData} from "../template/sale-email-template-data.model";
import {SaleViewModel} from "../sale-view.model";

export interface SalePreviewViewModel extends SaleViewModel {
  status:                           PaymentStatusEnum;
  saleData:                         SaleEmailTemplateData;
  currency:                         string;
}
