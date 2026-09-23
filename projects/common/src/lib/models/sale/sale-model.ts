import {PaymentStatusEnum} from "../../enums/sale/payment-status.enum";
import {EmailAddressTypeEnum} from "../../enums/sale/email-address-type.enum";
import {SaleEmailStatusEnum} from "../../enums/sale/sale-email-status.enum";
import {DocTypeEnum} from "../../enums/sale/doc-type.enum";
import {formatDate, SDF, SDFT} from "../../helpers/date.helper";
import {EmailStatus} from "../email/email.model";

export class SaleModel {
  id: number;
  platformId: string;
  companyId: string;
  vaultCompanyId: string;
  tokenName: string;
  docType: DocTypeEnum;
  docDate: string;
  docId: string;
  docNumber: string;
  version: string;
  emailedOn: string;
  emailStatuses: SaleEmailStatus[];
  paymentStatus: PaymentStatusEnum;
  paymentStatusDate: string;
  errorDescription: string;
  archived: boolean;

  _expandStatuses = false;

  get paymentStatusDateFormatted(): string {
    return this.paymentStatusDate ? formatDate(this.paymentStatusDate, SDFT) : null;
  }

  get emailedOnFormatted(): string {
    return this.emailedOn ? formatDate(this.emailedOn, SDFT) : null;
  }

  get docDateFormatted(): string {
    return this.docDate ? formatDate(this.docDate, SDF) : null;
  }

  get toSaleEmailStatuses(): SaleEmailStatus[] {
    return this.emailStatuses.filter(emailStatus => emailStatus.emailAddressType == EmailAddressTypeEnum.TO);
  }

  get toStatuses(): Set<SaleEmailStatusEnum> {
    return new Set(this.emailStatuses.filter(emailStatus => emailStatus.emailAddressType == EmailAddressTypeEnum.TO).map(toStatus => toStatus.status));
  }
}

export class SaleEmailStatus {
  emailAddress: string;
  emailAddressType: EmailAddressTypeEnum;
  status: SaleEmailStatusEnum;
  description: string;
}

export function convertJSONToSale(json): SaleModel {
  const sale = new SaleModel();
  sale.id = json.id;
  sale.platformId = json.platformId;
  sale.companyId = json.companyId;
  sale.vaultCompanyId = json.vaultCompanyId;
  sale.tokenName = json.tokenName;
  sale.docDate = json.docDate;
  sale.docId = json.docId;
  sale.docType = json.docType;
  sale.docNumber = json.docNumber;
  sale.version = json.version;
  sale.emailedOn = json.emailedOn;
  sale.emailStatuses = json.emailStatuses?.map(status => EmailStatus.fromJSON(status)) || [];
  sale.paymentStatus = json.paymentStatus;
  sale.paymentStatusDate = json.paymentStatusDate;
  sale.errorDescription = json.errorDescription;
  sale.archived = json.archived;
  return sale;
}
