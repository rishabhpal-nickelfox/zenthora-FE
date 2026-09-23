import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ACHModel} from "../../models/sale/ach.model";
import {CreditCardModel} from "../../models/sale/credit-card.model";
import {CreditCardEnum, CreditCardEnumValue} from "../../enums/sale/credit-card.enum";
import {AccountTypeEnumValue} from "../../enums/sale/account-type.enum";
import {PaymentMethodLabels} from "./payment-method-labels";
import {PaymentMethodTypeEnum} from "../../enums/sale/payment-method-type.enum";
import {PaymentMethodErrorEnum, PaymentMethodErrorEnumValue} from "../../enums/sale/payment-method-error.enum";
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-payment-method-preview',
  templateUrl: './payment-method-preview.component.html',
  styleUrls: ['./payment-method-preview.component.scss']
})
export class PaymentMethodPreviewComponent {

  @Input() paymentMethod: CreditCardModel | ACHModel;
  @Input() selected: boolean;
  @Input() disabled: boolean;

  @Input() companyName: string;

  @Input() canEdit: boolean;
  @Input() canDelete: boolean;

  @Output() edit: EventEmitter<PaymentMethodPreviewModel> = new EventEmitter<PaymentMethodPreviewModel>();
  @Output() delete: EventEmitter<PaymentMethodPreviewModel> = new EventEmitter<PaymentMethodPreviewModel>();

  protected readonly CreditCardEnumValue = CreditCardEnumValue;
  protected readonly AccountTypeEnumValue = AccountTypeEnumValue;
  protected readonly Labels = PaymentMethodLabels;

  get isNew(): boolean {
    return !isDefined(this.paymentMethod);
  }

  get isDefault(): boolean {
    return this.paymentMethod.customerDefault;
  }

  get isACH(): boolean {
    return !this.isNew && this.paymentMethod instanceof ACHModel;
  }

  get isCC(): boolean {
    return !this.isNew && this.paymentMethod instanceof CreditCardModel;
  }

  get cc(): CreditCardModel {
    return <CreditCardModel>this.paymentMethod;
  }

  get ccLogoURL(): string {
    return this.paymentMethod instanceof CreditCardModel && this.paymentMethod.cardType && CreditCardEnum.UNKNOWN != this.paymentMethod.cardType ? this.paymentMethod.cardType + '.png' : null;
  }

  get ach(): ACHModel {
    return <ACHModel>this.paymentMethod;
  }

  private get value(): PaymentMethodPreviewModel {
    return {
      paymentMethod: this.paymentMethod,
      paymentMethodType: this.isCC ? PaymentMethodTypeEnum.CREDIT_CARD : this.isACH ? PaymentMethodTypeEnum.ACH : null,
      selected: this.selected
    }
  }

  onEdit(): boolean {
    this.edit.emit(this.value);
    return false;
  }

  onDelete(): boolean {
    this.delete.emit(this.value);
    return false;
  }

  getDisabledMessage(error: PaymentMethodErrorEnum): string {
    switch (error) {
      case PaymentMethodErrorEnum.DOES_NOT_CURRENTLY_SUPPORT_GLOBAL_PAYMENTS:
        return PaymentMethodErrorEnumValue.get(PaymentMethodErrorEnum.DOES_NOT_CURRENTLY_SUPPORT_GLOBAL_PAYMENTS)(this.companyName);
      default:
        return PaymentMethodErrorEnumValue.get(PaymentMethodErrorEnum.SOMETHING_WENT_WRONG)();
    }
  }
}

export interface PaymentMethodPreviewModel {
  paymentMethod: CreditCardModel | ACHModel;
  paymentMethodType: PaymentMethodTypeEnum;
  selected: boolean;
}
