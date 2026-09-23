import {PaymentStatusEnum} from "../../enums/sale/payment-status.enum";
import {SaleEmailTemplateData} from "./template/sale-email-template-data.model";
import {CreditCardEnum} from "../../enums/sale/credit-card.enum";
import {AccountTypeEnum} from "../../enums/sale/account-type.enum";
import {Transaction} from "./email/sale-email-server.model";
import moment from "moment/moment";
import {PaymentSourceEnum} from "../../enums/sale/payment-source.enum";
import {TransactionPaymentMethodEnum} from "../../enums/sale/transaction-payment-method.enum";
import {formatDate, SDFT} from "../../helpers/date.helper";

export interface SaleViewModel {
  status:                          PaymentStatusEnum;
  saleData:                        SaleEmailTemplateData;
  currency:                        string;
  transactions:                    SaleTransactionViewModel[];
  transactionHistoryVersion:       number;
}

export class SaleTransactionViewModel {
  last4:                  string;
  source:                 PaymentSourceEnum;
  paymentMethod:          TransactionPaymentMethodEnum;
  otherPaymentMethodName: string;
  cardType:               CreditCardEnum;
  accountType:            AccountTypeEnum;
  paymentDate:            string;
  amount:                 number;
  saleVersion:            number;

  static fromJSON(transaction: Transaction): SaleTransactionViewModel {
    const last4 = transaction.last4;
    const source = transaction.source;
    const paymentMethod = transaction.paymentMethod;
    const otherPaymentMethodName = transaction.otherPaymentMethodName;
    const cardType = transaction.cardType ? CreditCardEnum[transaction.cardType] : null;
    const accountType = transaction.accountType ? AccountTypeEnum[transaction.accountType] : null;
    const paymentDate = transaction.transactionTimestamp ? formatDate(moment(transaction.transactionTimestamp), SDFT) : null;
    const amount = transaction.amount;
    const saleVersion = transaction.saleVersion;
    return {last4, source, paymentMethod, otherPaymentMethodName, cardType, accountType, paymentDate, amount, saleVersion};
  }
}
