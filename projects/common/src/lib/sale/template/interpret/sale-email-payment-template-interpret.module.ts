import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {NbAlertModule, NbIconModule} from '@nebular/theme';
import {SaleEmailPaymentFullTemplateInterpretComponent} from './full/sale-email-payment-full-template-interpret.component';
import {RichTextViewerComponent} from '../../../components/richtextviewer/rich-text-viewer.component';
import {CompanyInfoTemplateInterpretComponent} from "./common/companyinfo/company-info-template-interpret.component";

@NgModule(
  {
    declarations: [
      SaleEmailPaymentFullTemplateInterpretComponent
    ],
    imports: [
      CommonModule,
      NbIconModule,
      NbAlertModule,
      RichTextViewerComponent,
      CompanyInfoTemplateInterpretComponent
    ],
    providers: [
      DecimalPipe
    ],
    exports: [
      SaleEmailPaymentFullTemplateInterpretComponent
    ]
  })
export class SaleEmailPaymentTemplateInterpretModule {
}
