import {Component} from '@angular/core';
import {TableComponent} from '../../../../../../../common/src/lib/table/table.component';

@Component({
  standalone: false,
  selector: 'app-company-payment-forms-table',
  templateUrl: '../../../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../../../common/src/lib/table/table.component.scss']
})
export class CompanyPaymentFormsTableComponent extends TableComponent {

  paymentFormsCompanyId: string;
  paymentFormsUrl: string;
  logo: string;
  logoContentType: string;

  protected onResult(res) {
    super.onResult(res);
    this.paymentFormsCompanyId = res.paymentFormsCompanyId ?? this.paymentFormsCompanyId;
    this.paymentFormsUrl = res.paymentFormsUrl ?? this.paymentFormsUrl;
    this.logo = res.logo ?? this.logo;
    this.logoContentType = res.logoContentType ?? this.logoContentType;
  }
}
