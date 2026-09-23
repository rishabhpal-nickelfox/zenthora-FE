import {Component, Input} from '@angular/core';
import {ObjectHelper} from '../../../../common/src/lib/helpers/object.helper';

@Component({
  standalone: false,
  selector: 'app-customer-payment-result',
  templateUrl: './customer-payment-result.component.html'
})
export class CustomerPaymentResultComponent {
  @Input() currency = '$';
  @Input() paymentAmount: number;
  @Input() surchargeAmount: number;
  @Input() surchargeLabel = 'Surcharge';
  @Input() totalIncludingSurcharge: number;
  @Input() authorizationId: string;
  @Input() approvalId: string;

  readonly Labels = {
    AuthorizationId: 'Authorization ID',
    ApprovalId: 'Approval ID'
  };

  protected readonly ObjectHelper = ObjectHelper;
}
