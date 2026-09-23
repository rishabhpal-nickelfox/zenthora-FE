import { isDefined } from "../../helpers/object.helper";


export enum WebhookEventEnum {     //Order is important
  SALE_CREATE = "SALE_CREATE",
  SALE_UPDATE = "SALE_UPDATE",
  SALE_CANCEL = "SALE_CANCEL",
  SALE_ARCHIVE = "SALE_ARCHIVE",
  SALE_UNARCHIVE = "SALE_UNARCHIVE",
  SALE_EMAIL_STATUS_CHANGED = "SALE_EMAIL_STATUS_CHANGED",
  SUCCESSFUL_PAYMENTS = "SUCCESSFUL_PAYMENTS",
  FAILED_PAYMENTS = "FAILED_PAYMENTS",
  CUSTOMER_PAYMENT_DATA_CREATE = "CUSTOMER_PAYMENT_DATA_CREATE",
  CUSTOMER_PAYMENT_DATA_UPDATE = "CUSTOMER_PAYMENT_DATA_UPDATE",
  CUSTOMER_PAYMENT_DATA_DELETE = "CUSTOMER_PAYMENT_DATA_DELETE",
  CUSTOMER_REGISTERED = "CUSTOMER_REGISTERED",
  CUSTOMER_TERMINATED = "CUSTOMER_TERMINATED"
}

export const WebhookEventEnumValue = new Map<WebhookEventEnum, string>([
  [WebhookEventEnum.SALE_CREATE, 'Create'],
  [WebhookEventEnum.SALE_UPDATE, 'Update'],
  [WebhookEventEnum.SALE_CANCEL, 'Cancel'],
  [WebhookEventEnum.SALE_ARCHIVE, 'Archive'],
  [WebhookEventEnum.SALE_UNARCHIVE, 'Unarchive'],
  [WebhookEventEnum.SALE_EMAIL_STATUS_CHANGED, 'Email Status Change'],
  [WebhookEventEnum.SUCCESSFUL_PAYMENTS, 'Successful Payments'],
  [WebhookEventEnum.FAILED_PAYMENTS, 'Failed Payment Attempts'],
  [WebhookEventEnum.CUSTOMER_PAYMENT_DATA_CREATE, 'Create'],
  [WebhookEventEnum.CUSTOMER_PAYMENT_DATA_UPDATE, 'Update'],
  [WebhookEventEnum.CUSTOMER_PAYMENT_DATA_DELETE, 'Delete'],
  [WebhookEventEnum.CUSTOMER_REGISTERED, 'Registered'],
  [WebhookEventEnum.CUSTOMER_TERMINATED, 'Terminated']
]);
export const WebhookSaleEvents = [WebhookEventEnum.SALE_CREATE, WebhookEventEnum.SALE_UPDATE, WebhookEventEnum.SALE_CANCEL, WebhookEventEnum.SALE_ARCHIVE, WebhookEventEnum.SALE_UNARCHIVE, WebhookEventEnum.SALE_EMAIL_STATUS_CHANGED];
export const WebhookPaymentDataEvents = [WebhookEventEnum.CUSTOMER_PAYMENT_DATA_CREATE, WebhookEventEnum.CUSTOMER_PAYMENT_DATA_UPDATE, WebhookEventEnum.CUSTOMER_PAYMENT_DATA_DELETE];
export const WebhookCustomerEvents = [WebhookEventEnum.CUSTOMER_REGISTERED, WebhookEventEnum.CUSTOMER_TERMINATED];
export const WebhookPaymentEvents = [WebhookEventEnum.SUCCESSFUL_PAYMENTS, WebhookEventEnum.FAILED_PAYMENTS];

export function isWebhookSaleEvent(value: WebhookEventEnum): boolean {
  return isDefined(WebhookSaleEvents.find(v => v == value));
}

export function isWebhookPaymentDataEvent(value: WebhookEventEnum): boolean {
  return isDefined(WebhookPaymentDataEvents.find(v => v == value));
}

export function isWebhookCustomerEvent(value: WebhookEventEnum): boolean {
  return isDefined(WebhookCustomerEvents.find(v => v == value));
}

export function isWebhookPaymentEvent(value: WebhookEventEnum): boolean {
  return isDefined(WebhookPaymentEvents.find(v => v == value));
}
