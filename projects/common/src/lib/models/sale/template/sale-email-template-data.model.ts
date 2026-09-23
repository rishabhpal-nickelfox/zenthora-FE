import moment, {Moment} from "moment";
import {CreateSaleRequest, Level2, LineItem, SaleDetail} from "../request/sale-request.model";
import {CurrencyEnumValue} from "../../../enums/sale/currency.enum";
import {InvoiceItemDetailTypeEnum} from "../../../enums/sale/invoice-item-detail-type.enum";
import {PaymentStatusEnum} from "../../../enums/sale/payment-status.enum";
import {CountryISOEnum} from "../../../enums/utils/country-iso.enum";
import {CompanyInfoRowsEnum} from "../../../enums/sale/company-info-rows.enum";
import {formatDate, LONG_DATE, SDF} from "../../../helpers/date.helper";
import {CustomFieldModel} from "../custom-field.model";
import {InvoiceTemplateModel} from "./invoice-template.model";
import {DocTypeEnum} from "../../../enums/sale/doc-type.enum";
import {MoneyHelper} from "../../../helpers/money.helper";
import {ContactHelper} from "../../../helpers/contact.helper";
import {isDefined} from "../../../helpers/object.helper";

export interface SaleTaxRateData {
  name: string;
  percentage: number;
  amount: number;
}

export class SaleEmailTemplateData {
  companyInfo: CompanyInfoTemplateData;
  logo: Logo;
  fullTemplate: InvoiceTemplateModel;
  saleShortInfo: SaleShortInfoTemplateData;
  saleAdditionalInfo: SaleAdditionalInfoTemplateData;
  saleFullInfo: SaleFullInfoTemplateData;
  billingAddress: SaleAddressTemplateData;
  shippingAddress: SaleAddressTemplateData;
  shippingInfo: SaleShippingInfoTemplateData;
  customFieldsInfo: CustomFieldsTemplateData;
  invoiceItems: ItemTemplateData[];
  customerName: string;
  customerMemo: string;
  subTotal: number;
  taxPercentage: number;
  taxAmount: number;
  discount: number;
  discountExpDate: Moment;
  discountExpDateFormatted: string;
  isDiscountExpired: boolean;
  shippingCost: number;
  appliedAmount: number;
  amountDue: number;
  total: number;
  tip: number;
  currency: string;
  customFieldsEnabled: boolean;
  advancedFieldsEnabled: boolean;

  statusStampUrl?: string;
  statusLabel?: string;
  statusCode?: string;
  deletedStampUrl?: string;
  taxRates?: SaleTaxRateData[];
  isAmountInclusive?: boolean;
  discountPercentLabel?: string;

  static fromJSON(companyInfoJson, createSaleRequest: CreateSaleRequest, amountDue: number, appliedAmount: number, status: PaymentStatusEnum, discountExpired: boolean, paidBeforeDiscountExpired: boolean, docType: DocTypeEnum): SaleEmailTemplateData {
    const saleDetail: SaleDetail = createSaleRequest.saleDetail;
    const companyInfo: CompanyInfoTemplateData = CompanyInfoTemplateData.fromJSON(companyInfoJson);
    const customFieldsEnabled = companyInfoJson.customFieldsEnabled;
    const advancedFieldsEnabled = companyInfoJson.advancedFieldsEnabled;
    const fullTemplate: InvoiceTemplateModel = InvoiceTemplateModel.fromJSON(companyInfoJson.emailPaymentTemplate, companyInfoJson.defaultEmailPaymentTemplate);

    const logo = Logo.fromJSON(companyInfoJson);

    const customerName = saleDetail.customerName;
    const billingAddress = saleDetail.billTo ? SaleAddressTemplateData.fromJSON(saleDetail.billTo) : null;
    const shippingAddress = saleDetail.shipTo ? SaleAddressTemplateData.fromJSON(saleDetail.shipTo) : null;
    const shippingInfo = saleDetail.shipDate || saleDetail.shipMethod || saleDetail.trackingNumber ? SaleShippingInfoTemplateData.fromJSON(saleDetail) : null;
    const saleAdditionalInfo = SaleAdditionalInfoTemplateData.fromJSON(saleDetail, createSaleRequest.level2);
    const saleFullInfo = SaleFullInfoTemplateData.fromJSON(saleDetail, createSaleRequest, docType);
    const saleShortInfo = SaleShortInfoTemplateData.fromJSON(createSaleRequest, docType);
    const customFields = saleDetail.customFields && saleDetail.customFields.length > 0 ? CustomFieldsTemplateData.fromJSON(saleDetail.customFields) : null;
    const currency = CurrencyEnumValue.get(saleDetail.currency) ?? '';
    const invoiceItems: ItemTemplateData[] = ItemTemplateData.fromLineItems(saleDetail.lineItems, currency);

    const discountExpDate = saleDetail.discountExpDate ? moment(saleDetail.discountExpDate) : null;
    const isSaleNotFullyPaid = status == PaymentStatusEnum.UNPAID || status == PaymentStatusEnum.PARTIALLY_PAID || status == PaymentStatusEnum.CANCELLED;

    const isSalePaidAfterDiscountExpired = status == PaymentStatusEnum.PAID && discountExpDate && !paidBeforeDiscountExpired;

    let taxAmount, total;
    if (isSaleNotFullyPaid && discountExpired || isSalePaidAfterDiscountExpired) {
      taxAmount = saleDetail.undiscountedTaxAmount;
      total = saleDetail.undiscountedTotal;
    } else {
      taxAmount = saleDetail.taxAmount;
      total = saleDetail.total;
    }

    return {
      companyInfo,
      logo,
      fullTemplate,
      billingAddress,
      shippingAddress,
      shippingInfo,
      saleAdditionalInfo,
      saleFullInfo,
      saleShortInfo,
      customFieldsInfo: customFields,
      invoiceItems,
      customerMemo: saleDetail.customerMemo,
      customerName,
      subTotal: saleDetail.subTotal,
      taxPercentage: saleDetail.taxPercentage,
      tip: saleDetail.tip,
      taxAmount: taxAmount,
      discount: saleDetail.discount,
      discountExpDate: discountExpDate,
      discountExpDateFormatted: discountExpDate ? formatDate(discountExpDate, LONG_DATE) : null,
      isDiscountExpired: discountExpired,
      shippingCost: saleDetail.shippingCost,
      appliedAmount: appliedAmount,
      amountDue,
      total,
      currency,
      taxRates: saleDetail.taxRates ?? null,
      isAmountInclusive: saleDetail.isAmountInclusive ?? false,
      customFieldsEnabled,
      advancedFieldsEnabled
    };
  }
}

export class ItemTemplateData {
  name: string;
  sku: string;
  description: string;
  quantity: string | number;
  amount: string | number;
  rate: string | number;
  tax: string;
  taxable: boolean;
  serviceDate: string;
  categoryClass: string;
  other1: string;
  other2: string;
  detailType?: InvoiceItemDetailTypeEnum;
  isChild?: boolean;

  static fromLineItems(lineItems: LineItem[], currency: string): ItemTemplateData[] {
    const rows: ItemTemplateData[] = [];
    (lineItems ?? []).forEach(lineItem => {
      rows.push(ItemTemplateData.fromJSON(lineItem, currency));
      (lineItem.children ?? []).forEach(child => rows.push(ItemTemplateData.fromJSON(child, currency, true)));
    });
    return rows;
  }

  static fromJSON(json, currency: string, isChild = false): ItemTemplateData {
    return {
      amount: MoneyHelper.formatAmount(json.amount, {
        currency
      }),
      name: json.itemName,
      sku: json.sku,
      description: json.description,
      quantity: MoneyHelper.formatAmount(json.quantity, {
        minimumFractionDigits: null,
        maximumFractionDigits: null
      }),
      rate: MoneyHelper.formatAmount(json.rate, {
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: null
      }),
      tax: isDefined(json.tax) ? MoneyHelper.formatAmount(json.tax, {
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: null
      }) : json.tax,
      taxable: json.taxable,
      serviceDate: json.serviceDate,
      categoryClass: json.categoryClass,
      other1: json.other1,
      other2: json.other2,
      detailType: json.detailType,
      isChild
    }
  }
}

export class SaleAdditionalInfoTemplateData {
  terms: string;
  dueDate: string;
  salesRep: string;
  shipDate: string;
  shipMethod: string;
  fob: string;
  trackingNumber: string;
  poNumber: string;
  customerNumber: string;
  other: string;

  static fromJSON(saleDetail: SaleDetail, level2: Level2): SaleAdditionalInfoTemplateData {
    const additionalInfo = new SaleAdditionalInfoTemplateData();
    additionalInfo.terms = saleDetail.terms;
    additionalInfo.dueDate = saleDetail.dueDate ? formatDate(moment(saleDetail.dueDate), SDF) : null;
    additionalInfo.salesRep = saleDetail.salesRep;
    additionalInfo.shipMethod = saleDetail.shipMethod;
    additionalInfo.shipDate = saleDetail.shipDate ? formatDate(moment(saleDetail.shipDate), SDF) : null;
    additionalInfo.fob = saleDetail.fob;
    additionalInfo.trackingNumber = saleDetail.trackingNumber;
    additionalInfo.poNumber = level2.poNumber;
    additionalInfo.customerNumber = level2.customerNumber;
    additionalInfo.other = saleDetail.other;
    return additionalInfo;
  }
}

export class SaleFullInfoTemplateData {
  docDate: string;
  docNumber: string;
  docType: DocTypeEnum;
  term: string;
  dueDate: string;

  static fromJSON(saleDetail: SaleDetail, saleRequest: CreateSaleRequest, docType: DocTypeEnum): SaleFullInfoTemplateData {
    return {
      term: saleDetail.terms,
      docType: docType,
      dueDate: saleDetail.dueDate ? formatDate(moment(saleDetail.dueDate), SDF) : null,
      docDate: saleRequest.docDate ? formatDate(moment(saleRequest.docDate), SDF) : null,
      docNumber: saleRequest.docNumber
    }
  }
}

export class SaleShortInfoTemplateData {
  docDate: string;
  docNumber: string;
  docType: DocTypeEnum;

  static fromJSON(json, docType: DocTypeEnum): SaleShortInfoTemplateData {
    return {
      docDate: json.docDate ? formatDate(moment(json.docDate), SDF) : null,
      docNumber: json.docNumber,
      docType: docType
    }
  }
}

export class SaleAddressTemplateData {
  firstName: string;
  lastName: string;
  companyName: string;
  address1: string;
  address2: string;
  city: string;
  country: CountryISOEnum;
  state: string;
  zip: string;
  addressText?: string;

  static fromJSON(json): SaleAddressTemplateData {
    return {
      firstName: json.firstName,
      lastName: json.lastName,
      companyName: json.companyName,
      address1: json.address1,
      address2: json.address2,
      city: json.city,
      country: json.country,
      state: json.state,
      zip: json.zip,
    };
  }
}

export class CompanyInfoTemplateData {
  displayName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  formattedPhone: string;

  static fromJSON(json): CompanyInfoTemplateData {
    return {
      displayName: json.displayName,
      street: json.address?.street,
      city: json.address?.city,
      state: json.address?.state,
      zip: json.address?.zip,
      country: json.address?.country,
      email: json.email,
      phone: json.phone,
      formattedPhone: ContactHelper.formatPhone(json.phone),
      website: json.website
    }
  }
}

export interface FullTemplate extends Template {
  titleColor: string;
  itemTable: TemplateComponent[];
}

export interface Template {
  components: TemplateComponent[];
  companyInfoRows: CompanyInfoRowsEnum[];
  colorEven: string;
  colorOdd: string;
  fontColor: string;
  fontSize: number;
}

export interface TemplateComponent {
  cols: number;
  id: string;
  rows: number;
  x: number;
  y: number;
}

export class Logo {
  logo: string;
  logoContentType: string;

  static fromJSON(json): Logo {
    return json.logo ? {
      logo: json.logo,
      logoContentType: json.logoContentType
    } : null
  }
}

export class CustomFieldsTemplateData {
  customFields: CustomFieldModel[];

  static fromJSON(json): CustomFieldsTemplateData {
    return {
      customFields: json
    }
  }
}

export class SaleShippingInfoTemplateData {
  shipDate: string;
  shipMethod: string;
  trackingNumber: string;

  static fromJSON(json): SaleShippingInfoTemplateData {
    return {
      shipDate: json.shipDate ? formatDate(moment(json.shipDate), SDF) : null,
      shipMethod: json.shipMethod,
      trackingNumber: json.trackingNumber
    }
  }
}
