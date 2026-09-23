import {PaymentStatusEnum} from "../../../common/src/lib/enums/sale/payment-status.enum";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {SaleEmailTemplateData, DocTypeEnum} from "@eps/common";
import {SaleTransactionViewModel, SaleViewModel} from "../../../common/src/lib/models/sale/sale-view.model";
import {USStateEnum} from "../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../common/src/lib/enums/utils/ca-state.enum";


export interface SaleEmailPaymentViewModel extends SaleViewModel {
  status:                                       PaymentStatusEnum;
  docType:                                      DocTypeEnum;
  saleData:                                     SaleEmailTemplateData;
  currency:                                     string;
  transactions:                                 SaleTransactionViewModel[];
  transactionHistoryVersion:                    number;
  version:                                      string;
  invoicePartialPaymentsAllowed:                boolean;
  salesOrderPartialPaymentsAllowed:             boolean;
  depositPartialPaymentsAllowed:                boolean;
  allowedPaymentMethods:                        PaymentMethodTypeEnum[];
  creditCardAuthorizationMessage:               string;
  creditCardSurchargesAuthorizationMessage:     string;
  achAuthorizationMessage:                      string;
  creditCardPaymentAmountLeft:                  number;
  creditCardPaymentAmountLimit:                 number;
  globalPaymentsEnabled:                        boolean;
  customerRegistrationOnCheckoutPageEnabled:    boolean;
  customerPortalEnabled:                        boolean;
  emailPaymentsEnabled:                         boolean;
  customerUserLimitExceeded:                    boolean;
  customerLogins:                               string[];
  registrationConfirmationLifeTimeInMinutes:    number;
  companyId:                                    number;
  surchargePercent:                             number;
  surchargeProhibitedStates:                    (USStateEnum | CAStateEnum)[];
}
