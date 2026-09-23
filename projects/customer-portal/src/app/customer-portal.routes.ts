import {Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {HomeComponent} from "../../../common/src/lib/home/home.component";
import {PayerConfirmRegistrationComponent} from "./email/registration/self/payer-confirm-registration.component";
import {CustomerCompanyInvitationComponent} from "./email/registration/company/customer-company-invitation.component";
import {
  CustomerCompanyConfirmInvitationComponent
} from "./email/registration/company/customer-company-confirm-invitation.component";
import {CustomerResetPasswordComponent} from "./email/changepassword/customer-email-change-password.component";
import {CustomerAuthPageComponent} from "./auth/customer-auth-page.component";
import {SaleEmailPaymentComponent} from "./checkout/sale-email-payment.component";
import {PaymentFormPaymentComponent} from "./paymentforms/payment-form-payment.component";
import {CustomerPortalUnavailableComponent} from "./unavailable/customer-portal-unavailable.component";
import {CustomerPortalSettingsGuard} from "../guards/customer-settings-guard.service";
import {SaleToPdfComponent} from "./pdf/sale-to-pdf.component";

export const CUSTOMER_PORTAL_ROUTES: Routes = [
  {path: '', pathMatch: 'full', redirectTo: `login`},
  {
    path: '',
    component: AppComponent,
    canActivateChild: [CustomerPortalSettingsGuard],
    children: [
      {path: '', component: HomeComponent},
      {
        path: '',
        loadChildren: () => import('./portal-page/customer-portal-page.module').then(m => m.CustomerPortalPageModule)
      },
      {path: 'registration/:token', component: PayerConfirmRegistrationComponent},
      {path: 'company-invitation/:token', component: CustomerCompanyInvitationComponent},
      {path: 'company-invitation/:token/confirm', component: CustomerCompanyConfirmInvitationComponent},
      {path: 'change-password/:token', component: CustomerResetPasswordComponent},
      {path: 'login', component: CustomerAuthPageComponent},
      {path: 'pay/:token', component: SaleEmailPaymentComponent},
      {path: 'forms/:companyCode/:paymentFormId', component: PaymentFormPaymentComponent},
      {path: 'unavailable', component: CustomerPortalUnavailableComponent},
      {path: 'pdf/:key', component: SaleToPdfComponent}
    ]
  }];
