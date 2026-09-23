import {EmailAddressTypeEnum} from "../../enums/sale/email-address-type.enum";
import {EmailStatusEnum} from "../../enums/email/email-status.enum";
import {formatDate, SDFT} from "../../helpers/date.helper";
import {EmailTypeEnum} from "../../enums/sale/email-type.enum";

export class EmailModel {
  id: string;
  platformId: string;
  companyId: string;
  vaultCompanyId: string;
  tokenName: string;
  emailedOn: string;
  statuses: EmailStatus[];
  errorDescription: string;
  subject: string;
  type: EmailTypeEnum;

  _expandStatuses = false;

  get emailedOnFormatted(): string {
    return this.emailedOn ? formatDate(this.emailedOn, SDFT) : null;
  }

  get toEmailStatuses(): EmailStatus[] {
    return this.statuses.filter(emailStatus => emailStatus.emailAddressType == EmailAddressTypeEnum.TO);
  }

  get toStatuses(): Set<EmailStatusEnum> {
    return new Set(this.statuses.filter(emailStatus => emailStatus.emailAddressType == EmailAddressTypeEnum.TO).map(toStatus => toStatus.status));
  }

}

export class EmailStatus {
  statusDatetimeUtcFormatted: string;
  emailAddress: string;
  emailAddressType: EmailAddressTypeEnum;
  status: EmailStatusEnum;
  description: string;

  static fromJSON(json): EmailStatus {
    return {
      emailAddress: json.emailAddress,
      emailAddressType: json.emailAddressType,
      status: json.status,
      description: json.description,
      statusDatetimeUtcFormatted: json.statusDatetimeUtc ? formatDate(json.statusDatetimeUtc, SDFT) : null
    }
  }
}

export function convertJSONToEmailModel(json): EmailModel {
  const emailModel = new EmailModel();
  emailModel.id = json.id;
  emailModel.platformId = json.platformId;
  emailModel.companyId = json.companyId;
  emailModel.vaultCompanyId = json.vaultCompanyId;
  emailModel.tokenName = json.tokenName;
  emailModel.emailedOn = json.emailedOn;
  emailModel.statuses = json.statuses?.map(status => EmailStatus.fromJSON(status)) || [];
  emailModel.errorDescription = json.errorDescription;
  emailModel.type = json.type;
  emailModel.subject = json.subject;
  return emailModel;
}


