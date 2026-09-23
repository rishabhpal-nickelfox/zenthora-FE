import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../services/customer.service";
import {ComponentWithSubscriptions} from "../../../../../common/src/lib/components/component-with-subscriptions";
import {finalize, map} from "rxjs/operators";
import {SaleEmailCustomerIsNotSuitableModalLabels} from "./sale-email-customer-is-not-suitable-modal-labels";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-sale-email-customer-is-not-suitable-modal',
  templateUrl: './sale-email-customer-is-not-suitable-modal.component.html',
  styleUrls: ['../../../../../common/src/lib/modals/external-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleEmailCustomerIsNotSuitableModalComponent extends ComponentWithSubscriptions {

  loading = false;
  Labels = SaleEmailCustomerIsNotSuitableModalLabels;
  private companyId: number;

  constructor(private activeModal: NgbActiveModal, private customerService: CustomerService, private cd: ChangeDetectorRef) {
    super();
  }

  get showSwitchCompany(): boolean {
    return ObjectHelper.isDefined(this.companyId);
  }

  reInit(companyId: number) {
    this.companyId = companyId;
    this.cd.detectChanges();
  }

  onSwitchCompany() {
    this.loading = true;
    this.subscriptions.add(
      this.customerService.selectCompany(this.companyId)
        .pipe(finalize(() => {
          this.loading = false;
          this.cd.detectChanges();
        }))
        .pipe(map(() => this.activeModal.close()))
        .subscribe()
    );
  }

  onLogout() {
    this.customerService.logout();
    this.activeModal.close();
  }

}
