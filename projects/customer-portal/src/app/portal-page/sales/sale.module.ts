import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../common/src/lib/shared.module";
import {SaleViewModule} from "../../../../../common/src/lib/sale/view/sale-view.module";
import {PaymentModule} from "../../../../../common/src/lib/payment/payment.module";
import {InvoiceComponent} from "./invoice/invoice.component";
import {SalesOrderComponent} from "./sales-order/sales-order.component";
import {DepositComponent} from "./deposit/deposit.component";
import {DepositPaymentComponent} from "./deposit/deposit-payment.component";
import {SalesOrderPaymentComponent} from "./sales-order/sales-order-payment.component";
import {InvoicePaymentComponent} from "./invoice/invoice-payment.component";
import {InvoiceMultiplePaymentComponent} from "./invoice/invoice-multiple-payment.component";
import {InvoiceTableComponent} from "./invoice/invoice-table.component";
import {NgxPaginationModule} from "ngx-pagination";
import {SelectCurrencyModal} from "./invoice/modal/select-currency-modal.component";
import {InvoiceMultiplePaymentPrintComponent} from "./invoice/invoice-multiple-payment-print.component";
import {CustomerPaymentResultModule} from '../../payment-result/customer-payment-result.module';

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoicePaymentComponent,
    InvoiceMultiplePaymentComponent,
    InvoiceTableComponent,
    InvoiceMultiplePaymentPrintComponent,
    SalesOrderComponent,
    SalesOrderPaymentComponent,
    DepositComponent,
    DepositPaymentComponent,
    SelectCurrencyModal
  ],
  imports: [
    SharedModule,
    SaleViewModule,
    PaymentModule,
    CustomerPaymentResultModule,
    NgxPaginationModule
  ],
  exports: []
})
export class SaleModule {
}
