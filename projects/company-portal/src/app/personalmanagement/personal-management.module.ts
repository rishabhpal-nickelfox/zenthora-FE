import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {PersonalInfoComponent} from './personal-info.component';
import {ChangePasswordComponent} from './chagepassword/change-password.component';
import {ChangePasswordModalComponent} from "./chagepassword/change-password-modal.component";
import {ChangePasswordModule} from "../../../../common/src/lib/components/password/change-password.module";


@NgModule({
  declarations: [
    PersonalInfoComponent,
    ChangePasswordComponent,
    ChangePasswordModalComponent
  ],
  imports: [
    SharedModule,
    ChangePasswordModule
  ],
  exports: [
    PersonalInfoComponent]
})
export class PersonalManagementModule {
}
