import {EmailRedirectRoutingModule} from './email-redirect-routing.module';
import {NgModule} from '@angular/core';
import {AcceptRolesModule} from "./acceptroles/accept-roles.module";
import {EmailChangePasswordModule} from "./changepassword/email-change-password.module";

@NgModule({
  declarations: [],
  imports: [
    EmailRedirectRoutingModule,
    AcceptRolesModule,
    EmailChangePasswordModule
  ]
})
export class EmailRedirectModule {
}
