import { formatDate } from "../../../../../common/src/lib/helpers/date.helper";
import {DocTypeEnum} from "@eps/common";
import {EmailAddressTypeEnum} from "../../../../../common/src/lib/enums/sale/email-address-type.enum";
import {SDFT} from "../../../../../common/src/lib/helpers/date.helper";

export class SgSyncAuditDetailsModel {
  emailId: number;
  sales: {docType: DocTypeEnum; saleId: number;}[] = [];
  exception: string;
  responseBody: string;
  emailAddress: string;
  emailType: EmailAddressTypeEnum;
}

export class SendgridSyncModel {
  id: number;
  date: string;
  verified: number;
  updated: number;
  error: string;
  sgSyncAuditDetails: SgSyncAuditDetailsModel[];
}

export function convertJSONToSendgridSync(json): SendgridSyncModel {
  const audit = Object.assign(new SendgridSyncModel(), json);
  audit.date = json.date ? formatDate(json.date, SDFT) : null;
  return audit;
}


