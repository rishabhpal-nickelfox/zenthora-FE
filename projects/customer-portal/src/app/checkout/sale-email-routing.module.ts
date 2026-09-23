import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SaleEmailPaymentComponent} from "./sale-email-payment.component";

const routes: Routes = [{
  path: '',
  children: [
    {path: ':token', component: SaleEmailPaymentComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleEmailRoutingModule {
}
