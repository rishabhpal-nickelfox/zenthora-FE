import {NgModule} from '@angular/core';
import {CompanyTableComponent} from './company-table.component';
import {CompanyManageCreateEditEntityComponent} from './company-create-edit.component';
import {SharedModule} from '../../../../../../common/src/lib/shared.module';
import {NbButtonModule, NbDialogModule, NbPopoverModule, NbProgressBarModule, NbSelectModule} from '@nebular/theme';
import {CompanySettingsModule} from "./settings/company-settings.module";
import {CompanyWebhookComponent} from "./webhook/company-webhook-component";
import {CompanyPaymentFormsComponent} from "./paymentforms/company-payment-forms.component";
import {CompanyPaymentFormCreateEditComponent} from "./paymentforms/company-payment-form-create-edit.component";
import {CompanyPaymentFormsTableComponent} from "./paymentforms/company-payment-forms-table.component";
import { NgxPaginationModule } from "ngx-pagination";
import {GridsterModule} from "angular-gridster2";
import {
  PaymentFormTemplateEditorComponent
} from "./paymentforms/template/payment-form-template-editor.component";
import {
  PaymentFormTemplateItemEditComponent
} from "./paymentforms/template/payment-form-template-item-edit.component";

@NgModule({
  declarations: [
    CompanyTableComponent,
    CompanyManageCreateEditEntityComponent,
    CompanyWebhookComponent,
    CompanyPaymentFormsComponent,
    CompanyPaymentFormsTableComponent,
    CompanyPaymentFormCreateEditComponent,
    PaymentFormTemplateEditorComponent,
    PaymentFormTemplateItemEditComponent
  ],
    imports: [
        SharedModule,
        NbSelectModule,
        NbProgressBarModule,
        NgxPaginationModule,
        GridsterModule,
        NbButtonModule,
        NbDialogModule.forChild(),
        NbPopoverModule
    ],
  exports: [
    CompanyTableComponent,
    CompanySettingsModule
  ],
  providers: []
})

export class CompanyModule {
}
