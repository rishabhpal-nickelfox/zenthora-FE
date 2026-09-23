import {PaymentStatusEnum} from "../../../common/src/lib/enums/sale/payment-status.enum";
import {CurrencyEnumValue, DocTypeEnum, InvoiceTemplateModel} from "@eps/common";
import {CompanyInfoTemplateData, CustomFieldsTemplateData, FullTemplate, ItemTemplateData, Logo, SaleAdditionalInfoTemplateData, SaleAddressTemplateData, SaleEmailTemplateData, SaleFullInfoTemplateData, SaleShippingInfoTemplateData, SaleShortInfoTemplateData} from "../../../common/src/lib/models/sale/template/sale-email-template-data.model";
import moment from "moment";
import {PayWithPaymentDataRequest, PayWithSavedPaymentMethodRequest} from "../../../common/src/lib/models/sale/email/sale-email-payment-server.model";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import Decimal from "decimal.js";
import {GetSaleEmailResponse} from "../../../common/src/lib/models/sale/email/sale-email-server.model";
import {CreateSaleRequest, SaleDetail} from "../../../common/src/lib/models/sale/request/sale-request.model";
import {SaleEmailAuthorizationMessageModel} from "./sale-email-authorization-request.model";
import {SaleTransactionViewModel} from "../../../common/src/lib/models/sale/sale-view.model";
import {PaymentSourceEnum} from "../../../common/src/lib/enums/sale/payment-source.enum";
import { isDefined } from "../../../common/src/lib/helpers/object.helper";
import {decimal} from "../../../common/src/lib/helpers/number.helper";
import {formatDate, LONG_DATE, SDFT} from "../../../common/src/lib/helpers/date.helper";
import {removeSpaces} from "../../../common/src/lib/helpers/string.helper";
import {AuthorizationMessageModel, SalePaymentViewModel} from "./sale-payment-view.model";

export class SalePaymentModelConverter {

  protected static toPaymentViewModel(json): SalePaymentViewModel {
    const responseModel: GetSaleEmailResponse = json as GetSaleEmailResponse;
    if (responseModel?.json) {
      const createSaleRequestModel: CreateSaleRequest = JSON.parse(responseModel.json);
      const saleDetail: SaleDetail = createSaleRequestModel.saleDetail;
      const status: PaymentStatusEnum = responseModel.status ? PaymentStatusEnum[responseModel.status] : null;
      const docType: DocTypeEnum = responseModel.docType;
      const version = responseModel.version;
      const transactionHistoryVersion = responseModel.transactionHistoryVersion;
      const currency = CurrencyEnumValue.get(saleDetail.currency);
      const templateCurrency = currency ?? '';
      const transactions = responseModel.transactions.sort((t1,t2) =>  t1.transactionTimestamp <  t2.transactionTimestamp ? 1 : -1).map(transaction => SaleTransactionViewModel.fromJSON(transaction));
      const lastTransaction = transactions[0];
      const discountExpDate = saleDetail.discountExpDate ? moment(saleDetail.discountExpDate) : null;

      const isSaleNotFullyPaid = status == PaymentStatusEnum.UNPAID || status == PaymentStatusEnum.PARTIALLY_PAID || status == PaymentStatusEnum.CANCELLED;

      const isSalePaidAfterDiscountExpired = status == PaymentStatusEnum.PAID && discountExpDate && !responseModel.paidBeforeDiscountExpired;

      const ccAmountFromTransactions = responseModel.transactions ? responseModel.transactions.filter(tr => isDefined(tr.cardType)).map(tr => decimal(tr.amount)).reduce((sum, cur) => sum.add(cur), decimal(0)) : decimal(0);
      const amountFromEPSTransactions = responseModel.transactions ? responseModel.transactions.filter(tr => tr.saleVersion == transactionHistoryVersion && tr.source == PaymentSourceEnum.EPS).map(tr => decimal(tr.amount)).reduce((sum, cur) => sum.add(cur), decimal(0)) : decimal(0);

      const amountDue = responseModel.amountDue;

      let taxAmount, total;
      if (isSaleNotFullyPaid && json.discountExpired || isSalePaidAfterDiscountExpired) {
        taxAmount = saleDetail.undiscountedTaxAmount;
        total = saleDetail.undiscountedTotal;
      } else {
        taxAmount = saleDetail.taxAmount;
        total = saleDetail.total;
      }

      const appliedAmount = responseModel.appliedAmount;
      let saleData: SaleEmailTemplateData;

      const fullTemplate: InvoiceTemplateModel = InvoiceTemplateModel.fromJSON(responseModel.companyInfo.emailPaymentTemplate, responseModel.companyInfo.defaultEmailPaymentTemplate);

      const companyInfo: CompanyInfoTemplateData = CompanyInfoTemplateData.fromJSON(responseModel.companyInfo);
      const customFieldsEnabled = responseModel.companyInfo.customFieldsEnabled;
      const advancedFieldsEnabled = responseModel.companyInfo.advancedFieldsEnabled;
      const logo = Logo.fromJSON(responseModel.companyInfo);

      const billingAddress = saleDetail.billTo ? SaleAddressTemplateData.fromJSON(saleDetail.billTo): null;
      const shippingAddress = saleDetail.shipTo ? SaleAddressTemplateData.fromJSON(saleDetail.shipTo): null;
      const shippingInfo = saleDetail.shipDate || saleDetail.shipMethod || saleDetail.trackingNumber ? SaleShippingInfoTemplateData.fromJSON(saleDetail) : null;
      const saleFullInfo = SaleFullInfoTemplateData.fromJSON(saleDetail, createSaleRequestModel, docType);
      const saleAdditionalInfo = SaleAdditionalInfoTemplateData.fromJSON(saleDetail, createSaleRequestModel.level2);
      const saleShortInfo = SaleShortInfoTemplateData.fromJSON(createSaleRequestModel, docType);
      const customFieldsInfo = saleDetail.customFields && saleDetail.customFields.length > 0 ? CustomFieldsTemplateData.fromJSON(saleDetail.customFields) : null;
      const invoiceItems: ItemTemplateData[] = saleDetail.lineItems ? saleDetail.lineItems.map(lineItem => ItemTemplateData.fromJSON(lineItem, templateCurrency)) : [];

      saleData = {
        companyInfo,
        logo,
        fullTemplate,
        billingAddress,
        shippingAddress,
        shippingInfo,
        saleAdditionalInfo,
        saleFullInfo,
        saleShortInfo,
        customFieldsInfo,
        invoiceItems,
        customerName: saleDetail.customerName,
        customerMemo: saleDetail.customerMemo,
        subTotal: saleDetail.subTotal,
        taxPercentage: saleDetail.taxPercentage,
        taxAmount: taxAmount,
        discount: saleDetail.discount,
        discountExpDate: discountExpDate,
        discountExpDateFormatted: discountExpDate ? formatDate(discountExpDate, LONG_DATE) : null,
        isDiscountExpired: json.discountExpired,
        shippingCost: saleDetail.shippingCost,
        tip: saleDetail.tip,
        appliedAmount,
        amountDue,
        total,
        currency: templateCurrency,
        taxRates: saleDetail.taxRates ?? null,
        isAmountInclusive: saleDetail.isAmountInclusive ?? false,
        customFieldsEnabled,
        advancedFieldsEnabled
      };


      const invoicePartialPaymentsAllowed = responseModel.companyInfo.invoicePartialPaymentsAllowed;
      const salesOrderPartialPaymentsAllowed = responseModel.companyInfo.salesOrderPartialPaymentsAllowed;
      const depositPartialPaymentsAllowed = responseModel.companyInfo.depositPartialPaymentsAllowed;
      const allowedPaymentMethods = responseModel.companyInfo.allowedPaymentMethods || [];
      const creditCardAuthorizationMessage = responseModel.companyInfo.creditCardAuthorizationMessage;
      const creditCardSurchargesAuthorizationMessage = responseModel.companyInfo.creditCardSurchargesAuthorizationMessage;
      const achAuthorizationMessage = responseModel.companyInfo.achAuthorizationMessage;

      const creditCardPaymentAmountLimit = responseModel.companyInfo.creditCardPaymentAmountLimit;
      const creditCardPaymentAmountLeft = responseModel.creditCardPaymentAmountLeft;

      const globalPaymentsEnabled = responseModel.companyInfo.globalPaymentsEnabled;
      const surchargePercent = responseModel.companyInfo.surchargePercent;
      const surchargeProhibitedStates = responseModel.companyInfo.surchargeProhibitedStates;

      return {
        status,
        docType,
        version,
        transactionHistoryVersion,
        transactions,
        saleData,
        currency,
        invoicePartialPaymentsAllowed,
        salesOrderPartialPaymentsAllowed,
        depositPartialPaymentsAllowed,
        allowedPaymentMethods,
        creditCardAuthorizationMessage,
        creditCardSurchargesAuthorizationMessage,
        achAuthorizationMessage,
        creditCardPaymentAmountLimit,
        creditCardPaymentAmountLeft,
        globalPaymentsEnabled,
        surchargePercent,
        surchargeProhibitedStates
      };
    }
    return null;
  }


  static toPayWithPaymentMethodDataRequest(version, paymentAmount: number, surchargeAmount: number, paymentMethod: PaymentMethodTypeEnum, paymentMethodModel: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number): PayWithPaymentDataRequest {
    const creditCardData = paymentMethod == PaymentMethodTypeEnum.CREDIT_CARD ? CreditCardModel.toJSON(<CreditCardModel>paymentMethodModel) : null;
    const achData = paymentMethod === PaymentMethodTypeEnum.ACH ? ACHModel.toJSON(<ACHModel>paymentMethodModel) : null;
    return {version, paymentAmount, surchargeAmount: surchargeAmount, paymentMethod, creditCardData, achData, authorizationMessage, controlAmountDue};
  }

  static toPayWithSavedPaymentMethodRequest(version, paymentAmount: number, surchargeAmount: number, paymentMethod: PaymentMethodTypeEnum, paymentMethodModel: CreditCardModel | ACHModel, authorizationMessage: string, controlAmountDue: number): PayWithSavedPaymentMethodRequest {
    const creditCardData = paymentMethod == PaymentMethodTypeEnum.CREDIT_CARD ? {cvv: (<CreditCardModel>paymentMethodModel).cvv} : null;
    return {version, paymentAmount, surchargeAmount, creditCardData, authorizationMessage, controlAmountDue};
  }

  static toAuthorizationMessageModel(paymentAmount: string,
                                     surchargeAmount: string,
                                     totalIncludingSurcharge: string,
                                     paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, submitButtonName: string,
                                     termsOfServiceLinkId: string,
                                     privacyStatementLinkId: string): AuthorizationMessageModel {
    const authorizationMessage = new SaleEmailAuthorizationMessageModel();
    authorizationMessage.PAYER_FIRST_NAME = paymentMethod?.firstName;
    authorizationMessage.PAYER_LAST_NAME = paymentMethod?.lastName;
    authorizationMessage.PAYER_COMPANY_NAME = paymentMethod?.companyName;
    authorizationMessage.PAYMENT_AMOUNT = paymentAmount;
    authorizationMessage.SURCHARGE_AMOUNT = surchargeAmount;
    authorizationMessage.TOTAL_INCLUDING_SURCHARGE = totalIncludingSurcharge;
    authorizationMessage.SUBMIT_BUTTON_NAME = submitButtonName;
    authorizationMessage.TERMS_OF_SERVICE = `<a id="${termsOfServiceLinkId}" href="#" onclick="return false;">Terms of Service</a>`;
    authorizationMessage.PRIVACY_STATEMENT = `<a id="${privacyStatementLinkId}" href="#" onclick="return false;">Privacy Statement</a>`;
    if (paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
      authorizationMessage.NAME_ON_CARD = (<CreditCardModel>paymentMethod).holder;
      authorizationMessage.EXP_DATE = (<CreditCardModel>paymentMethod).date;
      authorizationMessage.LAST_4 = removeSpaces((<CreditCardModel>paymentMethod).number)?.slice(-4);
    } else if (paymentMethodType == PaymentMethodTypeEnum.ACH) {
      authorizationMessage.NAME_ON_ACCOUNT = (<ACHModel>paymentMethod).name;
      authorizationMessage.ROUTING_NUMBER = (<ACHModel>paymentMethod).routingNumber;
      authorizationMessage.LAST_4 = removeSpaces((<ACHModel>paymentMethod).accountNumber)?.slice(-4);
    }
    return authorizationMessage;
  }
}
