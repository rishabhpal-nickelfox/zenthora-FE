import {Component, Input, OnInit} from '@angular/core';
import {CreditCardEnumValue} from "../../enums/sale/credit-card.enum";
import {AccountTypeEnumValue} from "../../enums/sale/account-type.enum";
import {DecimalPipe} from "@angular/common";
import {ComponentWithSubscriptions} from "../../components/component-with-subscriptions";
import {SaleTransactionViewModel, SaleViewModel} from "../../models/sale/sale-view.model";
import {PaymentSourceEnumValue} from "../../enums/sale/payment-source.enum";
import {
  TransactionPaymentMethodEnum,
  TransactionPaymentMethodEnumValue
} from "../../enums/sale/transaction-payment-method.enum";
import {isDefined} from "../../helpers/object.helper";

import { DateTime } from 'luxon';

@Component({
  standalone: false,
  selector: 'app-sale-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['payment-history.component.scss']
})
export class PaymentHistoryComponent extends ComponentWithSubscriptions implements OnInit {
  @Input('justifyContentEnd') justifyContentEnd: boolean;
  CreditCardEnumValue = CreditCardEnumValue;
  AccountTypeEnumValue = AccountTypeEnumValue;
  zoneName: string;
  protected readonly PaymentSourceEnumValue = PaymentSourceEnumValue;
  protected readonly TransactionPaymentMethodEnum = TransactionPaymentMethodEnum;
  protected readonly TransactionPaymentMethodEnumValue = TransactionPaymentMethodEnumValue;

  constructor(private decimalPipe: DecimalPipe) {
    super();
  }

  private _saleViewModel: SaleViewModel;

  get saleViewModel(): SaleViewModel {
    return this._saleViewModel;
  }

  @Input() set saleViewModel(value: SaleViewModel) {
    this._saleViewModel = value;
    this.generatePaymentString();
  }

  private _showPayments = false;

  get showPayments(): boolean {
    return this._showPayments;
  }

  private _paymentString: string;

  get paymentString(): string {
    return this._paymentString;
  }

  get showPaymentsText(): boolean {
    return isDefined(this.saleViewModel.transactions) && this.saleViewModel.transactions.length > 0;
  }

  ngOnInit(): void {
    this.zoneName = DateTime.local().zoneName;
  }

  toggleShowTable(): void {
    this._showPayments = !this._showPayments;
  }

  isTransactionActual(transaction: SaleTransactionViewModel): boolean {
    return transaction.saleVersion == this.saleViewModel.transactionHistoryVersion;
  }

  private generatePaymentString(): void {
    this._paymentString = '';
    if (this.saleViewModel.transactions) {
      const totalPaymentsCount: number = this.saleViewModel.transactions.length;
      this._paymentString += totalPaymentsCount + ' ';
      if (totalPaymentsCount == 1) {
        this._paymentString += 'payment ';
      } else {
        this._paymentString += 'payments ';
      }
      this._paymentString += 'received';
    }
  }
}
