import {NgModule} from '@angular/core';
import {NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {TextMaskModule} from '../../../../common/src/lib/directives/text-mask.module';
import {TrimValueAccessorModule} from '../../../../common/src/lib/directives/trim-value-accessor.module';
import {LoginModalComponent} from "./login/login-modal.component";
import {ComponentModule} from "../../../../common/src/lib/components/component.module";
import {CustomDirectiveModule} from "../../../../common/src/lib/directives/custom-directive.module";
import {RecaptchaTermsComponent} from "../../../../common/src/lib/recaptcha/recaptcha-terms.component";

@NgModule({
  declarations: [
    LoginModalComponent
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
    RecaptchaTermsComponent
  ],
  exports: [
    LoginModalComponent
  ]
})

export class CompanyExternalModalComponent {
}
