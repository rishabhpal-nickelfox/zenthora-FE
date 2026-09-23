import {formatDate, SDF, SDFT} from "../../../common/src/lib/helpers/date.helper";
import {PaymentSourceEnum} from "../../../common/src/lib/enums/sale/payment-source.enum";
import {TransactionPaymentMethodEnum} from "../../../common/src/lib/enums/sale/transaction-payment-method.enum";
import {CreditCardEnum} from "../../../common/src/lib/enums/sale/credit-card.enum";
import {AccountTypeEnum} from "../../../common/src/lib/enums/sale/account-type.enum";
import {DocTypeEnum} from "@eps/common";

export class CustomerTransactionTableModel {
  sales: CustomerTransactionTableSaleModel[];
  docType: DocTypeEnum;
  userId: number;
  userName: string;
  last4: string;
  source: PaymentSourceEnum;
  paymentMethod: TransactionPaymentMethodEnum;
  otherPaymentMethodName: string;
  cardType: CreditCardEnum;
  accountType: AccountTypeEnum;
  transactionTimestamp: string;
  amount: number;
  surchargeAmount: number;
  totalAmount: number;
  status: string;
  authCode: string;
  currency: string;
  success: boolean;


  get transactionTimestampFormatted(): string {
    return this.transactionTimestamp ? formatDate(this.transactionTimestamp, SDFT) : null;
  }

  static fromJSON(json): CustomerTransactionTableModel {
    const transaction = new CustomerTransactionTableModel();
    transaction.sales = json.sales;
    transaction.docType = json.docType;
    transaction.userId = json.userId;
    transaction.userName = json.userName;
    transaction.last4 = json.last4;
    transaction.source = json.source;
    transaction.paymentMethod = json.paymentMethod;
    transaction.otherPaymentMethodName = json.otherPaymentMethodName;
    transaction.cardType = json.cardType;
    transaction.accountType = json.accountType;
    transaction.transactionTimestamp = json.transactionTimestamp;
    transaction.amount = json.amount;
    transaction.surchargeAmount = json.surchargeAmount;
    transaction.totalAmount = json.totalAmount;
    transaction.currency = json.currency;
    transaction.status = json.status;
    transaction.authCode = json.authCode;
    transaction.success = json.success;
    return transaction;
  }
}

export interface CustomerTransactionTableSaleModel {
  saleId: number;
  docNumber: string;
  saleVersion: string;
}
