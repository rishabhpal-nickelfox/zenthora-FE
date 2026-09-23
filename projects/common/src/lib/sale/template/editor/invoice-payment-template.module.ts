import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GridsterModule} from 'angular-gridster2';
import {NbButtonModule, NbDialogModule, NbIconModule, NbOptionModule, NbSelectModule} from '@nebular/theme';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {InvoiceEmailTemplateLayoutDirective} from './invoice-email-template-layout.directive';
import {InvoiceShortInfoComponent} from './invoiceinfo/short/invoice-short-info.component';
import {CustomerBillingAddressComponent} from './billing/customer-billing-address.component';
import {ShippingAddressComponent} from './shipping/address/shipping-address.component';
import {InvoiceAdditionalInfoComponent} from './invoiceinfo/additional/invoice-additional-info.component';
import {InvoiceItemsComponent} from './items/full/invoice-items.component';
import {InvoiceItemsEditTableTemplateComponent} from './items/full/invoice-items-edit-table-template.component';
import {InvoiceEmailPaymentTemplateComponent} from './invoice-email-payment-template.component';
import {CompanyInfoComponent} from './companyinfo/company-info.component';
import {LogoComponent} from './logo/logo.component';
import {CustomFieldsTableTemplateComponent} from './customfields/custom-fields-table-template.component';
import {InvoiceFullInfoComponent} from './invoiceinfo/full/invoice-full-info.component';
import {InvoiceFullInfoEditComponent} from './invoiceinfo/full/invoice-full-info-edit.component';
import {InvoiceShortInfoEditComponent} from './invoiceinfo/short/invoice-short-info-edit.component';
import {InvoiceAdditionalInfoEditComponent} from './invoiceinfo/additional/invoice-additional-info-edit.component';
import {CustomerBillingAddressEditComponent} from './billing/customer-billing-address-edit.component';
import {CustomerShippingAddressEditComponent} from './shipping/address/customer-shipping-address-edit.component';
import {CompanyInfoEditComponent} from './companyinfo/company-info-edit.component';
import {LineComponent} from './line/line.component';
import {LineEditComponent} from './line/line-edit.component';
import {InvoiceItemRowsComponent} from './items/rows/invoice-item-rows.component';
import {InvoiceItemRowsEditComponent} from './items/rows/invoice-item-rows-edit.component';
import {CustomerMemoComponent} from './customermemo/customer-memo.component';
import {CustomerMemoEditComponent} from './customermemo/customer-memo-edit.component';
import {TotalsComponent} from './items/totals/totals.component';
import {TotalsEditComponent} from './items/totals/totals-edit.component';
import {TextComponent} from './header/text.component';
import {TextEditComponent} from './header/text-edit.component';
import {ShippingInfoComponent} from './shipping/info/shipping-info.component';
import {ShippingInfoEditComponent} from './shipping/info/shipping-info-edit.component';
import {ComponentModule} from '../../../components/component.module';
import {CustomFieldsComponent} from "./customfields/custom-fields.component";
import {CustomerNameComponent} from "./customername/customer-name.component";
import {CustomerNameEditComponent} from "./customername/customer-name-edit.component";
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    InvoiceShortInfoComponent,
    InvoiceShortInfoEditComponent,
    InvoiceFullInfoComponent,
    InvoiceFullInfoEditComponent,
    InvoiceAdditionalInfoComponent,
    InvoiceAdditionalInfoEditComponent,
    InvoiceEmailTemplateLayoutDirective,
    CustomerBillingAddressComponent,
    CustomerBillingAddressEditComponent,
    ShippingAddressComponent,
    CustomerShippingAddressEditComponent,
    InvoiceItemsComponent,
    InvoiceItemsEditTableTemplateComponent,
    InvoiceEmailPaymentTemplateComponent,
    CompanyInfoComponent,
    CompanyInfoEditComponent,
    CustomFieldsComponent,
    CustomFieldsTableTemplateComponent,
    LogoComponent,
    LineComponent,
    LineEditComponent,
    InvoiceItemRowsComponent,
    InvoiceItemRowsEditComponent,
    CustomerMemoComponent,
    CustomerMemoEditComponent,
    TotalsComponent,
    TotalsEditComponent,
    TextComponent,
    TextEditComponent,
    ShippingInfoComponent,
    ShippingInfoEditComponent,
    CustomerNameComponent,
    CustomerNameEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    ComponentModule,
    NbIconModule,
    NbSelectModule,
    NbOptionModule,
    GridsterModule,
    DragDropModule,
    NbDialogModule.forChild(),
    NbButtonModule
  ],
  exports: [
    InvoiceEmailPaymentTemplateComponent
  ],
  providers: [
    InvoiceEmailTemplateLayoutDirective,
    DecimalPipe
  ]
})

export class InvoicePaymentTemplateModule {
}
