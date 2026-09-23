import {NgModule} from '@angular/core';
import {InvoicePaymentTemplateModule, ReceiptTemplateModule} from "@eps/common";
import {CompanyInfoTemplateInterpretComponent} from "../../../../../../../../../common/src/lib/sale/template/interpret/common/companyinfo/company-info-template-interpret.component";

@NgModule({
  imports: [
    CompanyInfoTemplateInterpretComponent,
    InvoicePaymentTemplateModule,
    ReceiptTemplateModule
  ],
  exports: [
    InvoicePaymentTemplateModule,
    ReceiptTemplateModule
  ]
})

export class SaleEmailPaymentTemplateModule {
}
