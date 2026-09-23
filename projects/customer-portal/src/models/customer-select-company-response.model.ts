import {CustomerPermissionEnum} from "../enums/customer-permission.enum";

export class CustomerSelectCompanyResponseModel {
  permissions: CustomerPermissionEnum[];
  hasInvoices: boolean;
  hasSalesOrders: boolean;
  hasDeposits: boolean;
  globalPaymentsEnabled: boolean;
  legalName: string;
  logo: {type: string, value: string};
  favicon: {type: string, value: string};
  theme: Map<string, string>;

  static fromJSON(json): CustomerSelectCompanyResponseModel {
    const model = new CustomerSelectCompanyResponseModel();
    model.permissions = json.permissions || [];
    model.hasInvoices = json.hasInvoices;
    model.hasSalesOrders = json.hasSalesOrders;
    model.hasDeposits = json.hasDeposits;
    model.globalPaymentsEnabled = json.globalPaymentsEnabled;
    model.legalName = json.legalName;
    model.logo = json.logo;
    model.favicon = json.favicon;
    if (json.theme) {
      model.theme = new Map(JSON.parse(json.theme));
    }
    return model;
  }
}
