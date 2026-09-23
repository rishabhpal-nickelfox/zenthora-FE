import {PaymentMethodTypeEnum} from "../../../enums/sale/payment-method-type.enum";
import {PaymentSourceEnum} from "../../../enums/sale/payment-source.enum";
import {TransactionPaymentMethodEnum} from "../../../enums/sale/transaction-payment-method.enum";
import {DocTypeEnum} from "../../../enums/sale/doc-type.enum";
import {CAStateEnum} from "../../../enums/utils/ca-state.enum";
import {USStateEnum} from "../../../enums/utils/us-state.enum";

export interface GetSaleEmailResponse {
  companyInfo:                                  CompanyInfo;
  json:                                         string;  /** CreateSaleRequest in String format **/
  status:                                       string;
  transactions:                                 Transaction[];
  version:                                      string;
  transactionHistoryVersion:                    number;
  appliedAmount:                                number;
  amountDue:                                    number;
  customerId:                                   number;
  creditCardPaymentAmountLeft:                  number;
  customerLogins:                               string[];
  registrationConfirmationLifeTimeInMinutes:    number;
  discountExpired:                              boolean;
  paidBeforeDiscountExpired:                    boolean;
  customerUserLimitExceeded:                    boolean;
  docType:                                      DocTypeEnum;
}

export interface CompanyInfo {
  legalName:                                 string;
  displayName:                               string;
  logo:                                      string;
  logoContentType:                           string;
  emailPaymentTemplate:                      string;
  defaultEmailPaymentTemplate:               string;
  address:                                   CompanyAddress;
  invoicePartialPaymentsAllowed:             boolean;
  salesOrderPartialPaymentsAllowed:          boolean;
  depositPartialPaymentsAllowed:             boolean;
  partialPaymentsAllowed:                    boolean;
  allowedPaymentMethods:                     PaymentMethodTypeEnum[];
  creditCardAuthorizationMessage:            string;
  creditCardSurchargesAuthorizationMessage:  string;
  achAuthorizationMessage:                   string;
  creditCardPaymentAmountLimit:              number;
  globalPaymentsEnabled:                     boolean;
  customerRegistrationOnCheckoutPageEnabled: boolean;
  customerPortalEnabled:                     boolean;
  emailPaymentsEnabled:                      boolean;
  surchargePercent:                          number;
  surchargeProhibitedStates:                 (USStateEnum | CAStateEnum)[];
  customFieldsEnabled:                       boolean;
  advancedFieldsEnabled:                     boolean;
}

export interface CompanyAddress {
  street:  string;
  city:    string;
  zip:     string;
  state:   string;
  country: string;
}

export interface Transaction {
  last4:                  string;
  source:                 PaymentSourceEnum;
  paymentMethod:          TransactionPaymentMethodEnum;
  otherPaymentMethodName: string;
  cardType:               string;
  accountType:            string;
  transactionTimestamp:   Date;
  amount:                 number;
  currency:               string;
  saleVersion:            number;
}
