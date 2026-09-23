import {PermissionModel} from "../models/permission.model";

export enum CustomerPermissionEnum {
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_SETTINGS = "MANAGE_SETTINGS",
  MANAGE_PAYMENT_METHODS = "MANAGE_PAYMENT_METHODS",
  VIEW_TRANSACTIONS = "VIEW_TRANSACTIONS",
  VIEW_INVOICES = "VIEW_INVOICES", // VIEW_INVOICES - parent of INVOICES_PROCESS_PAYMENTS
  INVOICES_PROCESS_PAYMENTS = "INVOICES_PROCESS_PAYMENTS", //PROCESS_PAYMENTS allows the use of saved methods, but does not provide the ability to edit or create.
  VIEW_SALESORDERS = "VIEW_SALESORDERS", // VIEW_SALESORDERS - parent of SALESORDERS_PROCESS_PAYMENTS
  SALESORDERS_PROCESS_PAYMENTS = "SALESORDERS_PROCESS_PAYMENTS",
  VIEW_DEPOSITS = "VIEW_DEPOSITS", // VIEW_DEPOSITS - parent of DEPOSITS_PROCESS_PAYMENTS
  DEPOSITS_PROCESS_PAYMENTS = "DEPOSITS_PROCESS_PAYMENTS",
}

export class CustomerPermissionEnumHelper {
  static getChildren(key: CustomerPermissionEnum): CustomerPermissionEnum[] {
    switch (key) {
      case CustomerPermissionEnum.VIEW_INVOICES:
        return [CustomerPermissionEnum.INVOICES_PROCESS_PAYMENTS];
      case CustomerPermissionEnum.VIEW_SALESORDERS:
        return [CustomerPermissionEnum.SALESORDERS_PROCESS_PAYMENTS];
      case CustomerPermissionEnum.VIEW_DEPOSITS:
        return [CustomerPermissionEnum.DEPOSITS_PROCESS_PAYMENTS];
      default:
        return [];
    }
  }


  static getParent(key: CustomerPermissionEnum):CustomerPermissionEnum{
    switch (key) {
      case CustomerPermissionEnum.INVOICES_PROCESS_PAYMENTS:
        return CustomerPermissionEnum.VIEW_INVOICES;
      case CustomerPermissionEnum.SALESORDERS_PROCESS_PAYMENTS:
        return CustomerPermissionEnum.VIEW_SALESORDERS;
      case CustomerPermissionEnum.DEPOSITS_PROCESS_PAYMENTS:
        return CustomerPermissionEnum.VIEW_DEPOSITS;
      default:
        return null;
    }
  }

  static getDisplayName(permission: PermissionModel): string {
    switch (permission.permissionKey) {
      case CustomerPermissionEnum.VIEW_INVOICES:
        return "Invoices";
      case CustomerPermissionEnum.VIEW_SALESORDERS:
        return "Sales Orders";
      case CustomerPermissionEnum.VIEW_DEPOSITS:
        return "Deposits";
      case CustomerPermissionEnum.INVOICES_PROCESS_PAYMENTS:
      case CustomerPermissionEnum.SALESORDERS_PROCESS_PAYMENTS:
      case CustomerPermissionEnum.DEPOSITS_PROCESS_PAYMENTS:
        return "Process Payments";
      default:
        return permission.name;
    }

  }
}
