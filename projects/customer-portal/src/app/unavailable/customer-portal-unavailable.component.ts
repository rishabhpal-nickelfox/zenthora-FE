import {ComponentWithSubscriptions} from "../../../../common/src/lib/components/component-with-subscriptions";
import {Component, Inject, OnInit} from "@angular/core";
import {CustomerCurrentDataService} from "../../services/customer-current-data.service";
import {CurrentCustomerModel} from "../../../../common/src/lib/models/payer/current-customer.model";
import {CustomerPortalUnavailableLabels} from "./customer-portal-unavailable-labels";
import {CustomerRoutingService} from "../../services/customer-routing.service";
import {CustomerCompanyInvitationLabels} from "../email/registration/company/customer-company-invitation-labels";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-customer-portal-unavailable',
  templateUrl: './customer-portal-unavailable.component.html',
  styleUrls: ['./customer-portal-unavailable.component.scss']
})
export class CustomerPortalUnavailableComponent extends ComponentWithSubscriptions implements OnInit {
  currentCustomer: CurrentCustomerModel;

  readonly Labels = CustomerPortalUnavailableLabels;

  constructor(private currentDataService: CustomerCurrentDataService, @Inject(ROUTING_SERVICE_TOKEN) private routingService: BaseRoutingService) {
    super();
  }

  ngOnInit(): void {
    this.currentCustomer = this.currentDataService.currentCustomer;
  }

  goToSignIn() {
    this.routingService.navigateLoginPageAndBroadcast();
    return;
  }

  protected readonly CustomerCompanyInvitationLabels = CustomerCompanyInvitationLabels;
}
