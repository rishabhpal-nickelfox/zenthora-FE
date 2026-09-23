import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EmailChangePasswordComponent} from "./changepassword/email-change-password.component";
import {AcceptRolesComponent} from "./acceptroles/accept-roles.component";
import {CompanySettingsGuard} from "../../guards/companymanagement/company-settings.guard";
import {CompanyPortalSettingsGuard} from "../../guards/company-portal-settings-guard.service";

const routes: Routes = [{
  path: '',
  canActivateChild: [CompanyPortalSettingsGuard],
  children: [
    {path: 'accept/:token', component: AcceptRolesComponent},
    {path: 'change-password/:token', component: EmailChangePasswordComponent}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRedirectRoutingModule {
}
