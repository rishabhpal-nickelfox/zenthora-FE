export enum MailingMethodEnum {
  SENDGRID = 'SENDGRID',
  PRIVATE_SMTP = 'PRIVATE_SMTP'
}

export const MailingMethodEnumValue = new Map<string, string>([
  [MailingMethodEnum.SENDGRID, 'Platform Mailing Method'],
  [MailingMethodEnum.PRIVATE_SMTP, 'Private SMTP Server']
]);
