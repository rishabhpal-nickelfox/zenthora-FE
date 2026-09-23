import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbAlertModule, NbCheckboxModule, NbIconModule, NbThemeModule} from '@nebular/theme';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CreditCardInfoGroupComponent} from './credit-card-info-group.component';
import {TrimValueAccessorModule} from '../../directives/trim-value-accessor.module';
import {TextMaskModule} from '../../directives/text-mask.module';
import {CustomDirectiveModule} from "../../directives/custom-directive.module";
import {ComponentModule} from "../../components/component.module";
import {CreditCardService} from "./credit-card.service";

@NgModule({
  declarations: [
    CreditCardInfoGroupComponent
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
    CustomDirectiveModule
  ],
  exports: [
    CreditCardInfoGroupComponent
  ],
  providers: [
    CreditCardService
  ]
})
export class CreditCardInfoModule {
}
