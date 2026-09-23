import {NgModule} from '@angular/core';
import {PlatformComponent} from './platform.component';
import {PlatformCreateEditEntityComponent} from './platform-create-edit.component';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';
import {InvoicePaymentTemplateModule} from "@eps/common";
import {
    SaleEmailPaymentTemplateModule
} from "../companymanagement/company/settings/email/paymenttemplate/sale-email-payment-template.module";

@NgModule({
  declarations: [
    PlatformComponent,
    PlatformCreateEditEntityComponent
  ],
    imports: [
        SharedModule,
        NbSelectModule,
        InvoicePaymentTemplateModule,
        SaleEmailPaymentTemplateModule
    ],
  exports: [
    PlatformComponent
  ],
  providers: []
})

export class PlatformModule {
}
