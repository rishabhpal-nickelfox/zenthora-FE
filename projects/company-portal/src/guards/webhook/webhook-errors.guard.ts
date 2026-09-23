import {Inject, Injectable} from "@angular/core";
import {CommonGuard} from "../common.guard";
import {WebhookUiKeyService} from "../../services/webhook/webhook-ui-key.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";

@Injectable()
export class WebhookErrorGuard extends CommonGuard {
  constructor(protected webhookUiKeyService: WebhookUiKeyService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(routingService);
  }

  get condition() {
    return this.webhookUiKeyService.showWebhookErrors();
  }
}
