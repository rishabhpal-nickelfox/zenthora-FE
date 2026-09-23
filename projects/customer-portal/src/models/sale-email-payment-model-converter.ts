import {SaleEmailPaymentViewModel} from "./sale-email-payment-view.model";
import {SalePaymentModelConverter} from "./sale-payment-model-converter";
import {GetSaleEmailResponse} from "../../../common/src/lib/models/sale/email/sale-email-server.model";

export class SaleEmailPaymentModelConverter extends SalePaymentModelConverter {

  static toViewModel(json): SaleEmailPaymentViewModel {
    const salePaymentViewModel = SalePaymentModelConverter.toPaymentViewModel(json);

    const responseModel: GetSaleEmailResponse = json as GetSaleEmailResponse;
    const customerLogins = responseModel.customerLogins;
    const registrationConfirmationLifeTimeInMinutes = responseModel.registrationConfirmationLifeTimeInMinutes;
    const companyId = responseModel.customerId;
    const customerPortalEnabled = responseModel.companyInfo.customerPortalEnabled;
    const emailPaymentsEnabled = responseModel.companyInfo.emailPaymentsEnabled;
    const customerRegistrationOnCheckoutPageEnabled = responseModel.companyInfo.customerRegistrationOnCheckoutPageEnabled;
    const customerUserLimitExceeded = responseModel.customerUserLimitExceeded;
    const surchargePercent = responseModel.companyInfo.surchargePercent;
    const surchargeProhibitedStates = responseModel.companyInfo.surchargeProhibitedStates;

    const saleEmailPaymentViewModel =
      {
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
        customerRegistrationOnCheckoutPageEnabled,
        customerPortalEnabled,
        emailPaymentsEnabled,
        surchargePercent,
        surchargeProhibitedStates,
        customerUserLimitExceeded,
        customerLogins,
        registrationConfirmationLifeTimeInMinutes,
        companyId
      };
    return saleEmailPaymentViewModel;
  }
}
