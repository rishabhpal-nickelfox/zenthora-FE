import {ChangeDetectorRef, Component, ElementRef, Inject, ViewChild} from "@angular/core";
import {SaleComponent} from "../sale.component";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {ActivatedRoute} from "@angular/router";
import {SalesOrderService} from "../../../../services/sales-order.service";
import {TableComponent} from "../../../../../../common/src/lib/table/table.component";
import {DocTypeEnum} from "@eps/common";
import {SalesOrderPaymentComponent} from "./sales-order-payment.component";
import {TransactionLabels} from "../../../../../../company-portal/src/app/pages/transactions/transaction-labels";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', '../sale.component.scss']
})
export class SalesOrderComponent extends SaleComponent {
  @ViewChild('table', {static: true}) protected table: TableComponent;

  constructor(protected elementRef: ElementRef,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              protected salesOrderService: SalesOrderService) {
    super(elementRef, errorService, routingService, alertService, router, ch);
  }

  @ViewChild(SalesOrderPaymentComponent)
  set saleComponent(c: SalesOrderPaymentComponent) {
    this._saleComponent = c;
    if (this._saleComponent) {
      this._saleComponent.reInit(this.saleModel);
    }
  }

  get service(): SalesOrderService {
    return this.salesOrderService;
  }

  get docType(): DocTypeEnum {
    return DocTypeEnum.SALES_ORDER;
  }

  protected readonly TransactionLabels = TransactionLabels;
}
