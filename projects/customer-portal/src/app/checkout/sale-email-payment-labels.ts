import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {ObjectHelper} from "../../../../common/src/lib/helpers/object.helper";

export const SaleEmailPaymentLabels = {
  Print: 'Print',
  PayNow: 'Pay Now',
  Cancel: 'Cancel',
  GoToPortal: 'Go To Portal',
  PaymentAmount: 'Payment Amount',
  Surcharge: (surchargePercent: number) =>  `Surcharge ${surchargePercent}%`,
  Total: 'Total',
  CopyFromBillToAddress: 'Copy from Bill To Address',
  AuthorizationID: 'Authorization ID:',
  ApprovalID: 'Approval ID:',
  SignIn: 'Sign In',
  SignOut: 'Sign Out',
  DiscountExpired: 'Discount expired',
  SaleHasChangedErrorMessage: 'Sale has changed',
  SaleAmountDueHasChanged: 'Sale amount due has changed',
  ACHPaymentsDisabled: 'ACH payments have been disabled, please reload a page to view available payment options',
  CCPaymentsDisabled: 'Credit Card payments have been disabled, please reload a page to view available payment options',
  PartialPaymentsDisabledErrorMessage: 'Partial payments have been disabled, please reload a page to view available payment options',

  View: (docType: DocTypeEnum) => `View ${DocTypeEnumValue.get(docType)}`,

  PaymentSuccess: (currency: string, paymentAmount: string, surchargeAmount: string, totalIncludingSurcharge: string) => `Your Payment of ${currency}${paymentAmount}${ObjectHelper.isDefined(surchargeAmount) ? "(Surcharge: " + currency + surchargeAmount + ". Total: " + currency + totalIncludingSurcharge +")": ""} Successfully Completed`,

  CCPaymentAmountLimitMessage: (currency: string, amount: string, docType: string) => `Credit Card Payments have been limited to ${currency}${amount} for this ${docType}`,

  ContactCompany: (companyName: string) => `Please contact ${companyName}`,
} as const;
