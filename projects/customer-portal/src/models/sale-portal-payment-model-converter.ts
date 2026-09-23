import {SalePaymentModelConverter} from "./sale-payment-model-converter";
import {SalePortalPaymentViewModel} from "./sale-portal-payment-view.model";

export class SalePortalPaymentModelConverter extends SalePaymentModelConverter {

  static toViewModel(json): SalePortalPaymentViewModel {
    const salePaymentViewModel = SalePaymentModelConverter.toPaymentViewModel(json);

    const salePortalPaymentViewModel =
      {
        id: json.id,
        status: salePaymentViewModel.status,
        docType: salePaymentViewModel.docType,
        saleData: salePaymentViewModel.saleData,
        currency: salePaymentViewModel.currency,
        transactions: salePaymentViewModel.transactions,
        transactionHistoryVersion: salePaymentViewModel.transactionHistoryVersion,
        version: salePaymentViewModel.version,
        invoicePartialPaymentsAllowed: salePaymentViewModel.invoicePartialPaymentsAllowed,
        salesOrderPartialPaymentsAllowed: salePaymentViewModel.salesOrderPartialPaymentsAllowed,
        depositPartialPaymentsAllowed: salePaymentViewModel.depositPartialPaymentsAllowed,
        allowedPaymentMethods: salePaymentViewModel.allowedPaymentMethods,
        creditCardAuthorizationMessage: salePaymentViewModel.creditCardAuthorizationMessage,
        creditCardSurchargesAuthorizationMessage: salePaymentViewModel.creditCardSurchargesAuthorizationMessage,
        achAuthorizationMessage: salePaymentViewModel.achAuthorizationMessage,
        creditCardPaymentAmountLeft: salePaymentViewModel.creditCardPaymentAmountLeft,
        creditCardPaymentAmountLimit: salePaymentViewModel.creditCardPaymentAmountLimit,
        globalPaymentsEnabled: salePaymentViewModel.globalPaymentsEnabled,
        surchargePercent: salePaymentViewModel.surchargePercent,
        surchargeProhibitedStates: salePaymentViewModel.surchargeProhibitedStates
      }
    return salePortalPaymentViewModel;
  }
}
