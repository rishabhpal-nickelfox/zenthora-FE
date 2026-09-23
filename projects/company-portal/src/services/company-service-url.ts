export class CompanyServiceUrl {
  static readonly API_AUDIT = 'api-audit';
  static readonly API_TOKEN = 'api-tokens';
  static readonly AUDIT = 'audit';
  static readonly ENTITY = 'entities';
  static readonly PAYMENT_FORMS = 'payment-forms';
  static readonly VAULT = 'vault';
  static readonly EMAIL = 'email/view';
  static readonly PLATFORM = 'platforms';
  static readonly BRANDING = 'branding';
  static readonly SENDGRID_SETTINGS = 'sendgrid/settings';
  static readonly SENDGRID_AUDIT = 'sendgrid/audit';
  static readonly ROLE = 'roles';
  static readonly USER = 'users';
  static readonly VAULT_ERROR = 'vaulterrors';
  static readonly WEBHOOK_ERROR = 'webhook-error';
  static readonly WEBHOOK = 'webhook';
  static readonly AUTH = 'auth';
  static readonly ACCEPT_ROLES = 'accept';
  static readonly TRANSACTION = 'transactions';
  static readonly SALES = 'sales';

  static get urls(): string[] {
    return Object.values(CompanyServiceUrl);
  }
}
