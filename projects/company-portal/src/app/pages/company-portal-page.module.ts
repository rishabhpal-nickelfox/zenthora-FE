import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CompanyPortalPageRoutingModule} from './company-portal-page-routing.module';
import {SharedModule} from '../../../../common/src/lib/shared.module';
import {CompanyPortalPageComponent} from './company-portal-page.component';
import {UserManagementModule} from './usermanagement/user-management.module';
import {CompanyManagementModule} from './companymanagement/company-management.module';
import {PlatformModule} from "./platform/platform.module";
import {SaleModule} from "./sale/sale.module";
import {SendgridSyncModule} from "./sendgrid/sync/sendgrid-sync.module";
import {ApiActivityModule} from "./apiactivity/api-activity.module";
import {VaultErrorsModule} from "./vaulterrors/vault-errors.module";
import {EmailModule} from "./email/email.module";
import {WebhookErrorModule} from "./webhookerrors/webhook-error.module";
import {PersonalManagementModule} from "../personalmanagement/personal-management.module";
import {NavbarModule} from "../navbar/navbar.module";
import {MenuModule} from "../../../../common/src/lib/components/sidebar/menu.module";
import {TransactionModule} from "./transactions/transaction.module";
import {BrandingModule} from "./branding/branding.module";

@NgModule({
  declarations: [
    CompanyPortalPageComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    CompanyPortalPageRoutingModule,
    PersonalManagementModule,
    UserManagementModule,
    CompanyManagementModule,
    MenuModule,
    PlatformModule,
    SaleModule,
    SendgridSyncModule,
    BrandingModule,
    ApiActivityModule.forRoot(),
    VaultErrorsModule,
    EmailModule,
    WebhookErrorModule,
    NavbarModule,
    TransactionModule
  ]
})
export class CompanyPortalPageModule {
}
