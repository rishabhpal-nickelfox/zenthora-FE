import {NgModule} from '@angular/core';
import {NbIconModule, NbPopoverModule, NbSpinnerModule, NbThemeModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PasswordFieldComponent} from "./password-field.component";
import {ChangePasswordComponent} from "./change-password.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ComponentModule} from "../component.module";
import {CustomDirectiveModule} from "../../directives/custom-directive.module";

@NgModule({
  declarations: [
    PasswordFieldComponent,
    ChangePasswordComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    NbPopoverModule,
    NbThemeModule,
    NbIconModule,
    NbSpinnerModule,
    ComponentModule,
    ReactiveFormsModule,
    CustomDirectiveModule
  ],
  exports: [
    PasswordFieldComponent,
    ChangePasswordComponent
  ]
})
export class ChangePasswordModule {
}
