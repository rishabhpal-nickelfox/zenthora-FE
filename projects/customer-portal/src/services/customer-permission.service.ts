import {Injectable} from "@angular/core";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {CustomerPermissionEnum} from "../enums/customer-permission.enum";
import {DocTypeEnum} from "@eps/common";

@Injectable()
export class CustomerPermissionService {

  constructor(private currentDataService: CustomerCurrentDataService) {
  }

  get canManageUsers(): boolean {
    return this.hasPermission(CustomerPermissionEnum.MANAGE_USERS);
  }

  get canManageSettings(): boolean {
    return this.hasPermission(CustomerPermissionEnum.MANAGE_SETTINGS);
  }

  get canManagePaymentMethods(): boolean {
    return this.hasPermission(CustomerPermissionEnum.MANAGE_PAYMENT_METHODS);
  }

  get canViewTransactions(): boolean {
    return this.hasPermission(CustomerPermissionEnum.VIEW_TRANSACTIONS);
  }

  get canViewInvoices() {
    return this.hasPermission(CustomerPermissionEnum.VIEW_INVOICES) && this.hasSale(DocTypeEnum.INVOICE);
  }

  get canViewSalesOrders() {
    return this.hasPermission(CustomerPermissionEnum.VIEW_SALESORDERS) && this.hasSale(DocTypeEnum.SALES_ORDER);
  }

  get canViewDeposits() {
    return this.hasPermission(CustomerPermissionEnum.VIEW_DEPOSITS) && this.hasSale(DocTypeEnum.DEPOSIT);
  }

  get canProcessInvoicesPayments(): boolean {
    return this.hasPermission(CustomerPermissionEnum.INVOICES_PROCESS_PAYMENTS);
  }

  get canProcessSalesOrdersPayments(): boolean {
    return this.hasPermission(CustomerPermissionEnum.SALESORDERS_PROCESS_PAYMENTS);
  }

  get canProcessDepositsPayments(): boolean {
    return this.hasPermission(CustomerPermissionEnum.DEPOSITS_PROCESS_PAYMENTS);
  }

  canProcessSalePayments(saleDocType: DocTypeEnum): boolean {
    switch (saleDocType) {
      case DocTypeEnum.INVOICE:
        return this.canProcessInvoicesPayments;
      case DocTypeEnum.SALES_ORDER:
        return this.canProcessSalesOrdersPayments;
      case DocTypeEnum.DEPOSIT:
        return this.canProcessDepositsPayments;
      default:
        throw new Error(`No such DocTypeEnum ${saleDocType}`);
    }
  }

  private hasPermission(permission: CustomerPermissionEnum): boolean {
    return ObjectHelper.isDefined(this.currentDataService.permissions.find(p => p == permission));
  }

  private hasSale(saleDocType: DocTypeEnum) {
    return this.currentDataService.saleTypes.indexOf(saleDocType) >= 0;
  }

}
