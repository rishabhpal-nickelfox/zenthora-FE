import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {SaleEmailPaymentComponent} from './sale-email-payment.component';
import {NbAlertModule} from '@nebular/theme';
import {SaleEmailPaymentService} from '../../services/sale-email-payment.service';
import {ACHModule} from "../../../../common/src/lib/payment/ach/ach.module";
import {CreditCardInfoModule} from "../../../../common/src/lib/payment/creditcard/credit-card-info.module";
import {DecimalPipe} from "@angular/common";
import {SaleViewModule} from "../../../../common/src/lib/sale/view/sale-view.module";
import {PaymentModule} from "../../../../common/src/lib/payment/payment.module";
import {RecaptchaTermsComponent} from "../../../../common/src/lib/recaptcha/recaptcha-terms.component";
import {CustomerPaymentResultModule} from '../payment-result/customer-payment-result.module';

@NgModule(
  {
    declarations: [
      SaleEmailPaymentComponent,
    ],
    imports: [
      SharedModule,
      ACHModule,
      CreditCardInfoModule,
      NbAlertModule,
      SaleViewModule,
      PaymentModule,
      CustomerPaymentResultModule,
      RecaptchaTermsComponent

    ],
    exports: [],
    providers: [
      SaleEmailPaymentService,
      DecimalPipe
    ]
  })
export class SaleEmailModule {
}
