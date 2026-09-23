import {Component} from "@angular/core";
import {TableComponent} from "../../../../../../common/src/lib/table/table.component";
import {PaymentMethodTypeEnum} from "../../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {USStateEnum} from "../../../../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../../../../common/src/lib/enums/utils/ca-state.enum";

@Component({
  standalone: false,
  selector: 'app-invoice-table',
  templateUrl: '../../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss']
})
export class InvoiceTableComponent extends TableComponent {

  invoicePartialPaymentsAllowed: boolean;
  allowedPaymentMethods: PaymentMethodTypeEnum[];
  creditCardPaymentAmountLimit: number;
  globalPaymentsEnabled: boolean;
  currencies: string[];
  invoiceNumberStringMaxLength: number;
  surchargePercent: number;
  surchargeProhibitedStates: (USStateEnum | CAStateEnum)[];

  protected onResult(res) {
    super.onResult(res);
    this.invoicePartialPaymentsAllowed = res.invoicePartialPaymentsAllowed;
    this.allowedPaymentMethods = res.allowedPaymentMethods;
    this.creditCardPaymentAmountLimit = res.creditCardPaymentAmountLimit;
    this.globalPaymentsEnabled = res.globalPaymentsEnabled;
    this.currencies = res.currencies;
    this.invoiceNumberStringMaxLength = res.invoiceNumberStringMaxLength;
    this.surchargePercent = res.surchargePercent;
    this.surchargeProhibitedStates = res.surchargeProhibitedStates;
  }

}
