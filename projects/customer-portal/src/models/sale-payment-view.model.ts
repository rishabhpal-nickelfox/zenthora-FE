import {PaymentStatusEnum} from "../../../common/src/lib/enums/sale/payment-status.enum";
import {SaleEmailTemplateData, DocTypeEnum} from "@eps/common";
import {SaleTransactionViewModel, SaleViewModel} from "../../../common/src/lib/models/sale/sale-view.model";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {USStateEnum} from "../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../common/src/lib/enums/utils/ca-state.enum";

export interface SalePaymentViewModel extends SaleViewModel {
  docType: DocTypeEnum;
  status: PaymentStatusEnum;
  saleData: SaleEmailTemplateData;
  currency: string;
  transactions: SaleTransactionViewModel[];
  transactionHistoryVersion: number;
  version: string;
  invoicePartialPaymentsAllowed: boolean;
  salesOrderPartialPaymentsAllowed: boolean;
  depositPartialPaymentsAllowed: boolean;
  allowedPaymentMethods: PaymentMethodTypeEnum[];
  creditCardSurchargesAuthorizationMessage: string;
  creditCardAuthorizationMessage: string;
  achAuthorizationMessage: string;
  creditCardPaymentAmountLeft: number;
  creditCardPaymentAmountLimit: number;
  globalPaymentsEnabled: boolean;
  surchargePercent: number;
  surchargeProhibitedStates: (USStateEnum | CAStateEnum)[];
}

export interface AuthorizationMessageModel {
  PAYER_FIRST_NAME: string,
  PAYER_LAST_NAME: string,
  PAYER_COMPANY_NAME: string,
  PAYMENT_AMOUNT: string,
  SURCHARGE_AMOUNT: string,
  TOTAL_INCLUDING_SURCHARGE: string,
  NAME_ON_ACCOUNT: string,
  ROUTING_NUMBER: string,
  NAME_ON_CARD: string,
  EXP_DATE: string,
  LAST_4: string,
  SUBMIT_BUTTON_NAME: string,
  TERMS_OF_SERVICE: string,
  PRIVACY_STATEMENT: string
}
