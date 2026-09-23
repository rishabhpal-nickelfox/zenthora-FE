import {WebhookSettings} from "../companymanage/entity.model";
import {
  WebhookAuthTypeEnum
} from "../../../../../common/src/lib/enums/companymanagement/platform/webhook-auth-type.enum";

export class WebhookTestConfigurationRequestModel {
  platformId: number;
  webhookAuthType: WebhookAuthTypeEnum;
  webhookSettings: WebhookSettings;

  constructor(platformId: number, webhookAuthType: WebhookAuthTypeEnum, webhookSettings: WebhookSettings) {
    this.platformId = platformId;
    this.webhookAuthType = webhookAuthType;
    this.webhookSettings = webhookSettings;
  }

  static toJSON(model: WebhookTestConfigurationRequestModel) {
    return {
      platformId: model.platformId,
      webhookAuthType: model.webhookAuthType,
      webhookSettings: WebhookSettings.toJSON(model.webhookSettings)
    };
  }
}


export class WebhookTestConfigurationResponseModel {
  valid: boolean;

  constructor(valid: boolean) {
    this.valid = valid;
  }

  static fromJSON(json) : WebhookTestConfigurationResponseModel {
    return new WebhookTestConfigurationResponseModel(json.valid);
  }
}
