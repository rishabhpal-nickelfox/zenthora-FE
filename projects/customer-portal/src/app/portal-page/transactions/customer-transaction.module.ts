import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../common/src/lib/shared.module";
import {CustomerTransactionComponent} from "./customer-transaction.component";
import {CustomerTransactionTableComponent} from "./customer-transaction-table.component";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    CustomerTransactionComponent,
    CustomerTransactionTableComponent
  ],
  imports: [
    SharedModule,
    NgxPaginationModule
  ],
  exports: []
})
export class CustomerTransactionModule {
}
