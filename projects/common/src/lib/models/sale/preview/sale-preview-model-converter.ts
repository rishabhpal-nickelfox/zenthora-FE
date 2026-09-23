import {SalePreviewViewModel} from "./sale-preview-view.model";
import {CreateSaleRequest, SaleDetail} from "../request/sale-request.model";
import {PaymentStatusEnum} from "../../../enums/sale/payment-status.enum";
import {CurrencyEnumValue} from "../../../enums/sale/currency.enum";
import {SaleEmailTemplateData} from "../template/sale-email-template-data.model";
import {GetSaleEmailPreviewResponse} from "./sale-preview-server.model";
import {SaleTransactionViewModel} from "../sale-view.model";

export class SalePreviewModelConverter {

  static toViewModel(json): SalePreviewViewModel {
    const responseModel: GetSaleEmailPreviewResponse = json as GetSaleEmailPreviewResponse;
    if (responseModel?.json) {
      const createSaleRequestModel: CreateSaleRequest = JSON.parse(responseModel.json) as CreateSaleRequest;
      const saleDetail: SaleDetail = createSaleRequestModel.saleDetail;
      const status = responseModel.status ? PaymentStatusEnum[responseModel.status] : null;
      const currency = CurrencyEnumValue.get(saleDetail.currency);

      const amountDue = responseModel.amountDue;
      const appliedAmount = responseModel.appliedAmount;
      const transactions = responseModel.transactions.sort((t1,t2) =>  t1.transactionTimestamp <  t2.transactionTimestamp ? 1 : -1).map(transaction => SaleTransactionViewModel.fromJSON(transaction));
      const transactionHistoryVersion = responseModel.transactionHistoryVersion;

      const saleData = SaleEmailTemplateData.fromJSON(responseModel.companyInfo, createSaleRequestModel, amountDue, appliedAmount, status, responseModel.discountExpired, responseModel.paidBeforeDiscountExpired, responseModel.docType);

      return {
        status,
        saleData,
        currency,
        transactions,
        transactionHistoryVersion
      };
    }
    return null;
  }
}
