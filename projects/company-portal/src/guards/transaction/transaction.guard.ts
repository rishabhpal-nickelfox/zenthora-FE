import {Inject, Injectable} from "@angular/core";
import {CommonGuard} from "../common.guard";
import {TransactionUiKeyService} from "../../services/transaction/transaction-ui-key.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class TransactionGuard extends CommonGuard {
  constructor(protected transactionUiKeyService: TransactionUiKeyService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(routingService);
  }

  get condition() {
    return this.transactionUiKeyService.showTransactions();
  }
}
