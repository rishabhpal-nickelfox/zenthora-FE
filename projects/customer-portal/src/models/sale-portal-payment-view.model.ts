import {formatDate, SDF} from "../../../common/src/lib/helpers/date.helper";
import {DocTypeEnum, SaleEmailTemplateData} from "@eps/common";
import {PaymentStatusEnum} from "../../../common/src/lib/enums/sale/payment-status.enum";
import {SaleTransactionViewModel, SaleViewModel} from "../../../common/src/lib/models/sale/sale-view.model";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {SalePaymentViewModel} from "./sale-payment-view.model";
import {USStateEnum} from "../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../common/src/lib/enums/utils/ca-state.enum";

export abstract class SalePortalPaymentViewModel implements SalePaymentViewModel {
  id: number;
  status: PaymentStatusEnum;
  docType: DocTypeEnum;
  saleData: SaleEmailTemplateData;
  currency: string;
  transactions: SaleTransactionViewModel[];
  transactionHistoryVersion: number;
  version: string;
  invoicePartialPaymentsAllowed: boolean;
  salesOrderPartialPaymentsAllowed: boolean;
  depositPartialPaymentsAllowed: boolean;
  allowedPaymentMethods: PaymentMethodTypeEnum[];
  creditCardAuthorizationMessage: string;
  creditCardSurchargesAuthorizationMessage: string;
  achAuthorizationMessage: string;
  creditCardPaymentAmountLeft: number;
  creditCardPaymentAmountLimit: number;
  globalPaymentsEnabled: boolean;
  surchargePercent: number;
  surchargeProhibitedStates: (USStateEnum | CAStateEnum)[];
}

export class SaleTableModel {
  id: number;
  docDate: string;
  docNumber: string;
  paymentStatus: PaymentStatusEnum;
  amountDue: number;
  total: number;
  appliedAmount: number;
  currency: string;
  archived: boolean;


  get docDateFormatted(): string {
    return this.docDate ? formatDate(this.docDate, SDF) : null;
  }

  static fromJSON(json): SaleTableModel {
    const sale = new SaleTableModel();
    sale.id = json.id;
    sale.docDate = json.docDate;
    sale.docNumber = json.docNumber;
    sale.paymentStatus = json.paymentStatus;
    sale.currency = json.currency;
    sale.amountDue = json.amountDue;
    sale.total = json.total;
    sale.appliedAmount = json.appliedAmount;
    sale.archived = json.archived;
    return sale;
  }

}

