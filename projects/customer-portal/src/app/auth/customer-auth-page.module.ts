import {NgModule} from '@angular/core';
import {CustomerAuthPageComponent} from './customer-auth-page.component';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {RecaptchaTermsComponent} from "../../../../common/src/lib/recaptcha/recaptcha-terms.component";
import {CustomerCompanySelectComponent} from "./companyselect/customer-company-select.component";
import {CommonAuthPageModule} from "../../../../common/src/lib/auth/common-auth-page.module";

@NgModule({
  declarations: [
    CustomerAuthPageComponent,
    CustomerCompanySelectComponent
  ],
  imports: [
    SharedModule,
    CommonAuthPageModule,
    RecaptchaTermsComponent
  ]
})
export class CustomerAuthPageModule {
}
