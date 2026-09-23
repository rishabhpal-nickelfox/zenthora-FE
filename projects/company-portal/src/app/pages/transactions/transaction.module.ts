import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../common/src/lib/shared.module";
import {TransactionComponent} from "./transaction.component";
import {TransactionTableComponent} from "./transaction-table.component";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    TransactionComponent,
    TransactionTableComponent
  ],
  imports: [
    SharedModule,
    NgxPaginationModule
  ],
  exports: []
})
export class TransactionModule {
}
