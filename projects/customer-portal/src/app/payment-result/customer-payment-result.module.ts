import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {CustomerPaymentResultComponent} from './customer-payment-result.component';

@NgModule({
  declarations: [
    CustomerPaymentResultComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CustomerPaymentResultComponent
  ]
})
export class CustomerPaymentResultModule {
}
