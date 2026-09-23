import {DocTypeEnum} from "@eps/common";
import {PaymentSourceEnum} from "../../../../../common/src/lib/enums/sale/payment-source.enum";
import {TransactionPaymentMethodEnum} from "../../../../../common/src/lib/enums/sale/transaction-payment-method.enum";
import {CreditCardEnum} from "../../../../../common/src/lib/enums/sale/credit-card.enum";
import {AccountTypeEnum} from "../../../../../common/src/lib/enums/sale/account-type.enum";
import {formatDate, SDFT} from "../../../../../common/src/lib/helpers/date.helper";

export class TransactionModel {
  id: number;
  sales: TransactionTableSaleModel[];
  docType: DocTypeEnum;
  last4: string;
  source: PaymentSourceEnum;
  paymentMethod: TransactionPaymentMethodEnum;
  otherPaymentMethodName: string;
  cardType: CreditCardEnum;
  accountType: AccountTypeEnum;
  transactionTimestamp: string;
  totalAmount: number;
  amount: number;
  surchargeAmount: number;
  status: string;
  authCode: string;
  vaultProductId: number;
  currency: string;
  success: boolean;


  get transactionTimestampFormatted(): string {
    return this.transactionTimestamp ? formatDate(this.transactionTimestamp, SDFT) : null;
  }

  static fromJSON(json): TransactionModel {
    const transaction = new TransactionModel();
    transaction.id = json.id;
    transaction.sales = json.sales;
    transaction.docType = json.docType;
    transaction.last4 = json.last4;
    transaction.source = json.source;
    transaction.paymentMethod = json.paymentMethod;
    transaction.otherPaymentMethodName = json.otherPaymentMethodName;
    transaction.cardType = json.cardType;
    transaction.accountType = json.accountType;
    transaction.transactionTimestamp = json.transactionTimestamp;
    transaction.totalAmount = json.totalAmount;
    transaction.amount = json.amount;
    transaction.surchargeAmount = json.surchargeAmount;
    transaction.currency = json.currency;
    transaction.status = json.status;
    transaction.authCode = json.authCode;
    transaction.vaultProductId = json.vaultProductId;
    transaction.success = json.success;
    return transaction;
  }
}

export interface TransactionTableSaleModel {
  saleId: number;
  docNumber: string;
  saleVersion: string;
}
