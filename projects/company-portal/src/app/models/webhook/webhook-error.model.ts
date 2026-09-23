import {WebhookEventEnum} from "../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {formatDate, SDFT} from "../../../../../common/src/lib/helpers/date.helper";

export class WebhookErrorModel {
  companyId: number;
  date: Date;
  docIds: string[];
  event: WebhookEventEnum;
  exceptionMessage: string;
  responseHttpCode: number;
  attemptNumber: number;
  totalAttempts: number;

  responseBody: string;

  get dateFormatted(): string {
    return this.date ? formatDate(this.date, SDFT) : null
  }


  static fromJSON(json): WebhookErrorModel {
    const webhookErrorModel = new WebhookErrorModel();
    webhookErrorModel.companyId = json.companyId;
    webhookErrorModel.date = json.date;
    webhookErrorModel.exceptionMessage = json.exceptionMessage;
    webhookErrorModel.responseHttpCode = json.responseHttpCode;
    webhookErrorModel.responseBody = json.responseBody;
    webhookErrorModel.event = json.event;
    webhookErrorModel.docIds = json.docIds;
    webhookErrorModel.attemptNumber = json.attemptNumber;
    webhookErrorModel.totalAttempts = json.totalAttempts;
    return webhookErrorModel;
  }
}
