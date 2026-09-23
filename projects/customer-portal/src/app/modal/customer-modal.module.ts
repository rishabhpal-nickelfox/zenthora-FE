import {NgModule} from '@angular/core';
import {NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {TextMaskModule} from '../../../../common/src/lib/directives/text-mask.module';
import {TrimValueAccessorModule} from '../../../../common/src/lib/directives/trim-value-accessor.module';
import {CustomDirectiveModule} from "../../../../common/src/lib/directives/custom-directive.module";
import {RecaptchaTermsComponent} from "../../../../common/src/lib/recaptcha/recaptcha-terms.component";
import {ComponentModule} from "../../../../common/src/lib/components/component.module";
import {CustomerPreFilledSignInModalComponent} from "./signin/prefilled/customer-pre-filled-sign-in-modal.component";
import {CustomerPreFilledLoginModal} from "./login/prefilled/customer-pre-filled-login-modal.component";
import {SaleEmailCustomerIsNotSuitableModalComponent} from "./checkout/sale-email-customer-is-not-suitable-modal.component";
import {UseExistingPaymentMethodModalComponent} from "./payment-method/use-existing-payment-method-modal.component";
import {ChangePasswordModule} from "../../../../common/src/lib/components/password/change-password.module";

@NgModule({
  declarations: [
    CustomerPreFilledSignInModalComponent,
    CustomerPreFilledLoginModal,
    SaleEmailCustomerIsNotSuitableModalComponent,
    UseExistingPaymentMethodModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrimValueAccessorModule,
    TextMaskModule,
    NbThemeModule,
    NgbModule,
    NbCardModule,
    NbSpinnerModule,
    ComponentModule,
    NbIconModule,
    CustomDirectiveModule,
    RecaptchaTermsComponent,
    ChangePasswordModule
  ],
  exports: [
    CustomerPreFilledSignInModalComponent,
    CustomerPreFilledLoginModal,
    SaleEmailCustomerIsNotSuitableModalComponent,
    UseExistingPaymentMethodModalComponent
  ]
})

export class CustomerModalModule {
}
