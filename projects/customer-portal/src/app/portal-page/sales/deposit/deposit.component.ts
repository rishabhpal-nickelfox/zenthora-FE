import {ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from "@angular/core";
import {SaleComponent} from "../sale.component";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {ActivatedRoute} from "@angular/router";
import {DepositService} from "../../../../services/deposit.service";
import {TableComponent} from "../../../../../../common/src/lib/table/table.component";
import {DocTypeEnum} from "@eps/common";
import {DepositPaymentComponent} from "./deposit-payment.component";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', '../sale.component.scss']
})
export class DepositComponent extends SaleComponent {

  constructor(protected elementRef: ElementRef,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              protected depositService: DepositService) {
    super(elementRef, errorService, routingService, alertService, router, ch);
  }

  @ViewChild('table', {static: true}) protected table: TableComponent;

  @ViewChild(DepositPaymentComponent)
  set saleComponent(c: DepositPaymentComponent) {
    this._saleComponent = c;
    if (this._saleComponent) {
      this._saleComponent.reInit(this.saleModel);
    }
  }

  get service(): DepositService {
    return this.depositService;
  }

  get docType(): DocTypeEnum {
    return DocTypeEnum.DEPOSIT;
  }

}
