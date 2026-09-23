import {NgModule} from '@angular/core';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {SaleViewComponent} from "./sale-view.component";
import {SaleEmailPaymentTemplateInterpretModule} from "../template/interpret/sale-email-payment-template-interpret.module";
import {SharedModule} from "../../shared.module";
import {PaymentHistoryComponent} from "./payment-history.component";

@NgModule(
  {
    declarations: [
      SaleViewComponent,
      PaymentHistoryComponent
    ],
    imports: [
      SharedModule,
      SaleEmailPaymentTemplateInterpretModule,
      NgxExtendedPdfViewerModule
    ],
    exports: [
      SaleViewComponent,
      PaymentHistoryComponent
    ]

  })
export class SaleViewModule {
}
