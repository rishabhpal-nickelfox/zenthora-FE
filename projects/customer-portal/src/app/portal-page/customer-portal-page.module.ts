import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {CustomerPortalPageComponent} from "./customer-portal-page.component";
import {PlatformModule} from "@angular/cdk/platform";
import {CustomerPortalPageRoutingModule} from "./customer-portal-page-routing.module";
import {NavbarModule} from "./navbar/navbar.module";
import {PaymentMethodsModule} from "./payment-method-management/payment-methods.module";
import {MenuModule} from "../../../../common/src/lib/components/sidebar/menu.module";
import {SaleModule} from "./sales/sale.module";
import {CustomerTransactionModule} from "./transactions/customer-transaction.module";
import {UserModule} from "./users/user.module";
import {CustomerUserPersonalManagementModule} from "./personalmanagement/customer-user-personal-management.module";

@NgModule({
  declarations: [
    CustomerPortalPageComponent
  ],
  imports: [
    SharedModule,
    PlatformModule,
    CustomerPortalPageRoutingModule,
    NavbarModule,
    MenuModule,
    SaleModule,
    PaymentMethodsModule,
    CustomerTransactionModule,
    UserModule,
    CustomerUserPersonalManagementModule
  ]
})
export class CustomerPortalPageModule {
}
