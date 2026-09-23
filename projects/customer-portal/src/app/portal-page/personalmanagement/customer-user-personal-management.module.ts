import {NgModule} from '@angular/core';
import {CustomerUserPersonalInfoComponent} from './customer-user-personal-info.component';
import {SharedModule} from "../../../../../common/src/lib/shared.module";
import {
  CustomerUserPersonalInfoChangePasswordModalComponent
} from "./customer-user-personal-info-change-password-modal.component";
import {ChangePasswordModule} from "../../../../../common/src/lib/components/password/change-password.module";


@NgModule({
  declarations: [
    CustomerUserPersonalInfoComponent,
    CustomerUserPersonalInfoChangePasswordModalComponent
  ],
  imports: [
    SharedModule,
    ChangePasswordModule
  ],
  exports: [
    CustomerUserPersonalInfoComponent,
    CustomerUserPersonalInfoChangePasswordModalComponent
  ],
  providers:[
    CustomerUserPersonalInfoChangePasswordModalComponent
  ]
})
export class CustomerUserPersonalManagementModule {
}
