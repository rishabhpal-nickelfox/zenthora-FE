import {Component} from '@angular/core';
import {FilterBaseComponent} from "../../../../../../common/src/lib/table/filter/filter-base.component";
import {
  isWebhookCustomerEvent,
  isWebhookPaymentDataEvent, isWebhookPaymentEvent,
  isWebhookSaleEvent, WebhookCustomerEvents,
  WebhookEventEnum,
  WebhookEventEnumValue, WebhookPaymentDataEvents, WebhookPaymentEvents,
  WebhookSaleEvents
} from "../../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";

@Component({
  standalone: false,
  selector: 'app-webhook-error-event-filter',
  templateUrl: 'webhook-error-event-filter.components.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', './webhook-error-event-filter.components.scss'],
  outputs: ['filterChanged']
})
export class WebhookErrorEventFilterComponents extends FilterBaseComponent {

  protected readonly WebhookEventEnum = WebhookEventEnum;
  protected readonly WebhookEventEnumValue = WebhookEventEnumValue;
  protected readonly WebhookSaleEvents = WebhookSaleEvents;
  protected readonly WebhookPaymentEvents = WebhookPaymentEvents;
  protected readonly WebhookPaymentDataEvents = WebhookPaymentDataEvents;
  protected readonly WebhookCustomerEvents = WebhookCustomerEvents;
  protected readonly isWebhookSaleEvent = isWebhookSaleEvent;
  protected readonly isWebhookPaymentEvent = isWebhookPaymentEvent;
  protected readonly isWebhookPaymentDataEvent = isWebhookPaymentDataEvent;
  protected readonly isWebhookCustomerEvent = isWebhookCustomerEvent;

  protected placeholder = 'All';
  protected _filterValue = null;

  set params(params: any) {
  }

  onFilterChange(value) {
    this.filterValue = value;
  }

  reset() {
    this._filterValue = null;
  }

  enumKeys(Enum): String[] {
    return Object.keys(Enum);
  }
}
