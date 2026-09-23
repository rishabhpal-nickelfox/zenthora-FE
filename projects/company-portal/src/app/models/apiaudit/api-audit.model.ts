import {formatDate, SDFT} from "../../../../../common/src/lib/helpers/date.helper";


export class ApiAuditModel {
  date: string;
  ip: string;
  tokenName: string;
  platformName: string;
  entityId: string;
  legalName: string;
  action: string;
  success: boolean;
  resultMessage: string;
  details: Object;

  static fromJSON(json): ApiAuditModel {
    const audit = Object.assign(new ApiAuditModel(), json);
    audit.date = formatDate(json.date, SDFT);
    audit.success = json.success;
    audit.resultMessage = json.resultMessage;
    audit.details = json.details ? JSON.parse(json.details): null;
    return audit;
  }
}


