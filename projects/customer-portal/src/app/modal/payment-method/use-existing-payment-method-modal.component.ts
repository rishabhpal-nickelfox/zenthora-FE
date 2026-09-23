import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {CreditCardModel} from "../../../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../../../common/src/lib/models/sale/ach.model";
import {PaymentMethodTypeEnum} from "../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CreditCardEnumValue} from "../../../../../common/src/lib/enums/sale/credit-card.enum";
import {UseExistingPaymentMethodModalLabels} from "./use-existing-payment-method-modal-labels";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: false,
  selector: 'app-use-existing-payment-method-modal',
  templateUrl: './use-existing-payment-method-modal.component.html',
  styleUrls: ['../../../../../common/src/lib/modals/external-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UseExistingPaymentMethodModalComponent implements OnInit{
  candidate: CreditCardModel | ACHModel;
  paymentMethodType: PaymentMethodTypeEnum;
  protected paymentMethodString: string;
  protected readonly Labels = UseExistingPaymentMethodModalLabels;
  showExistingButtonName = this.Labels.UseExisting;

  constructor(protected activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
      const cc = this.candidate as CreditCardModel;
      this.paymentMethodString = `You already have a saved ${CreditCardEnumValue.get(cc.cardType)} Card ending in ${cc.number.slice(-4)} with expiration date of ${cc.date}.\n`;
    } else if (this.paymentMethodType == PaymentMethodTypeEnum.ACH) {
      const ach = this.candidate as ACHModel;
      this.paymentMethodString = `You already have a saved ACH account ending in ${ach.accountNumber.slice(-4)} with Routing# ${ach.routingNumber}.\n`;
    }
  }

}
