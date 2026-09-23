import {ActivatedRoute} from '@angular/router';
import {Component, Inject, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {PayerConfirmRegistrationLabels} from "./payer-confirm-registration-labels";
import {CustomerRoutingService} from "../../../../services/customer-routing.service";
import {CustomerService} from "../../../../services/customer.service";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-payer-confirm-registration',
  templateUrl: './payer-confirm-registration.component.html',
  styleUrls: ['./payer-confirm-registration.component.scss']
})
export class PayerConfirmRegistrationComponent implements OnInit {
  protected showSuccessMessage = false;
  protected showErrorMessage = false;
  protected loading = true;
  protected readonly Labels = PayerConfirmRegistrationLabels;

  constructor(protected router: ActivatedRoute, @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService, private errorService: ErrorService, private alertService: AlertService,
              private customerService: CustomerService) {

  }

  ngOnInit(): void {
    const token = this.router.snapshot.paramMap.get('token');
    this.customerService.confirmRegistration(token).pipe(finalize(() => this.loading = false)).subscribe(result => {
      this.alertService.showSuccess('Success', '');
      this.showSuccessMessage = true;
    }, error => {
      this.showErrorMessage = true;
    });

  }

}
