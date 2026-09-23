import {NgModule} from '@angular/core';
import {PayerConfirmRegistrationComponent} from './registration/self/payer-confirm-registration.component';
import {CustomerResetPasswordComponent} from "./changepassword/customer-email-change-password.component";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {CustomerCompanyInvitationComponent} from "./registration/company/customer-company-invitation.component";
import {
  CustomerCompanyConfirmInvitationComponent
} from "./registration/company/customer-company-confirm-invitation.component";
import {SharedModule} from "../../../../common/src/lib/shared.module";
import {RecaptchaTermsComponent} from "../../../../common/src/lib/recaptcha/recaptcha-terms.component";
import {ACHModule} from "../../../../common/src/lib/payment/ach/ach.module";
import {CreditCardInfoModule} from "../../../../common/src/lib/payment/creditcard/credit-card-info.module";
import {PaymentModule} from "../../../../common/src/lib/payment/payment.module";
import {ChangePasswordModule} from "../../../../common/src/lib/components/password/change-password.module";

@NgModule({
  declarations: [
    PayerConfirmRegistrationComponent,
    CustomerResetPasswordComponent,
    CustomerCompanyInvitationComponent,
    CustomerCompanyConfirmInvitationComponent
  ],
  imports: [
    SharedModule,
    RecaptchaTermsComponent,
    ACHModule,
    CarouselModule,
    CreditCardInfoModule,
    PaymentModule,
    ChangePasswordModule
  ]
})
export class CustomerEmailModule {
}
