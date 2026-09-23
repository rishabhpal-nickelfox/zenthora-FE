import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {CreditCardInfoModule} from '../../../../common/src/lib/payment/creditcard/credit-card-info.module';
import {RecaptchaTermsComponent} from '../../../../common/src/lib/recaptcha/recaptcha-terms.component';
import {PaymentFormPaymentComponent} from './payment-form-payment.component';
import {PaymentFormPaymentService} from './payment-form-payment.service';
import {CustomerPaymentResultModule} from '../payment-result/customer-payment-result.module';

@NgModule({
  declarations: [
    PaymentFormPaymentComponent
  ],
  imports: [
    SharedModule,
    CreditCardInfoModule,
    CustomerPaymentResultModule,
    RecaptchaTermsComponent
  ],
  providers: [
    PaymentFormPaymentService
  ]
})
export class PaymentFormPaymentModule {
}
