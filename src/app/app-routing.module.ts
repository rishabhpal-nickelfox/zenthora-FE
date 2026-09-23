import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {COMPANY_PORTAL_URL, CUSTOMER_PORTAL_URL} from "../../environments/environment";

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: `${CUSTOMER_PORTAL_URL}`},
  {
    path: COMPANY_PORTAL_URL,
    loadChildren: () => import('../../projects/company-portal/src/app/company-portal-shared.module').then(m => m.CompanyPortalSharedModule)
  },
  {
    path: CUSTOMER_PORTAL_URL,
    loadChildren: () => import('../../projects/customer-portal/src/app/customer-portal-shared.module').then(m => m.CustomerPortalSharedModule)
  },
  {
    path: 'pay/:token',
    redirectTo: `${CUSTOMER_PORTAL_URL}/pay/:token`
  },
  {
    path: 'forms/:companyCode/:paymentFormId',
    redirectTo: `${CUSTOMER_PORTAL_URL}/forms/:companyCode/:paymentFormId`
  },
  {
    path: 'pdf/:key',
    redirectTo: `${CUSTOMER_PORTAL_URL}/pdf/:key`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
