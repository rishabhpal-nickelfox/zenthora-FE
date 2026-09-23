import {CustomFieldModel} from "../custom-field.model";
import {InvoiceItemDetailTypeEnum} from "../../../enums/sale/invoice-item-detail-type.enum";


export interface CreateSaleRequest {
  docId:        string;
  docDate:      Date;
  docNumber:    string;
  saleDetail:   SaleDetail;
  clientInfo:   ClientInfo;
  level2:       Level2;
  emailSale:    Email;
  emailReceipt: Email;
}

export interface ClientInfo {
  clientToken: string;
  companyName: string;
  firstName:   string;
  lastName:    string;
  middleName:  string;
  email:       string;
}

export interface Email {
  attachments: Attachment[];
  from:        string;
  header:      string;
  htmlBody:    string;
  subject:     string;
  to:          string;
}

export interface Attachment {
  name:  string;
  value: string;
}

export interface Level2 {
  customerNumber: string;
  poNumber:       string;
  taxAmount:      number;
}

export interface SaleDetailTaxRate {
  name:                     string;
  percentage:               number;
  amount:                   number;
}

export interface SaleDetail {
  terms:                    string;
  dueDate:                  Date;
  billTo:                   ToAddress;
  shipDate:                 Date;
  shipMethod:               string;
  trackingNumber:           string;
  salesRep:                 string;
  fob:                      string;
  shipTo:                   ToAddress;
  subTotal:                 number;
  taxAmount:                number;
  undiscountedTaxAmount:    number
  taxPercentage:            number;
  discount:                 number;
  discountExpDate:          Date;
  shippingCost:             number;
  tip:                      number;
  total:                    number;
  undiscountedTotal:        number;
  appliedAmount:            number;
  amountDue:                number;
  undiscountedAmountDue:    number;
  currency:                 string;
  taxRates?:                SaleDetailTaxRate[];
  isAmountInclusive?:       boolean;
  lineItems:                LineItem[];
  customerMemo:             string;
  customerName:             string;
  customFields:             CustomFieldModel[];
  other:                    string;
}

export interface ToAddress {
  firstName:    string;
  lastName:     string;
  companyName:  string;
  address1:     string;
  address2:     string;
  city:         string;
  country:      string;
  state:        string;
  zip:          string;
}

export interface LineItem {
  amount:      string;
  description: string;
  itemName:    string;
  sku:         string;
  quantity:    string;
  rate:        string;
  tax:         string;
  taxable:     boolean;
  serviceDate: string;
  other1:      string;
  other2:      string;
  detailType?: InvoiceItemDetailTypeEnum;
  children?:   LineItem[];
}
