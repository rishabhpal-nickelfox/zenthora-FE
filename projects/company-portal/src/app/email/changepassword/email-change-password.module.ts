import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {EmailChangePasswordComponent} from './email-change-password.component';
import {RecaptchaTermsComponent} from "../../../../../common/src/lib/recaptcha/recaptcha-terms.component";
import {ChangePasswordModule} from "../../../../../common/src/lib/components/password/change-password.module";

@NgModule({
  declarations: [
    EmailChangePasswordComponent
  ],
  imports: [
    SharedModule,
    RecaptchaTermsComponent,
    ChangePasswordModule
  ]
})
export class EmailChangePasswordModule {
}
