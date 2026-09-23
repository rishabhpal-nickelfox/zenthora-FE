import {Transaction} from "../email/sale-email-server.model";
import {DocTypeEnum} from "../../../enums/sale/doc-type.enum";

export interface GetSaleEmailPreviewResponse {
  companyInfo:                CompanyInfoPreview;
  json:                       string;  /** CreateSaleRequest in String format **/
  status:                     string;
  amountDue:                  number;
  appliedAmount:              number;
  discountExpired:            boolean;
  paidBeforeDiscountExpired:  boolean;
  transactionHistoryVersion:  number;
  transactions:               Transaction[];
  docType:                    DocTypeEnum;
}

export interface CompanyInfoPreview {
  legalName: string;
  displayName: string;
  logo: string;
  logoContentType: string;
  emailPaymentTemplate: string;
  defaultEmailPaymentTemplate: string;
  phone: string;
  website: string;
  address: CompanyAddressPreview;
}

export interface CompanyAddressPreview {
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
}
