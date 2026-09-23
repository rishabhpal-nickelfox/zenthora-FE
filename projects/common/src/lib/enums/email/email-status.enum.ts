export enum EmailStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
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
export const EmailStatusFilterEnum = Object.values(EmailStatusEnum)
  .filter(v => v !== EmailStatusEnum.UNKNOWN) as EmailStatusEnum[];

export const EmailStatusEnumValue = new Map<string, string>([
  [EmailStatusEnum.IN_PROGRESS, 'In progress'],
  [EmailStatusEnum.SUCCESS, 'Success'],
  [EmailStatusEnum.FAILURE, 'Failure'],
  [EmailStatusEnum.NEW, 'New'],
  [EmailStatusEnum.SENT, 'Sent'],
  [EmailStatusEnum.SENDING_FAILURE, 'Sending Failure'],
  [EmailStatusEnum.PROCESSING, 'Processing'],
  [EmailStatusEnum.PROCESSED, 'Processed'],
  [EmailStatusEnum.BLOCKED, 'Blocked'],
  [EmailStatusEnum.BOUNCE, 'Bounce'],
  [EmailStatusEnum.DEFERRED, 'Deferred'],
  [EmailStatusEnum.DELIVERED, 'Delivered'],
  [EmailStatusEnum.DROPPED, 'Dropped'],
  [EmailStatusEnum.NOT_DELIVERED, 'Not Delivered'],
  [EmailStatusEnum.UNKNOWN, 'Unknown']
]);

export const EmailStatusDescription = new Map<string, string>([
  [EmailStatusEnum.IN_PROGRESS, 'Email sending is in progress'],
  [EmailStatusEnum.NEW, 'Email has been created, but not sent'],
  [EmailStatusEnum.SENT, 'Email has been sent'],
  [EmailStatusEnum.SENDING_FAILURE, 'Email was not sent'],
  [EmailStatusEnum.PROCESSING, 'Email is about to be sent'],
  [EmailStatusEnum.PROCESSED, 'Email has been received and is ready to be delivered'],
  [EmailStatusEnum.BLOCKED, 'Receiving server could not or would not accept the email temporarily'],
  [EmailStatusEnum.BOUNCE, 'Receiving server could not or would not accept email to this recipient permanently'],
  [EmailStatusEnum.DEFERRED, 'Receiving server temporarily rejected the message'],
  [EmailStatusEnum.DELIVERED, 'Email has been successfully delivered to the receiving server'],
  [EmailStatusEnum.DROPPED, 'Email won\'t be delivered because of one or many reasons: Unsubscribed Address, Bounced Address, Spam Reporting Address, Invalid Address'],
  [EmailStatusEnum.NOT_DELIVERED, 'Email has not been delivered'],
  [EmailStatusEnum.UNKNOWN, 'Unknown'],
]);
