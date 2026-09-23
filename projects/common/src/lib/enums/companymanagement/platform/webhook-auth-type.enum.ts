export enum WebhookAuthTypeEnum {
  OAUTH_1_0 = 'OAUTH_1_0',
  HMAC_SHA256 = 'HMAC_SHA256'
}

export const WebhookAuthTypeEnumValue = new Map<string, string>([
  [WebhookAuthTypeEnum.OAUTH_1_0, 'OAuth 1.0'],
  [WebhookAuthTypeEnum.HMAC_SHA256, 'Standard Webhooks HMAC-SHA256']
]);
