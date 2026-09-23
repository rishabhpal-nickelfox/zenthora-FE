import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output
} from "@angular/core";
import {InvoiceTableModel} from "../../../../models/invoice.model";
import {SaleLabels} from "../sale-labels";
import {ObjectHelper} from "../../../../../../common/src/lib/helpers/object.helper";
import {take} from "rxjs";
import {decimal} from "../../../../../../common/src/lib/helpers/number.helper";
import {SaleEmailPaymentLabels} from "../../../checkout/sale-email-payment-labels";

@Component({
  standalone: false,
  selector: 'app-invoice-multiple-payment-print',
  templateUrl: 'invoice-multiple-payment-print.component.html',
  styleUrls: ['./invoice-multiple-payment-print.component.scss', '../../../../../../common/src/lib/table/table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceMultiplePaymentPrintComponent implements AfterViewChecked {
  @Output() ready: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  protected readonly Labels = SaleLabels;

  constructor(private zone: NgZone) {
  }

  private _printModel: InvoiceMultiplePaymentPrintModel;

  get printModel(): InvoiceMultiplePaymentPrintModel {
    return this._printModel;
  }

  @Input()
  set printModel(value: InvoiceMultiplePaymentPrintModel) {
    if (!ObjectHelper.isDefined(this._printModel)) {
      this._printModel = value;
    }
  }

  get payments(): { invoice: InvoiceTableModel, paymentAmount: number }[] {
    return this._printModel?.payments ?? [];
  }

  get paymentResult(): { paymentAmount: number, surchargeAmount: number, totalIncludingSurcharge: number, authorizationId: string, approvalId: string } {
    return this._printModel?.paymentResult;
  }

  get currencyPrefix() {
    return this._printModel?.currencyPrefix;
  }

  get totalLeftToPay(): number {
    return this.payments.map(p => p.invoice.amountDue).reduce((i, k) => i.add(k), decimal(0)).toDecimalPlaces(2).toNumber();
  }

  isDefined(smth: any) {
    return ObjectHelper.isDefined(smth);
  }


  ngAfterViewChecked(): void {
    this.zone.onMicrotaskEmpty.asObservable().pipe(
      take(1)
    )
      .subscribe(() => {
        this.ready.emit();
      });
  }

  protected readonly SaleEmailPaymentLabels = SaleEmailPaymentLabels;
}

export interface InvoiceMultiplePaymentPrintModel {
  payments: { invoice: InvoiceTableModel, paymentAmount: number }[];
  paymentResult: { paymentAmount: number, surchargeAmount: number, totalIncludingSurcharge: number, authorizationId: string, approvalId: string };
  currencyPrefix: string;
}
