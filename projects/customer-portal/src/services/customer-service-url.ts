export class CustomerServiceUrl {
  static readonly AUTH = 'customer';
  static readonly CUSTOMER = 'customer';
  static readonly CUSTOMER_CURRENT = 'customer/current';
  static readonly EMAIL_SALE = 'email/sale';
  static readonly COMPANY_CUSTOMER = 'company-customer';
  static readonly SALE = 'customer/sales';
  static readonly INVOICE = 'customer/invoices';
  static readonly SALES_ORDER = 'customer/sales-orders';
  static readonly DEPOSIT = 'customer/deposits';
  static readonly TRANSACTION = 'customer/transactions';
  static readonly USER = 'customer/users';

  static get urls(): string[] {
    return Object.values(CustomerServiceUrl);
  }
}
