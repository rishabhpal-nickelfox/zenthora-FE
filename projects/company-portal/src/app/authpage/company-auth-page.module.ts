import {NgModule} from '@angular/core';
import {CompanyAuthPageComponent} from './company-auth-page.component';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {RecaptchaTermsComponent} from "../../../../common/src/lib/recaptcha/recaptcha-terms.component";
import {RoleSelectComponent} from "./roleselect/role-select.component";
import {CommonAuthPageModule} from "../../../../common/src/lib/auth/common-auth-page.module";

@NgModule({
  declarations: [
    CompanyAuthPageComponent,
    RoleSelectComponent
  ],
  imports: [
    SharedModule,
    CommonAuthPageModule,
    RecaptchaTermsComponent
  ]
})
export class CompanyAuthPageModule {
}
