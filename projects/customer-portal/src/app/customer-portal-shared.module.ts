import {NgModule} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {NbLayoutModule, NbMenuModule, NbSidebarModule, NbThemeModule} from "@nebular/theme";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {SETTINGS_PROVIDER_TOKEN} from "../../../common/src/lib/utils/base-settings-provider.service";
import {ContentTypeInterceptor} from "../../../common/src/lib/services/interceptors/content-type.interceptor";
import {QboDefaultErrorInterceptor} from "../../../common/src/lib/utils/errorhandler/default-error-interceptor.service";
import {ErrorInterceptor} from "../../../common/src/lib/utils/errorhandler/error-interceptor.service";
import {
  NotFoundErrorInterceptorService
} from "../../../common/src/lib/utils/errorhandler/not-found-error-interceptor.service";
import {PaymentErrorInterceptor} from "../services/interceptors/payment-error-interceptor.service";
import {VaultErrorInterceptor} from "../../../common/src/lib/utils/errorhandler/vault-error-interceptor.service";
import {
  CustomerAuthenticationErrorInterceptorService
} from "../services/customer-authentication-error-interceptor.service";
import {SaleEmailModule} from "./checkout/sale-email.module";
import {PaymentFormPaymentModule} from "./paymentforms/payment-form-payment.module";
import {CustomerAuthPageModule} from "./auth/customer-auth-page.module";
import {CustomerEmailModule} from "./email/customer-email.module";
import {CustomerModalModule} from "./modal/customer-modal.module";
import {HomeComponent} from "../../../common/src/lib/home/home.component";
import {
  CustomerForbiddenErrorInterceptorService
} from "../services/interceptors/customer-forbidden-error-interceptor.service";
import {CustomerAuthInterceptorService} from "../services/interceptors/customer-auth-interceptor.service";
import {
  ServiceWorkerIgnoreInterceptor
} from "../../../common/src/lib/services/interceptors/service-worker-ignore.interceptor";
import {CustomerPortalUnavailableModule} from "./unavailable/customer-portal-unavailable.module";
import {CsrfInterceptor} from "../../../common/src/lib/services/interceptors/csrf.interceptor";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CUSTOMER_PORTAL_ROUTES} from "./customer-portal.routes";
import {CustomerService} from "../services/customer.service";
import {AuthorizationMessageViewService} from "../services/authorization-message-view.service";
import {CustomerTransactionService} from "../services/customer-transaction.service";
import {CustomerThemeHelperService} from "../services/customer-theme-helper.service";
import {CustomerTitleHelperService} from "../services/customer-title-helper.service";
import {DepositService} from "../services/deposit.service";
import {InvoiceService} from "../services/invoice.service";
import {SaleEmailPaymentService} from "../services/sale-email-payment.service";
import {SalePaymentViewService} from "../services/sale-payment-view.service";
import {SalePortalPaymentService} from "../services/sale-portal-payment.service";
import {SalesOrderService} from "../services/sales-order.service";
import {UserService} from "../services/user.service";
import {CustomerCoreServiceModule} from "../services/customer-core-service.module";
import {UnderMaintenanceService} from "../../../common/src/lib/utils/under-maintenance.service";
import {RecaptchaService} from "../../../common/src/lib/utils/recaptcha.service";
import {CustomerAuthGuard} from "../guards/customer-auth.guard";
import {CustomerPaymentMethodsGuard} from "../guards/customer-payment-methods.guard";
import {CustomerPendingChangesGuard} from "../guards/customer-pending-changes.guard";
import {CustomerPortalAvailableGuard} from "../guards/customer-portal-available.guard";
import {CustomerTransactionsGuard} from "../guards/customer-transactions.guard";
import {CustomerUsersGuard} from "../guards/customer-users.guard";
import {TermService} from "../../../common/src/lib/services/eula/term.service";
import {CustomerSettingsProvider} from "../services/customer-settings-provider.service";
import {CustomerPortalSettingsGuard} from "../guards/customer-settings-guard.service";
import {StatusCheckService} from '../../../common/src/lib/utils/status-check.service';
import {COMMON_CONFIG} from '../../../common/src/lib/common-config.token';
import {environment} from "../../../../environments/environment";
import {SaleToPdfModule} from "./pdf/sale-to-pdf-module";
import {SalePdfService} from "../services/pdf/sale-pdf.service";
import {XUiOriginInterceptor} from "../../../common/src/lib/services/interceptors/x-ui-origin.interceptor";

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
    SaleEmailModule,
    PaymentFormPaymentModule,
    SaleToPdfModule,
    CustomerEmailModule,
    CustomerAuthPageModule,
    RouterModule.forChild(CUSTOMER_PORTAL_ROUTES),
    CustomerModalModule,
    HomeComponent,
    CustomerPortalUnavailableModule,
    CustomerCoreServiceModule.forRoot()
  ],
  providers: [
    CookieService,
    StatusCheckService,
    {provide: COMMON_CONFIG, useValue: environment},
    Title,
    CustomerPortalSettingsGuard,
    CustomerSettingsProvider,
    {provide: SETTINGS_PROVIDER_TOKEN, useExisting: CustomerSettingsProvider},
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
      useClass: CustomerForbiddenErrorInterceptorService,
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: PaymentErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: VaultErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CustomerAuthenticationErrorInterceptorService, multi: true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomerAuthInterceptorService,
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
    CustomerService,
    AuthorizationMessageViewService,
    CustomerTransactionService,
    CustomerThemeHelperService,
    CustomerTitleHelperService,
    DepositService,
    InvoiceService,
    SaleEmailPaymentService,
    SalePaymentViewService,
    SalePortalPaymentService,
    SalesOrderService,
    UserService,
    UnderMaintenanceService,
    RecaptchaService,
    CustomerAuthGuard,
    CustomerPaymentMethodsGuard,
    CustomerPendingChangesGuard,
    CustomerPortalAvailableGuard,
    CustomerTransactionsGuard,
    CustomerUsersGuard,
    TermService,
    SalePdfService
  ]
})
export class CustomerPortalSharedModule {
}
