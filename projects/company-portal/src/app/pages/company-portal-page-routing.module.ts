import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {CompanyPortalPageComponent} from './company-portal-page.component';
import {UserGuard} from '../../guards/usermanagement/user.guard';
import {RoleGuard} from '../../guards/usermanagement/role.guard';
import {AuditComponent} from './usermanagement/audit/audit.component';
import {AuditGuard} from '../../guards/usermanagement/audit.guard';
import {RoleComponent} from './usermanagement/role/role.component';
import {CompanyTableComponent} from './companymanagement/company/company-table.component';
import {CompanyGuard} from '../../guards/companymanagement/company.guard';
import {PlatformComponent} from "./platform/platform.component";
import {PlatformGuard} from "../../guards/platform/platform.guard";
import {SaleComponent} from "./sale/sale.component";
import {SaleGuard} from "../../guards/sale/sale-guard.service";
import {SendgridSyncTableComponent} from "./sendgrid/sync/sendgrid-sync-table.component";
import {ApiAuditComponent} from "./apiactivity/api-audit.component";
import {VaultErrorsTableComponent} from "./vaulterrors/vault-errors-table.component";
import {VaultErrorsGuard} from "../../guards/vaulterrors/vault-errors.guard";
import {SendgridSyncGuard} from "../../guards/sendgrid/sendgrid-sync.guard";
import {ApiAuditGuard} from "../../guards/apiaudit/api-audit.guard";
import {CompanySettingsGuard} from "../../guards/companymanagement/company-settings.guard";
import {EmailTableComponent} from "./email/email-table.component";
import {EmailGuard} from "../../guards/email/email.guard";
import {UserComponent} from "./usermanagement/user/user.component";
import {WebhookErrorComponent} from "./webhookerrors/webhook-error.component";
import {WebhookErrorGuard} from "../../guards/webhook/webhook-errors.guard";
import {PersonalInfoComponent} from "../personalmanagement/personal-info.component";
import {CompanyPortalPagePath} from "./company-portal-page-path";
import {CompanyAuthGuard} from "../../guards/company-auth.guard";
import {TransactionComponent} from "./transactions/transaction.component";
import {TransactionGuard} from "../../guards/transaction/transaction.guard";
import {
  CompanySettingsGeneralComponent
} from "./companymanagement/company/settings/general/company-settings-general.component";
import {
  CompanySettingsMailingMethodComponent
} from "./companymanagement/company/settings/mailingmethod/company-settings-mailing-method.component";
import {
  CompanySettingsPaymentComponent
} from "./companymanagement/company/settings/payment/company-settings-payment.component";
import {CompanyPaymentFormsGuard} from "../../guards/companymanagement/company-payment-forms.guard";
import {
  CompanyPaymentFormsComponent
} from "./companymanagement/company/paymentforms/company-payment-forms.component";
import {
  CompanySettingsTemplateComponent
} from "./companymanagement/company/settings/template/company-settings-template.component";
import {
  CompanySettingsApiTokensComponent
} from "./companymanagement/company/settings/apitokens/company-settings-api-tokens.component";
import {
  CompanySettingsCustomerPortalComponent
} from "./companymanagement/company/settings/customerportal/company-settings-customer-portal.component";
import {
  CompanySettingsCustomerPortalGuard
} from "../../guards/companymanagement/company-settings-customer-portal.guard";
import {CompanySettingsTemplateGuard} from "../../guards/companymanagement/company-settings-template.guard";
import {CompanyPendingChangesGuard} from "../../guards/company-pending-changes.guard";
import {CompanyPortalSettingsGuard} from "../../guards/company-portal-settings-guard.service";
import {BrandingComponent} from "./branding/branding.component";
import {BrandingGuard} from "../../guards/branding/branding.guard";

const routes: Routes = [{
  path: '',
  component: CompanyPortalPageComponent,
  children: [
    {
      path: CompanyPortalPagePath.PERSONAL_INFO,
      component: PersonalInfoComponent,
      canActivate: [CompanyAuthGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.USER_MANAGE,
      component: UserComponent,
      canActivate: [CompanyAuthGuard, UserGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.AUDIT,
      component: AuditComponent,
      canActivate: [CompanyAuthGuard, AuditGuard]
    },
    {
      path: CompanyPortalPagePath.ROLE_MANAGE,
      component: RoleComponent,
      canActivate: [CompanyAuthGuard, RoleGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.PLATFORM,
      component: PlatformComponent,
      canActivate: [CompanyAuthGuard, PlatformGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_MANAGE,
      component: CompanyTableComponent,
      canActivate: [CompanyAuthGuard, CompanyGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_SETTINGS_GENERAL,
      component: CompanySettingsGeneralComponent,
      canActivate: [CompanyAuthGuard, CompanySettingsGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_SETTINGS_MAILING_METHOD,
      component: CompanySettingsMailingMethodComponent,
      canActivate: [CompanyAuthGuard, CompanySettingsGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_SETTINGS_PAYMENT_SETTINGS,
      component: CompanySettingsPaymentComponent,
      canActivate: [CompanyAuthGuard, CompanySettingsGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_PAYMENT_FORMS,
      component: CompanyPaymentFormsComponent,
      canActivate: [CompanyAuthGuard, CompanyPaymentFormsGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_SETTINGS_TEMPLATES,
      component: CompanySettingsTemplateComponent,
      canActivate: [CompanyAuthGuard, CompanySettingsGuard, CompanySettingsTemplateGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_SETTINGS_API_TOKENS,
      component: CompanySettingsApiTokensComponent,
      canActivate: [CompanyAuthGuard, CompanySettingsGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.COMPANY_SETTINGS_CUSTOMER_PORTAL,
      component: CompanySettingsCustomerPortalComponent,
      canActivate: [CompanyAuthGuard, CompanySettingsGuard, CompanySettingsCustomerPortalGuard],
      canDeactivate: [CompanyPendingChangesGuard]
    },
    {
      path: CompanyPortalPagePath.SALE,
      component: SaleComponent,
      canActivate: [CompanyAuthGuard, SaleGuard]
    },
    {
      path: CompanyPortalPagePath.SENDGRID_SYNC,
      component: SendgridSyncTableComponent,
      canActivate: [CompanyAuthGuard, SendgridSyncGuard]
    },
    {
      path: CompanyPortalPagePath.API_ACTIVITY,
      component: ApiAuditComponent,
      canActivate: [CompanyAuthGuard, ApiAuditGuard]
    },
    {
      path: CompanyPortalPagePath.VAULT_ERRORS,
      component: VaultErrorsTableComponent,
      canActivate: [CompanyAuthGuard, VaultErrorsGuard]
    },
    {
      path: CompanyPortalPagePath.EMAIL,
      component: EmailTableComponent,
      canActivate: [CompanyAuthGuard, EmailGuard]
    },
    {
      path: CompanyPortalPagePath.WEBHOOK_ERRORS,
      component: WebhookErrorComponent,
      canActivate: [CompanyAuthGuard, WebhookErrorGuard]
    },
    {
      path: CompanyPortalPagePath.TRANSACTIONS,
      component: TransactionComponent,
      canActivate: [CompanyAuthGuard, TransactionGuard]
    },
    {
      path: CompanyPortalPagePath.BRANDING,
      component: BrandingComponent,
      canActivate: [CompanyAuthGuard, BrandingGuard]
    }
  ],
  canActivate: [CompanyPortalSettingsGuard, CompanyAuthGuard],
  canActivateChild: [CompanyPortalSettingsGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyPortalPageRoutingModule {
}
