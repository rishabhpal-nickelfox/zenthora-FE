export enum ErrorMessageEnum {
  authentication_error = 'Authentication error. Check your login and/or password and try again.',
  wrong_password = 'Wrong password',
  jwt_token_expired = 'Session expired. Please re-login.',
  unknown_jwt_id = 'User not found. Check your login and/or password and try again.',
  account_disabled = 'Account disabled.',
  company_disabled = 'Company has been disabled.',
  data_error = '',
  request_format_error = 'Request format error.',
  role_in_use = 'Can not delete the role assigned to one or more users.',
  cannot_enable_yourself = 'You can\'t enable your own account.',
  cannot_disable_yourself = 'You can\'t disable your own account.',
  ein_exists = 'EIN already exists',
  login_exists = 'Login (email) already exists',
  login_exists_in_entity = 'Login (email) already exists in company',
  user_not_found = 'User id=%s not found',
  role_not_found = 'Role id=%s not found',
  permission_not_found = 'Permission id=%s not found',
  entity_type_not_found = 'Entity type id=%s not found',
  entity_not_found = 'Entity id=%s not found',
  payer_not_found = 'Payer id=%s not found',
  access_forbidden = 'Access to role id=%s forbidden',
  permission_protected = 'Can not delete protected permission',
  company_and_property_id_exists = 'Property id already exists',
  payment_method_is_not_suitable = 'You can not use this payment method to pay for this Sale',
  payer_user_email_already_registered = 'The email address you entered is already registered',
  not_found = 'id=%s not found',
  attempts_left = 'Attempts left: %s',
  max_users_exceeded = 'Max number of users exceeded. Please contact system administrator to increase the limit.',
  vault_error_code = 'Vault error code: %s;',
  vault_error_message = 'Message: %s',
  using_old_passwords_is_not_allowed = 'Your new password cannot be the same as one of your 10 previous passwords. Please choose another new password',
  active_role_not_found = 'Active role not found',
  common_something_went_wrong = 'Something went wrong',
  user_must_change_password = 'User must change password',
  password_change_url_expired = 'Password change URL expired',
  email_receipt_disabled_in_platform = 'Email Receipt disabled in the Platform',

  vault_is_not_configured = 'Vault is not configured',
  bank_error_code = 'Bank error code: %s;',
  bank_error_message = 'Message: %s',
  invalid_vault_credentials = 'Invalid Vault credentials',
  subscription_not_active = 'Required product is not enabled on the account',
  invoice_has_changed = 'Invoice has changed',
  payment_amount_exceeds_credit_card_transaction_limit = 'Payment amount exceeds Credit Card transaction limit',
  payment_amount_exceeds_amount_due = 'Sale amount due has changed',
  ach_payments_disabled = 'ACH payments have been disabled',
  cc_payments_disabled = 'Credit Card payments have been disabled',
  partial_payments_disabled = 'Partial payments have been disabled',
  bad_surcharge_amount = 'Bad surcharge amount',
  payment_form_code_not_unique = 'Payment form code must be unique',
  payment_forms_company_id_not_configured = 'Company Id for Payment Forms is not configured',

  token_count_exceeds_limit = 'Token count exceeds limit',
  user_limit_exceeded = 'User limit has been exceeded',
  DOES_NOT_CURRENTLY_SUPPORT_GLOBAL_PAYMENTS = 'Company does not currently support Global Payments.\nPlease use a card issued in US or Canada.',
  customer_user_was_already_invited_to_customer = 'User was already invited',
  customer_user_email_is_already_registered = 'Customer email is already registered',
  payment_can_contain_sales_only_with_same_currency = 'Payment can contain only sales with the same currency',
  max_numbers_length_exceeded = 'The limit of selected invoices has been exceeded',
  sale_has_been_canceled = 'Sale %s has been cancelled',
  branding_in_use = 'Branding is used by the platform',
  branding_name_not_unique = 'Branding Name must be unique',
  branding_cannot_disable_default = 'You can\'t disable the default Branding',
  NotBlank = '%s cannot be blank',
  NotEmpty = '%s cannot be blank',
  Size = 'Wrong size',
  NotNull = '%s cannot be blank',
  Email = 'Ill-formed email.',
  EmailNamed = 'Must be a valid email in format: email@example.com or Name <email@example.com>',
  EmailList = 'Must be a comma-separated list of valid emails',
  Format = 'Bad %s format',
  Digits = '%s value out of bounds',
  Pattern = '%s does not match pattern',
  MustExistInEntity = '%s not found',
  MustExist = '%s not found',
  DecimalMin = '%s value less than minimum',
  ValidCreditCardNumberLuah = 'Credit card number is not valid',
  ValidCreateSalesReceipt = 'Invalid value',
  ValidContainsUpperCaseLetters = 'Must contain at least one upper case letter',
  ValidContainsDigits = 'Must contain at least one digit',
  EnumNamePatternValid = 'Invalid enum value',
  Positive  = '%s must be greater than 0',
  Max = '%s value out of bounds',
  NoJavaScript = 'Must not contain JavaScript'
}

export function getErrorMessageOrDefault(code: string) {
  return ErrorMessageEnum[code] || DEFAULT_ERROR_MSG;
}


export const DEFAULT_ERROR_HEADER = 'Server Error %s (%s)';
export const DEFAULT_ERROR_MSG = 'Please contact System Administrator.';
export const SERVER_ERROR_MSG = '%s';

export const CONNECTION_ERROR_HEADER = 'Server is temporarily unavailable';
export const CONNECTION_ERROR_MSG = 'Please try again later';

export const USER_EXISTS_ERROR_CODE = 'login_exists';
export const JWT_TOKEN_EXPIRED = 'jwt_token_expired';
export const COMPANY_DISABLED = 'company_disabled';
export const ACCOUNT_DISABLED = 'account_disabled';

export const POPUP_BLOCKED_ERROR_HEADER = 'Pop-up blocked';
export const POPUP_BLOCKED_ERROR_MSG = 'Please allow pop-ups for this site and try again';

export const VAULT_ERROR_HEADER = 'Vault Error';

export const GOOGLE_RECAPTCHA_ERROR_HEADER = 'Invalid Recaptcha';

export const SENDING_REQUEST_FAILED_ERROR_HEADER = 'Outbound request not departing';
export const SENDING_REQUEST_FAILED_ERROR_MESSAGE = 'Please contact System Administrator.';

export const CSRF_TOKEN_ERROR = 'csrf_token_error';
