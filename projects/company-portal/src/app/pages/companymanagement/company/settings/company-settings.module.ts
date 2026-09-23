import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';
import {SaleEmailPaymentTemplateModule} from './email/paymenttemplate/sale-email-payment-template.module';
import {CompanyThemeSettingsModule} from "./customerportal/theme/company-theme-settings.module";
import {CompanySettingsGeneralComponent} from "./general/company-settings-general.component";
import {CompanySettingsMailingMethodComponent} from "./mailingmethod/company-settings-mailing-method.component";
import {CompanySettingsPaymentComponent} from "./payment/company-settings-payment.component";
import {SalePaymentAuthorizationMessageComponent} from "./payment/sale-payment-authorization-message.component";
import {CompanySettingsTemplateComponent} from "./template/company-settings-template.component";
import {CompanySettingsApiTokensComponent} from "./apitokens/company-settings-api-tokens.component";
import {CompanySettingsCustomerPortalComponent} from "./customerportal/company-settings-customer-portal.component";
import {CompanySettingsApiTokenTableComponent} from "./apitokens/company-settings-api-token-table.component";
import {CompanySettingsApiTokenCreateEditComponent} from "./apitokens/company-settings-api-token-create-edit.component";
import {NgxPaginationModule} from "ngx-pagination";

@NgModule({
  declarations: [
    CompanySettingsGeneralComponent,
    CompanySettingsMailingMethodComponent,
    CompanySettingsPaymentComponent,
    SalePaymentAuthorizationMessageComponent,
    CompanySettingsTemplateComponent,
    CompanySettingsApiTokensComponent,
    CompanySettingsApiTokenTableComponent,
    CompanySettingsApiTokenCreateEditComponent,
    CompanySettingsCustomerPortalComponent
  ],
  imports: [
    SharedModule,
    NbSelectModule,
    SaleEmailPaymentTemplateModule,
    CompanyThemeSettingsModule,
    NgxPaginationModule
  ],
  exports: [
    CompanySettingsGeneralComponent,
    CompanySettingsMailingMethodComponent,
    CompanySettingsPaymentComponent,
    CompanySettingsTemplateComponent,
    CompanySettingsApiTokensComponent,
    CompanySettingsCustomerPortalComponent
  ]
})

export class CompanySettingsModule {
}
