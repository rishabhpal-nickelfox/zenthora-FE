

export enum ApiAuditActionEnum {
  CREATE_SALE = 'CREATE_SALE',    //wiki 2.1 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.1-create-sale
  UPDATE_SALE = 'UPDATE_SALE',   //wiki 2.2 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.2-update-sale
  UPDATE_SALES_METADATA = 'UPDATE_SALES_METADATA', //wiki 2.3 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.3-update-metadata-for-multiple-sales-at-once
  CANCEL_SALE = 'CANCEL_SALE',   //wiki 2.4 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.3-update-metadata-for-multiple-sales-at-once

  ARCHIVE_SALE = 'ARCHIVE_SALE',   //wiki 2.5 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.5-archive%2Funarchive-sale
  UNARCHIVE_SALE = 'UNARCHIVE_SALE', //wiki 2.5 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.5-archive%2Funarchive-sale
  ARCHIVE_UNARCHIVE_SALE = 'ARCHIVE_UNARCHIVE_SALE', //wiki 2.5 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API#2.5-archive%2Funarchive-sale

  GET_SALE_TRANSACTIONS = 'GET_SALE_TRANSACTIONS',  //wiki 2.6 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.6-get-sale-transactions#2.6-get-sale-transactions
  GET_SALES_STATUSES = 'GET_SALES_STATUSES', //wiki 2.7 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.7-get-sales-statuses
  GET_SALES_FOR_RECONSILATION = 'GET_SALES_FOR_RECONSILATION',    //wiki 2.8 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation

  SEND_EMAIL = 'SEND_EMAIL', //wiki 3.1 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=3.1-send-email
  GET_EMAIL_STATUS = 'GET_EMAIL_STATUS',   //wiki 3.2 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation#3.2-get-email-status

  CREATE_COMPANY = 'CREATE_COMPANY', //wiki 4.1 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation#4.1-create-company
  UPDATE_COMPANY = 'UPDATE_COMPANY', //wiki 4.2 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation#4.2-update-company
  ENABLE_COMPANY = 'ENABLE_COMPANY', //wiki 4.3 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation#4.3-enable-company
  DISABLE_COMPANY = 'DISABLE_COMPANY', //wiki 4.4 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation#4.4-disable-company
  TEST_COMPANY_STATUS = 'TEST_COMPANY_STATUS', //TODO 759

  CREATE_CUSTOMER_PORTAL_REGISTRATION_URL = 'CREATE_CUSTOMER_PORTAL_REGISTRATION_URL', //wiki 5 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=2.8-get-sales-for-reconciliation#5.-create-customer-portal-registration-url
  CREATE_MULTIPLE_SALES = 'CREATE_MULTIPLE_SALES', //wiki 5.3 https://dev.azure.com/Zenthora/EPS/_wiki/wikis/EPS.wiki/49/EPS-API?anchor=%3Cb%3Enew%3C/b%3E-5.3-create-multiple-sales-for-registered-customer

  GET_CUSTOMERS_STATUSES = 'GET_CUSTOMERS_STATUSES',
  REVOKE_CUSTOMER_PORTAL_INVITATION = 'REVOKE_CUSTOMER_PORTAL_INVITATION',
  CHANGE_CLIENT_TOKENS = 'CHANGE_CLIENT_TOKENS', //wiki 5.4

  GET_CARD_TYPE = 'GET_CARD_TYPE',

  REFRESH_TOKEN = 'REFRESH_TOKEN',
  REFRESH_TOKEN_WITH_GRACE_PERIOD = 'REFRESH_TOKEN_WITH_GRACE_PERIOD',
  REFRESH_TOKEN_GRACE_PERIOD_EXPIRED = 'REFRESH_TOKEN_GRACE_PERIOD_EXPIRED'
}

export const ApiAuditActionEnumValue = new Map<ApiAuditActionEnum, string>([
  [ApiAuditActionEnum.CREATE_SALE, 'Create Sale'],
  [ApiAuditActionEnum.UPDATE_SALE, 'Update Sale'],
  [ApiAuditActionEnum.UPDATE_SALES_METADATA, 'Update Metadata for multiple Sales at once'],
  [ApiAuditActionEnum.CANCEL_SALE, 'Cancel Sale'],
  [ApiAuditActionEnum.ARCHIVE_SALE, 'Archive Sale'],
  [ApiAuditActionEnum.UNARCHIVE_SALE, 'Unarchive Sale'],
  [ApiAuditActionEnum.ARCHIVE_UNARCHIVE_SALE, 'Archive/Unarchive Sale'],
  [ApiAuditActionEnum.GET_SALE_TRANSACTIONS, 'Get Sale Transactions'],
  [ApiAuditActionEnum.GET_SALES_STATUSES, 'Get Sales Statuses'],
  [ApiAuditActionEnum.GET_SALES_FOR_RECONSILATION, 'Get Sales for Reconciliation'],
  [ApiAuditActionEnum.SEND_EMAIL, 'Send Email'],
  [ApiAuditActionEnum.GET_EMAIL_STATUS, 'Get Email Status'],
  [ApiAuditActionEnum.CREATE_COMPANY, 'Create Company'],
  [ApiAuditActionEnum.UPDATE_COMPANY, 'Update Company'],
  [ApiAuditActionEnum.ENABLE_COMPANY, 'Enable Company'],
  [ApiAuditActionEnum.DISABLE_COMPANY, 'Disable Company'],
  [ApiAuditActionEnum.TEST_COMPANY_STATUS, 'Test Company Status'],
  [ApiAuditActionEnum.CREATE_CUSTOMER_PORTAL_REGISTRATION_URL, 'Create Customer Portal Registration URL'],
  [ApiAuditActionEnum.GET_CUSTOMERS_STATUSES, 'Get Customers Statuses'],
  [ApiAuditActionEnum.CREATE_MULTIPLE_SALES, 'Create Multiple Sales'],
  [ApiAuditActionEnum.REVOKE_CUSTOMER_PORTAL_INVITATION, 'Revoke Customer Portal Invitation'],
  [ApiAuditActionEnum.CHANGE_CLIENT_TOKENS, 'Change Client Tokens'],
  [ApiAuditActionEnum.GET_CARD_TYPE, 'Get Card Type'],
  [ApiAuditActionEnum.REFRESH_TOKEN, 'Refresh Token'],
  [ApiAuditActionEnum.REFRESH_TOKEN_WITH_GRACE_PERIOD, 'Refresh Token with Grace Period'],
  [ApiAuditActionEnum.REFRESH_TOKEN_GRACE_PERIOD_EXPIRED, 'Refresh Token, Grace Period Expired']
]);

export const ApiAuditActionFilterValues: ApiAuditActionEnum[] = [
  ApiAuditActionEnum.CREATE_SALE,
  ApiAuditActionEnum.UPDATE_SALE,
  ApiAuditActionEnum.UPDATE_SALES_METADATA,
  ApiAuditActionEnum.CANCEL_SALE,
  ApiAuditActionEnum.ARCHIVE_UNARCHIVE_SALE,
  ApiAuditActionEnum.GET_SALE_TRANSACTIONS,
  ApiAuditActionEnum.GET_SALES_STATUSES,
  ApiAuditActionEnum.GET_SALES_FOR_RECONSILATION,
  ApiAuditActionEnum.SEND_EMAIL,
  ApiAuditActionEnum.GET_EMAIL_STATUS,
  ApiAuditActionEnum.CREATE_COMPANY,
  ApiAuditActionEnum.UPDATE_COMPANY,
  ApiAuditActionEnum.ENABLE_COMPANY,
  ApiAuditActionEnum.DISABLE_COMPANY,
  ApiAuditActionEnum.TEST_COMPANY_STATUS,
  ApiAuditActionEnum.CREATE_CUSTOMER_PORTAL_REGISTRATION_URL,
  ApiAuditActionEnum.GET_CUSTOMERS_STATUSES,
  ApiAuditActionEnum.CREATE_MULTIPLE_SALES,
  ApiAuditActionEnum.REVOKE_CUSTOMER_PORTAL_INVITATION,
  ApiAuditActionEnum.CHANGE_CLIENT_TOKENS,
  ApiAuditActionEnum.GET_CARD_TYPE,
  ApiAuditActionEnum.REFRESH_TOKEN,
  ApiAuditActionEnum.REFRESH_TOKEN_WITH_GRACE_PERIOD,
  ApiAuditActionEnum.REFRESH_TOKEN_GRACE_PERIOD_EXPIRED
]
