import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {COMPANY_PORTAL_ROUTES} from "./company-portal.routes";

@NgModule({
  imports: [RouterModule.forRoot(COMPANY_PORTAL_ROUTES, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class CompanyPortalAppRoutingModule {
}
