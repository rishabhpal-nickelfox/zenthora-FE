import {NgModule} from '@angular/core';
import {CreditCardInfoModule} from './creditcard/credit-card-info.module';
import {ACHModule} from './ach/ach.module';
import {PaymentMethodsComponent} from "./paymentmethod/payment-methods.component";
import {NbAlertModule, NbCheckboxModule, NbIconModule, NbTabsetModule, NbThemeModule} from "@nebular/theme";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TrimValueAccessorModule} from '../directives/trim-value-accessor.module';
import {TextMaskModule} from '../directives/text-mask.module';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CustomDirectiveModule} from "../directives/custom-directive.module";
import {PaymentMethodPreviewComponent} from "./paymentmethod/payment-method-preview.component";
import {CarouselModule} from "ngx-bootstrap/carousel";
import {ComponentModule} from "../components/component.module";

@NgModule({
  declarations: [
    PaymentMethodsComponent,
    PaymentMethodPreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrimValueAccessorModule,
    TextMaskModule,
    NbCheckboxModule,
    NgbModule,
    NbThemeModule,
    ComponentModule,
    NbAlertModule,
    NbIconModule,
    CustomDirectiveModule,
    CreditCardInfoModule,
    ACHModule,
    NbTabsetModule,
    CarouselModule.forRoot()
  ],
  exports: [
    PaymentMethodsComponent,
    CreditCardInfoModule,
    ACHModule
  ]
})
export class PaymentModule {
}
