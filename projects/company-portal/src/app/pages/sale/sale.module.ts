import {NgModule} from '@angular/core';
import {SaleComponent} from './sale.component';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';
import {SalePreviewComponent} from "./sale-preview.component";
import {SaleViewModule} from "../../../../../common/src/lib/sale/view/sale-view.module";

@NgModule({
  declarations: [
    SaleComponent,
    SalePreviewComponent
  ],
    imports: [
        SharedModule,
        NbSelectModule,
        SaleViewModule
    ],
  exports: [
    SaleComponent
  ],
  providers: [
  ]
})

export class SaleModule {
}
