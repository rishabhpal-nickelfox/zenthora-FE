import {Inject, Injectable} from "@angular/core";
import {BasePageMenuService} from "../../../common/src/lib/utils/base-page-menu.service";
import {NbMenuItem} from "@nebular/theme";
import {CustomerPortalPagePath} from "../app/portal-page/customer-portal-page-path";
import {CustomerPermissionService} from "./customer-permission.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";


@Injectable()
export class CustomerPageMenuService extends BasePageMenuService {
  private static readonly INVOICE_TITLE = 'Invoices';
  private static readonly SALES_ORDER_TITLE = 'Sales Orders';
  private static readonly DEPOSIT_TITLE = 'Deposits';
  private static readonly PAYMENT_METHODS_TITLE = 'Payment Methods';
  private static readonly TRANSACTIONS_TITLE = 'Transactions';
  private static readonly USERS_TITLE = 'Users';


  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, protected customerPermissionService: CustomerPermissionService) {
    super(settingsProvider);
  }

  private get INVOICE_MENU_NODE(): NbMenuItem {
    return {
      title: CustomerPageMenuService.INVOICE_TITLE,
      link: this.link(CustomerPortalPagePath.INVOICES)
    };
  }

  private get SALES_ORDER_MENU_NODE(): NbMenuItem {
    return {
      title: CustomerPageMenuService.SALES_ORDER_TITLE,
      link: this.link(CustomerPortalPagePath.SALES_ORDERS)
    };
  }

  private get DEPOSIT_MENU_NODE(): NbMenuItem {
    return {
      title: CustomerPageMenuService.DEPOSIT_TITLE,
      link: this.link(CustomerPortalPagePath.DEPOSITS)
    };
  }

  private get PAYMENT_METHODS_MENU_NODE(): NbMenuItem {
    return {
      title: CustomerPageMenuService.PAYMENT_METHODS_TITLE,
      link: this.link(CustomerPortalPagePath.PAYMENT_METHODS)
    };
  }

  private get TRANSACTIONS_MENU_NODE(): NbMenuItem {
    return {
      title: CustomerPageMenuService.TRANSACTIONS_TITLE,
      link: this.link(CustomerPortalPagePath.TRANSACTIONS)
    };
  }

  private get USERS_NODE(): NbMenuItem {
    return {
      title: CustomerPageMenuService.USERS_TITLE,
      link: this.link(CustomerPortalPagePath.USERS)
    };
  }

  protected onReInit() {
    this.menu = [];
    if (this.customerPermissionService.canViewInvoices) {
      this.menu.push(this.INVOICE_MENU_NODE);
    }
    if (this.customerPermissionService.canViewSalesOrders) {
      this.menu.push(this.SALES_ORDER_MENU_NODE);
    }
    if (this.customerPermissionService.canViewDeposits) {
      this.menu.push(this.DEPOSIT_MENU_NODE);
    }
    if (this.customerPermissionService.canManagePaymentMethods) {
      this.menu.push(this.PAYMENT_METHODS_MENU_NODE);
    }
    if (this.customerPermissionService.canViewTransactions) {
      this.menu.push(this.TRANSACTIONS_MENU_NODE);
    }
    if (this.customerPermissionService.canManageUsers) {
      this.menu.push(this.USERS_NODE);
    }
    this.menuChanged.emit();
  }

  static getFullArrayOfMenuTitles(): string[] {
    return [
      CustomerPageMenuService.INVOICE_TITLE,
      CustomerPageMenuService.SALES_ORDER_TITLE,
      CustomerPageMenuService.DEPOSIT_TITLE,
      CustomerPageMenuService.PAYMENT_METHODS_TITLE,
      CustomerPageMenuService.TRANSACTIONS_TITLE,
      CustomerPageMenuService.USERS_TITLE
    ];
  }

}
