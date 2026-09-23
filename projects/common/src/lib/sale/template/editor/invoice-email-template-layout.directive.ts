import {ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {InvoiceEmailTemplateAbstractComponent} from './invoice-email-template-abstract.component';
import {CompanyInfoComponent} from './companyinfo/company-info.component';
import {CustomerBillingAddressComponent} from './billing/customer-billing-address.component';
import {ShippingAddressComponent} from './shipping/address/shipping-address.component';
import {InvoiceShortInfoComponent} from './invoiceinfo/short/invoice-short-info.component';
import {InvoiceAdditionalInfoComponent} from './invoiceinfo/additional/invoice-additional-info.component';
import {InvoiceItemsComponent} from './items/full/invoice-items.component';
import {LogoComponent} from './logo/logo.component';
import {InvoiceFullInfoComponent} from './invoiceinfo/full/invoice-full-info.component';
import {LineComponent} from './line/line.component';
import {InvoiceItemRowsComponent} from './items/rows/invoice-item-rows.component';
import {CustomerMemoComponent} from './customermemo/customer-memo.component';
import {TotalsComponent} from './items/totals/totals.component';
import {TextComponent} from './header/text.component';
import {ShippingInfoComponent} from './shipping/info/shipping-info.component';
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../enums/sale/invoice-email-payment-template-components.enum";
import {CustomFieldsComponent} from "./customfields/custom-fields.component";
import {CustomerNameComponent} from "./customername/customer-name.component";


export const INVOICE_TEMPLATE_KEY_COMPONENT_MAP = new Map<string, Type<InvoiceEmailTemplateAbstractComponent>>([
  [InvoiceEmailPaymentTemplateComponentsEnum.LOGO, LogoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO, CompanyInfoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.BILLING_ADDRESS, CustomerBillingAddressComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS, ShippingAddressComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO, ShippingInfoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.SALE_SHORT_INFO, InvoiceShortInfoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.SALE_FULL_INFO, InvoiceFullInfoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL, InvoiceAdditionalInfoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS, CustomFieldsComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS, InvoiceItemsComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS, InvoiceItemRowsComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.LINE, LineComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_MEMO, CustomerMemoComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME, CustomerNameComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.TOTALS, TotalsComponent],
  [InvoiceEmailPaymentTemplateComponentsEnum.TEXT, TextComponent]
]);


@Directive({
  standalone: false,
  selector: '[appLayoutItem]'
})
export class InvoiceEmailTemplateLayoutDirective implements OnInit {

  @Input() componentRef: string;
  @Input() id: string
  component: ComponentRef<InvoiceEmailTemplateAbstractComponent>;

  constructor(
    private container: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {

    const component = INVOICE_TEMPLATE_KEY_COMPONENT_MAP.get(this.componentRef);

    if (component) {
      const factory = this.resolver.resolveComponentFactory<InvoiceEmailTemplateAbstractComponent>(component);
      this.component = this.container.createComponent(factory);
      this.component.instance.id = this.id ?? this.componentRef;
    }

  }
}
