import {NgModule} from '@angular/core';
import {NbCardModule, NbIconModule, NbSpinnerModule, NbThemeModule} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {TextMaskModule} from '../directives/text-mask.module';
import {TrimValueAccessorModule} from '../directives/trim-value-accessor.module';
import {ExternalModalComponent} from './external-modal.component';
import {ConfirmModalComponent} from './confirm/confirm-modal.component';
import {SimpleModalComponent} from './simple/simple-modal.component';
import {HtmlContentModalComponent} from "./htmlcontent/html-content-modal.component";
import {CustomDirectiveModule} from "../directives/custom-directive.module";
import {RecaptchaTermsComponent} from "../recaptcha/recaptcha-terms.component";
import {ComponentModule} from "../components/component.module";
import {ReceiptModalComponent} from "./receipt/receipt-modal.component";

@NgModule({
  declarations: [
    ExternalModalComponent,
    ConfirmModalComponent,
    SimpleModalComponent,
    HtmlContentModalComponent,
    ReceiptModalComponent
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
    ExternalModalComponent,
    ConfirmModalComponent,
    SimpleModalComponent,
    HtmlContentModalComponent,
    ReceiptModalComponent
  ]
})

export class ExternalModalModule {
}
