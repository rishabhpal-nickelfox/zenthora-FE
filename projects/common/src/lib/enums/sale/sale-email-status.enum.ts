import {EmailStatusDescription} from "../email/email-status.enum";

export enum SaleEmailStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  CLICKED = 'CLICKED',
  NEW = 'NEW',
  SENT = 'SENT',
  SENDING_FAILURE = 'SENDING_FAILURE',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  BLOCKED = 'BLOCKED',
  BOUNCE = 'BOUNCE',
  DEFERRED = 'DEFERRED',
  DELIVERED = 'DELIVERED',
  DROPPED = 'DROPPED',
  NOT_DELIVERED = 'NOT_DELIVERED',
  UNKNOWN = 'UNKNOWN'
}
export const SaleEmailStatusFilterEnum = Object.values(SaleEmailStatusEnum)
  .filter(v => v !== SaleEmailStatusEnum.UNKNOWN) as SaleEmailStatusEnum[];

export const SaleEmailStatusEnumValue = new Map<string, string>([
  [SaleEmailStatusEnum.IN_PROGRESS, 'In progress'],
  [SaleEmailStatusEnum.SUCCESS, 'Success'],
  [SaleEmailStatusEnum.FAILURE, 'Failure'],
  [SaleEmailStatusEnum.CLICKED, 'Clicked'],
  [SaleEmailStatusEnum.NEW, 'New'],
  [SaleEmailStatusEnum.SENT, 'Sent'],
  [SaleEmailStatusEnum.SENDING_FAILURE, 'Sending Failure'],
  [SaleEmailStatusEnum.PROCESSING, 'Processing'],
  [SaleEmailStatusEnum.PROCESSED, 'Processed'],
  [SaleEmailStatusEnum.BLOCKED, 'Blocked'],
  [SaleEmailStatusEnum.BOUNCE, 'Bounce'],
  [SaleEmailStatusEnum.DEFERRED, 'Deferred'],
  [SaleEmailStatusEnum.DELIVERED, 'Delivered'],
  [SaleEmailStatusEnum.DROPPED, 'Dropped'],
  [SaleEmailStatusEnum.NOT_DELIVERED, 'Not Delivered'],
  [SaleEmailStatusEnum.UNKNOWN, 'Unknown'],
]);


export const SaleEmailStatusDescription = new Map<string, string>([...EmailStatusDescription,
  [SaleEmailStatusEnum.CLICKED, "Recipient clicked on a link within the email"]]);
