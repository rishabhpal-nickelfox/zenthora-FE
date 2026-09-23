import {Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {CompanyAuthPageComponent} from "./authpage/company-auth-page.component";
import {CompanyPortalSettingsGuard} from "../guards/company-portal-settings-guard.service";

export const COMPANY_PORTAL_ROUTES: Routes = [
  {path: '', pathMatch: 'full', redirectTo: `login`},
  {
    path: '',
    component: AppComponent,
    canActivateChild: [CompanyPortalSettingsGuard],
    children: [
      {path: '', loadChildren: () => import('./pages/company-portal-page.module').then(m => m.CompanyPortalPageModule)},
      {path: 'login', component: CompanyAuthPageComponent},
      {
        path: '',
        loadChildren: () => import('./email/email.redirect.module').then(m => m.EmailRedirectModule)
      }
    ]
  }

];
