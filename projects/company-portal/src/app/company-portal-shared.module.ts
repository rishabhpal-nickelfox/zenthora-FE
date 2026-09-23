import {NgModule} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {CookieService} from "ngx-cookie-service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {NbLayoutModule, NbMenuModule, NbSidebarModule, NbThemeModule} from "@nebular/theme";
import {ContentTypeInterceptor} from "../../../common/src/lib/services/interceptors/content-type.interceptor";
import {QboDefaultErrorInterceptor} from "../../../common/src/lib/utils/errorhandler/default-error-interceptor.service";
import {ErrorInterceptor} from "../../../common/src/lib/utils/errorhandler/error-interceptor.service";
import {
  NotFoundErrorInterceptorService
} from "../../../common/src/lib/utils/errorhandler/not-found-error-interceptor.service";
import {
  UserExistsErrorInterceptorService
} from "./pages/usermanagement/user/common/user-exists-error-interceptor.service";
import {VaultErrorInterceptor} from "../../../common/src/lib/utils/errorhandler/vault-error-interceptor.service";
import {CompanyExternalModalComponent} from "./modal/company-external-modal.component";
import {CompanyAuthPageModule} from "./authpage/company-auth-page.module";
import {HomeComponent} from "../../../common/src/lib/home/home.component";
import {
  CompanyForbiddenErrorInterceptorService
} from "../services/interceptors/company-forbidden-error-interceptor.service";
import {CompanyAuthInterceptorService} from "../services/interceptors/company-auth-interceptor.service";
import {
  CompanyAuthenticationErrorInterceptorService
} from "../services/interceptors/company-authentication-error-interceptor.service";
import {
  ServiceWorkerIgnoreInterceptor
} from "../../../common/src/lib/services/interceptors/service-worker-ignore.interceptor";
import {CsrfInterceptor} from "../../../common/src/lib/services/interceptors/csrf.interceptor";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {COMPANY_PORTAL_ROUTES} from "./company-portal.routes";
import {UnderMaintenanceService} from "../../../common/src/lib/utils/under-maintenance.service";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {UserManagementUiKeyService} from "../services/usermanagement/user-management-ui-key.service";
import {UIKeyService} from "../services/ui-key.service";
import {CompanyManagementUiKeyService} from "../services/companymanagement/company-management-ui-key.service";
import {
  AuditErrorsManagementUiKeyService
} from "../services/auditerrorsmanagement/audit-errors-management-ui-key-service";
import {PlatformUiKeyService} from "../services/platform/platform-ui-key.service";
import {SaleUiKeyService} from "../services/sale/sale-ui-key.service";
import {VaultErrorsUiKeyService} from "../services/vaulterrors/vault-errors-ui-key.service";
import {SendgridSyncUiKeyService} from "../services/sendgrid/sendgrid-sync-ui-key.service";
import {EmailUiKeyService} from "../services/email/email-ui-key.service";
import {WebhookUiKeyService} from "../services/webhook/webhook-ui-key.service";
import {TransactionUiKeyService} from "../services/transaction/transaction-ui-key.service";
import {CompanyAuthGuard} from "../guards/company-auth.guard";
import {CompanyPendingChangesGuard} from "../guards/company-pending-changes.guard";
import {ApiAuditGuard} from "../guards/apiaudit/api-audit.guard";
import {ApiTokenGuard} from "../guards/apitoken/api-token.guard";
import {CompanyGuard} from "../guards/companymanagement/company.guard";
import {CompanyPaymentFormsGuard} from "../guards/companymanagement/company-payment-forms.guard";
import {CompanySettingsGuard} from "../guards/companymanagement/company-settings.guard";
import {CompanySettingsCustomerPortalGuard} from "../guards/companymanagement/company-settings-customer-portal.guard";
import {CompanySettingsTemplateGuard} from "../guards/companymanagement/company-settings-template.guard";
import {EmailGuard} from "../guards/email/email.guard";
import {AdminGuard} from "../guards/home/admin.guard";
import {PlatformGuard} from "../guards/platform/platform.guard";
import {SaleGuard} from "../guards/sale/sale-guard.service";
import {SendgridSyncGuard} from "../guards/sendgrid/sendgrid-sync.guard";
import {TransactionGuard} from "../guards/transaction/transaction.guard";
import {AuditGuard} from "../guards/usermanagement/audit.guard";
import {RoleGuard} from "../guards/usermanagement/role.guard";
import {UserGuard} from "../guards/usermanagement/user.guard";
import {VaultErrorsGuard} from "../guards/vaulterrors/vault-errors.guard";
import {WebhookErrorGuard} from "../guards/webhook/webhook-errors.guard";
import {ApiAuditService} from "./pages/apiactivity/api-audit.service";
import {ApiAuditUiKeyService} from "./pages/apiactivity/api-audit-ui-key.service";
import {ApiTokenService} from "../services/apitoken/api-token.service";
import {ApiTokenUiKeyService} from "../services/apitoken/api-token-ui-key.service";
import {AuditSystemService} from "../services/auditerrorsmanagement/audit.system.service";
import {AuditCompanyService} from "../services/auditerrorsmanagement/audit.company.service";
import {EntityService} from "../services/companymanagement/entity.service";
import {PaymentFormService} from "../services/companymanagement/payment-form.service";
import {VaultService} from "../services/companymanagement/vault.service";
import {EmailService} from "../services/email/email.service";
import {PlatformService} from "../services/platform/platform.service";
import {SaleService} from "../services/sale/sale.service";
import {SendgridSyncService} from "../services/sendgrid/sendgrid-sync.service";
import {TransactionService} from "../services/transaction/transaction.service";
import {RolePermissionService} from "../services/usermanagement/role-permission.service";
import {UserService} from "../services/usermanagement/user.service";
import {VaultErrorsService} from "../services/vaulterrors/vault-errors.service";
import {WebhookService} from "../services/webhook/webhook.service";
import {WebhookErrorService} from "../services/webhook/webhook-error.service";
import {TermService} from "../../../common/src/lib/services/eula/term.service";
import {CompanyCoreServiceModule} from "../services/company-core-service.module";
import {SETTINGS_PROVIDER_TOKEN,} from "../../../common/src/lib/utils/base-settings-provider.service";
import {CompanyPortalSettingsGuard} from "../guards/company-portal-settings-guard.service";
import {CompanySettingsProvider} from "../services/company-settings-provider.service";
import {StatusCheckService} from "../../../common/src/lib/utils/status-check.service";
import {COMMON_CONFIG} from "../../../common/src/lib/common-config.token";
import {environment} from "../../../../environments/environment";
import {BrandingUiKeyService} from "../services/branding/branding-ui-key.service";
import {BrandingGuard} from "../guards/branding/branding.guard";
import {XUiOriginInterceptor} from "../../../common/src/lib/services/interceptors/x-ui-origin.interceptor";
import {BrandingService} from "../services/branding/branding.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NbThemeModule.forRoot({name: 'zenthora-light'}),
    NbLayoutModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    RouterModule.forChild(COMPANY_PORTAL_ROUTES),
    CompanyExternalModalComponent,
    CompanyAuthPageModule,
    HomeComponent,
    CompanyCoreServiceModule.forRoot()
  ],
  providers: [
    CookieService,
    StatusCheckService,
    {provide: COMMON_CONFIG, useValue: environment},
    Title,
    CompanyPortalSettingsGuard,
    CompanySettingsProvider,
    {
      provide: SETTINGS_PROVIDER_TOKEN,
      useClass: CompanySettingsProvider
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContentTypeInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServiceWorkerIgnoreInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: QboDefaultErrorInterceptor,
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotFoundErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserExistsErrorInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CompanyForbiddenErrorInterceptorService,
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: VaultErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CompanyAuthenticationErrorInterceptorService, multi: true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CompanyAuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ContentTypeInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XUiOriginInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    },
    UnderMaintenanceService,
    RecaptchaService,
    UserManagementUiKeyService,
    UIKeyService,
    CompanyManagementUiKeyService,
    AuditErrorsManagementUiKeyService,
    PlatformUiKeyService,
    SaleUiKeyService,
    VaultErrorsUiKeyService,
    BrandingUiKeyService,
    SendgridSyncUiKeyService,
    EmailUiKeyService,
    WebhookUiKeyService,
    TransactionUiKeyService,
    CompanyAuthGuard,
    CompanyPendingChangesGuard,
    ApiAuditGuard,
    ApiTokenGuard,
    CompanyGuard,
    CompanyPaymentFormsGuard,
    CompanySettingsGuard,
    CompanySettingsCustomerPortalGuard,
    CompanySettingsTemplateGuard,
    EmailGuard,
    AdminGuard,
    PlatformGuard,
    SaleGuard,
    SendgridSyncGuard,
    BrandingGuard,
    TransactionGuard,
    AuditGuard,
    RoleGuard,
    UserGuard,
    VaultErrorsGuard,
    WebhookErrorGuard,
    ApiAuditService,
    ApiAuditUiKeyService,
    ApiTokenService,
    ApiTokenUiKeyService,
    AuditSystemService,
    AuditCompanyService,
    EntityService,
    PaymentFormService,
    VaultService,
    EmailService,
    EmailUiKeyService,
    CompanyAuthInterceptorService,
    PlatformService,
    SaleService,
    SendgridSyncService,
    BrandingService,
    TransactionService,
    RolePermissionService,
    UserService,
    VaultErrorsService,
    WebhookService,
    WebhookErrorService,
    TermService,
    ContentTypeInterceptor,
    ServiceWorkerIgnoreInterceptor
  ]
})
export class CompanyPortalSharedModule {
}
