import {NgModule} from '@angular/core';
import {NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {TrimValueAccessorModule} from '../directives/trim-value-accessor.module';
import {TextMaskModule} from '../directives/text-mask.module';
import {ForgotPasswordComponent} from "./forgotpassword/forgot-password.component";
import {ChangePasswordLoginComponent} from "./changepassword/change-password-login.component";
import {LoginComponent} from "./login/login.component";
import {CustomDirectiveModule} from "../directives/custom-directive.module";
import {ComponentModule} from "../components/component.module";
import {UnderMaintenanceComponent} from "./undermaintenance/under-maintenance.component";
import {ChangePasswordModule} from "../components/password/change-password.module";

@NgModule({
  declarations: [
    ChangePasswordLoginComponent,
    ForgotPasswordComponent,
    LoginComponent,
    UnderMaintenanceComponent
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
    ChangePasswordModule
  ],
  exports: [
    ChangePasswordLoginComponent,
    ForgotPasswordComponent,
    LoginComponent,
    UnderMaintenanceComponent
  ]
})

export class CommonAuthPageModule {
}
