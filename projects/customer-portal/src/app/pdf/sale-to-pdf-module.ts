import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../common/src/lib/shared.module";
import {SaleViewModule} from "../../../../common/src/lib/sale/view/sale-view.module";
import {SaleToPdfComponent} from "./sale-to-pdf.component";

@NgModule({
  declarations: [
    SaleToPdfComponent
  ],
  imports: [
    SharedModule,
    SaleViewModule
  ],
  exports: [
    SaleToPdfComponent
  ],
  providers: []
})

export class SaleToPdfModule {
}
