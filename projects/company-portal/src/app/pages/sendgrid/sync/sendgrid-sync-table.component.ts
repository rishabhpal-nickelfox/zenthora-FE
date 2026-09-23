import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../../common/src/lib/table/table.component';
import {CompanyRoutingService} from '../../../../services/company-routing.service';
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {SendgridSyncService} from "../../../../services/sendgrid/sendgrid-sync.service";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterInputComponent} from "../../../../../../common/src/lib/table/filter/filter-input.component";

import * as moment from "moment-timezone";
import {DocTypeEnumValue} from "@eps/common";
import {EmailAddressTypeEnumValue} from "../../../../../../common/src/lib/enums/sale/email-address-type.enum";
import {NbCardListPage} from "../../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-sendgrid-sync',
  templateUrl: './sendgrid-sync-table.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', './sendgrid-sync-table.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class SendgridSyncTableComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;

  DocTypeEnumValue = DocTypeEnumValue;
  EmailAddressTypeEnumValue = EmailAddressTypeEnumValue;
  @ViewChild('table', {static: true}) protected table: TableComponent;

  constructor(protected elementRef: ElementRef,
              private sendgridSyncService: SendgridSyncService,
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
    return [
      new ExtendedTableHeader({key: 'TIMESTAMP', value: 'Timestamp (' + moment.tz.guess() + ')', sortProperty: 'date', sortOrder: 'desc'}),
      new ExtendedTableHeader({key: 'EMAILS_VERIFIED', value: 'Emails Verified', sortProperty: 'verified'}),
      new ExtendedTableHeader({key: 'EMAILS_UPDATED', value: 'Emails Updated', sortProperty: 'updated'}),
        new ExtendedTableHeader({key: 'ERROR_MESSAGE', value: 'Error Message', sortProperty: null})
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: ['dateFrom', 'dateTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Date Range'}
      },
      null,
      null,
      {
        filterProperty: 'error',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Error Message'}
      }
    ];
  }

  get service() {
    return this.sendgridSyncService;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  get companyRoutingService(): CompanyRoutingService {
    return this.routingService as CompanyRoutingService;
  }

  goToEmail(refId) {
    this.companyRoutingService.getRouter().navigate([this.companyRoutingService.emailPagePath], {
      queryParams: {
        id: refId
      }, queryParamsHandling: 'merge'
    });
  }

  goToSale(refId) {
    this.companyRoutingService.getRouter().navigate([this.companyRoutingService.salePagePath], {
      queryParams: {
        id: refId
      }, queryParamsHandling: 'merge'
    });
  }
}
