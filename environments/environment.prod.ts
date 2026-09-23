export {SYSTEM_PREFIX} from '../projects/common/src/lib/common-environment';

export const environment = {
  production: true,
  statusCheckURL: 'status.json',
  statusCheckFrequency: 30000,
  cookieChangedVersion: '2.1.1',
  mockBackend: false
};

export const quickbooks_timezone = 'America/Los_Angeles';

export const portal_timezone = 'America/Los_Angeles';

export const inactivity_time = 900; //time in seconds
export const inactivity_alert_time = 20;
export const inactivity_login_failed_attempts = 3;

export const COOKIE_LOGGED_IN = 'TOKEN_2';
export const COOKIE_CUSTOMER_LOGGED_IN = 'PAYER_TOKEN_2';
export const password_minlength = 8;

export const portal_description = 'Zenthora Email Payment Service Portal';

export const alert_lifetime = 3000;

export const page_sizes = [5, 10, 20, 50];

export const CUSTOMER_PORTAL_URL = 'customer-portal';
export const COMPANY_PORTAL_URL = 'company-portal';
