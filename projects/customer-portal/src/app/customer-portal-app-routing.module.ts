import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CUSTOMER_PORTAL_ROUTES} from "./customer-portal.routes";


@NgModule({
  imports: [RouterModule.forRoot(CUSTOMER_PORTAL_ROUTES, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class CustomerPortalAppRoutingModule {
}
