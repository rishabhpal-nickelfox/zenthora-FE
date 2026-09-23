import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CustomerPortalPageComponent} from "./customer-portal-page.component";
import {CustomerPortalPagePath} from "./customer-portal-page-path";
import {
  CustomerPortalPaymentMethodsManagementComponent
} from "./payment-method-management/customer-portal-payment-methods-management.component";
import {CustomerAuthGuard} from "../../guards/customer-auth.guard";
import {CustomerPaymentMethodsGuard} from "../../guards/customer-payment-methods.guard";
import {CustomerTransactionComponent} from "./transactions/customer-transaction.component";
import {CustomerTransactionsGuard} from "../../guards/customer-transactions.guard";
import {InvoiceComponent} from "./sales/invoice/invoice.component";
import {SalesOrderComponent} from "./sales/sales-order/sales-order.component";
import {DepositComponent} from "./sales/deposit/deposit.component";
import {CustomerUsersGuard} from "../../guards/customer-users.guard";
import {UserComponent} from "./users/user.component";
import {CustomerPortalAvailableGuard} from "../../guards/customer-portal-available.guard";
import {CustomerPendingChangesGuard} from "../../guards/customer-pending-changes.guard";
import {CustomerUserPersonalInfoComponent} from "./personalmanagement/customer-user-personal-info.component";
import {CustomerPortalSettingsGuard} from "../../guards/customer-settings-guard.service";

const routes: Routes = [{
  path: '',
  component: CustomerPortalPageComponent,
  children: [
    {
      path: CustomerPortalPagePath.PERSONAL_INFO,
      component: CustomerUserPersonalInfoComponent,
      canActivate: [CustomerAuthGuard],
      canDeactivate: [CustomerPendingChangesGuard]
    },
    {
      path: CustomerPortalPagePath.INVOICES,
      component: InvoiceComponent,
      canActivate: [CustomerAuthGuard],
      canDeactivate: [CustomerPendingChangesGuard]
    },
    {
      path: CustomerPortalPagePath.SALES_ORDERS,
      component: SalesOrderComponent,
      canActivate: [CustomerAuthGuard],
      canDeactivate: [CustomerPendingChangesGuard]
    },
    {
      path: CustomerPortalPagePath.DEPOSITS,
      component: DepositComponent,
      canActivate: [CustomerAuthGuard],
      canDeactivate: [CustomerPendingChangesGuard]
    },
    {
      path: CustomerPortalPagePath.PAYMENT_METHODS,
      component: CustomerPortalPaymentMethodsManagementComponent,
      canActivate: [CustomerAuthGuard, CustomerPaymentMethodsGuard],
      canDeactivate: [CustomerPendingChangesGuard]
    },
    {
      path: CustomerPortalPagePath.TRANSACTIONS,
      component: CustomerTransactionComponent,
      canActivate: [CustomerAuthGuard, CustomerTransactionsGuard]
    },
    {
      path: CustomerPortalPagePath.USERS,
      component: UserComponent,
      canActivate: [CustomerAuthGuard, CustomerUsersGuard],
      canDeactivate: [CustomerPendingChangesGuard]
    }
  ],
  canActivateChild: [CustomerPortalSettingsGuard],
  canActivate: [CustomerAuthGuard, CustomerPortalAvailableGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPortalPageRoutingModule {
}
