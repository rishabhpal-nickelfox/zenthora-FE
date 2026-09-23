import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DragulaModule} from 'ng2-dragula';
import {ToastrModule} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import {NbEvaIconsModule} from '@nebular/eva-icons';
import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
} from '@nebular/theme';
import {AppComponent} from './app.component';
import {CustomerPortalAppRoutingModule} from './customer-portal-app-routing.module';
import {
  BaseSettingsProvider,
  initSettings,
  SETTINGS_PROVIDER_TOKEN
} from '../../../common/src/lib/utils/base-settings-provider.service';
import {ROUTING_SERVICE_TOKEN} from '../../../common/src/lib/utils/base-routing.service';
import {AUTHENTICATION_SERVICE_TOKEN} from '../../../common/src/lib/services/base-authentication.service';
import {MENU_SERVICE_TOKEN} from '../../../common/src/lib/utils/base-page-menu.service';
import {ContentTypeInterceptor} from '../../../common/src/lib/services/interceptors/content-type.interceptor';
import {
  ServiceWorkerIgnoreInterceptor
} from '../../../common/src/lib/services/interceptors/service-worker-ignore.interceptor';
import {XUiOriginInterceptor} from '../../../common/src/lib/services/interceptors/x-ui-origin.interceptor';
import {CsrfInterceptor} from '../../../common/src/lib/services/interceptors/csrf.interceptor';
import {QboDefaultErrorInterceptor} from '../../../common/src/lib/utils/errorhandler/default-error-interceptor.service';
import {ErrorInterceptor} from '../../../common/src/lib/utils/errorhandler/error-interceptor.service';
import {
  NotFoundErrorInterceptorService
} from '../../../common/src/lib/utils/errorhandler/not-found-error-interceptor.service';
import {VaultErrorInterceptor} from '../../../common/src/lib/utils/errorhandler/vault-error-interceptor.service';
import {PaymentErrorInterceptor} from '../services/interceptors/payment-error-interceptor.service';
import {
  CustomerForbiddenErrorInterceptorService
} from '../services/interceptors/customer-forbidden-error-interceptor.service';
import {CustomerAuthInterceptorService} from '../services/interceptors/customer-auth-interceptor.service';
import {
  CustomerAuthenticationErrorInterceptorService
} from '../services/customer-authentication-error-interceptor.service';
import {CustomerRoutingService} from '../services/customer-routing.service';
import {CustomerAuthenticationService} from '../services/customer-authentication.service';
import {CustomerPageMenuService} from '../services/customer-page-menu.service';
import {CustomerUserInactivityService} from '../services/customer-user-inactivity.service';
import {CustomerSettingsProvider} from '../services/customer-settings-provider.service';
import {CustomerCurrentDataService} from '../services/customer-current-data.service';
import {CustomerPermissionService} from '../services/customer-permission.service';
import {CustomerTableViewSettingsService} from '../services/customer-table-view-settings.service';
import {UnderMaintenanceService} from '../../../common/src/lib/utils/under-maintenance.service';
import {RecaptchaService} from '../../../common/src/lib/utils/recaptcha.service';
import {StatusCheckService} from '../../../common/src/lib/utils/status-check.service';
import {COMMON_CONFIG} from '../../../common/src/lib/common-config.token';
import {TermService} from '../../../common/src/lib/services/eula/term.service';
import {SaleEmailModule} from './checkout/sale-email.module';
import {PaymentFormPaymentModule} from './paymentforms/payment-form-payment.module';
import {SaleToPdfModule} from './pdf/sale-to-pdf-module';
import {CustomerAuthPageModule} from './auth/customer-auth-page.module';
import {CustomerEmailModule} from './email/customer-email.module';
import {CustomerModalModule} from './modal/customer-modal.module';
import {CustomerPortalUnavailableModule} from './unavailable/customer-portal-unavailable.module';
import {HomeComponent} from '../../../common/src/lib/home/home.component';
import {CustomerAuthGuard} from '../guards/customer-auth.guard';
import {CustomerPaymentMethodsGuard} from '../guards/customer-payment-methods.guard';
import {CustomerPendingChangesGuard} from '../guards/customer-pending-changes.guard';
import {CustomerPortalAvailableGuard} from '../guards/customer-portal-available.guard';
import {CustomerTransactionsGuard} from '../guards/customer-transactions.guard';
import {CustomerUsersGuard} from '../guards/customer-users.guard';
import {CustomerPortalSettingsGuard} from '../guards/customer-settings-guard.service';
import {CustomerService} from '../services/customer.service';
import {AuthorizationMessageViewService} from '../services/authorization-message-view.service';
import {CustomerTransactionService} from '../services/customer-transaction.service';
import {CustomerThemeHelperService} from '../services/customer-theme-helper.service';
import {CustomerTitleHelperService} from '../services/customer-title-helper.service';
import {DepositService} from '../services/deposit.service';
import {InvoiceService} from '../services/invoice.service';
import {SaleEmailPaymentService} from '../services/sale-email-payment.service';
import {SalePaymentViewService} from '../services/sale-payment-view.service';
import {SalePortalPaymentService} from '../services/sale-portal-payment.service';
import {SalesOrderService} from '../services/sales-order.service';
import {UserService} from '../services/user.service';
import {SalePdfService} from '../services/pdf/sale-pdf.service';
import {ServiceWorkerModule} from "@angular/service-worker";
import {environment} from "../../../../environments/environment";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    DragulaModule.forRoot(),
    NbThemeModule.forRoot({name: 'zenthora-light'}),
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbDialogModule.forRoot(),
    ToastrModule.forRoot({positionClass: 'toast-top-left', preventDuplicates: true}),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NbLayoutModule,
    NbActionsModule,
    NbCardModule,
    NbCheckboxModule,
    NbEvaIconsModule,
    FormsModule,
    ReactiveFormsModule,
    SaleEmailModule,
    PaymentFormPaymentModule,
    SaleToPdfModule,
    CustomerEmailModule,
    CustomerAuthPageModule,
    CustomerModalModule,
    CustomerPortalUnavailableModule,
    CustomerPortalAppRoutingModule,
    HomeComponent
  ],
  providers: [
    CookieService,
    Title,
    CustomerSettingsProvider,
    {provide: SETTINGS_PROVIDER_TOKEN, useExisting: CustomerSettingsProvider},
    {
      provide: APP_INITIALIZER,
      useFactory: (settingsProvider: BaseSettingsProvider) => initSettings(settingsProvider),
      deps: [SETTINGS_PROVIDER_TOKEN],
      multi: true
    },
    CustomerRoutingService,
    {provide: ROUTING_SERVICE_TOKEN, useExisting: CustomerRoutingService},
    CustomerAuthenticationService,
    {provide: AUTHENTICATION_SERVICE_TOKEN, useExisting: CustomerAuthenticationService},
    CustomerPageMenuService,
    {provide: MENU_SERVICE_TOKEN, useExisting: CustomerPageMenuService},
    CustomerUserInactivityService,
    {provide: HTTP_INTERCEPTORS, useClass: ContentTypeInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ServiceWorkerIgnoreInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: QboDefaultErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: NotFoundErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CustomerForbiddenErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: PaymentErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: VaultErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CustomerAuthenticationErrorInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CustomerAuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: XUiOriginInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true},
    StatusCheckService,
    {provide: COMMON_CONFIG, useValue: environment},
    UnderMaintenanceService,
    RecaptchaService,
    TermService,
    CustomerCurrentDataService,
    CustomerPermissionService,
    CustomerTableViewSettingsService,
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
    SalePdfService,
    CustomerPortalSettingsGuard,
    CustomerAuthGuard,
    CustomerPaymentMethodsGuard,
    CustomerPendingChangesGuard,
    CustomerPortalAvailableGuard,
    CustomerTransactionsGuard,
    CustomerUsersGuard,
  ],
  bootstrap: [AppComponent],
})
export class CustomerPortalAppModule {
}
