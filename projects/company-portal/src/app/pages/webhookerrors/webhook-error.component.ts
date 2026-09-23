import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {WebhookErrorService} from "../../../services/webhook/webhook-error.service";

import {DateTime} from "luxon";
import {
  isWebhookCustomerEvent,
  isWebhookPaymentDataEvent,
  isWebhookPaymentEvent,
  isWebhookSaleEvent,
  WebhookEventEnumValue
} from "../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {WebhookErrorEventFilterComponents} from "./filter/webhook-error-event-filter.components";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-webhook-errors',
  templateUrl: './webhook-error.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './webhook-error.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class WebhookErrorComponent extends NbCardListPage implements OnInit {
  headers;
  filters;
  readonly WebhookEventEnumValue = WebhookEventEnumValue;
  protected readonly isWebhookSaleEvent = isWebhookSaleEvent;
  protected readonly isWebhookPaymentDataEvent = isWebhookPaymentDataEvent;
  protected readonly isWebhookCustomerEvent = isWebhookCustomerEvent;
  protected readonly isWebhookPaymentEvent = isWebhookPaymentEvent;

  @ViewChild('table', {static: true}) protected table: TableComponent;

  constructor(protected elementRef: ElementRef,
              public webhookErrorService: WebhookErrorService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService) {
    super(elementRef, routingService);
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers = [];
    headers.push({key: 'COMPANY_ID', value: 'Company ID', sortProperty: 'companyId'});
    headers.push({key: 'DATE', value: 'Date (' + DateTime.local().zoneName + ')', sortProperty: 'date'});
    headers.push({key: 'DOC_ID', value: 'Doc ID', sortProperty: 'docId'});
    headers.push({key: 'OPERATION', value: 'Operation', sortProperty: 'operation'});
    headers.push({key: 'EXCEPTION_MESSAGE', value: 'Exception Message', sortProperty: null});
    headers.push({key: 'ATTEMPT_NUMBER', value: 'Attempt #', sortProperty: null});
    headers.push({key: 'RESPONSE_HTTP_CODE', value: 'Response HTTP Code', sortProperty: 'responseHttpCode'});
    headers.push({key: 'RESPONSE_BODY', value: 'Response Body', sortProperty: null});
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    return [{
      filterProperty: 'companyId',
      componentType: FilterIntegerInputComponent,
      componentParams: {placeholder: 'Company ID'}
    },
      {
        filterProperty: ['dateFrom', 'dateTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Date Range', nullable: true}
      },
      {
        filterProperty: 'docId',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Doc ID'}
      },
      {
        filterProperty: 'event',
        componentType: WebhookErrorEventFilterComponents,
        componentParams: {}
      },
      {
        filterProperty: 'exceptionMessage',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Exception Message'}
      },
      null,
      {
        filterProperty: 'responseHttpCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'HTTP Code'}
      },
      {
        filterProperty: 'responseBody',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Response Body'}
      }];
  }
}
