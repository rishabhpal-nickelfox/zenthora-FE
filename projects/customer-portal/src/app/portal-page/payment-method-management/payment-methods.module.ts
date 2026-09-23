import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../common/src/lib/shared.module";
import {CustomerPortalPaymentMethodsManagementComponent} from "./customer-portal-payment-methods-management.component";
import {PaymentModule} from "../../../../../common/src/lib/payment/payment.module";


@NgModule({
  declarations: [
    CustomerPortalPaymentMethodsManagementComponent
  ],
  imports: [
    SharedModule,
    PaymentModule
  ],
  exports: []
})
export class PaymentMethodsModule {
}
