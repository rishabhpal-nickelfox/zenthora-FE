import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {ApiAuditService} from "./api-audit.service";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {
  ApiAuditActionEnumValue,
  ApiAuditActionFilterValues
} from "../../../../../common/src/lib/enums/apiaudit/api-audit-action.enum";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {ApiAuditResultValue} from "../../../../../common/src/lib/enums/apiaudit/api-audit-result";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';

@Component({
  standalone: false,
  selector: 'app-api-audit',
  templateUrl: './api-audit.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class ApiAuditComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;

  @ViewChild('table', { static: true }) protected table: TableComponent;

  protected readonly ApiAuditResultValue = ApiAuditResultValue;
  constructor(protected elementRef: ElementRef,
              private apiAuditService: ApiAuditService,
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
      new ExtendedTableHeader({
        key: 'DATE',
        value: 'Timestamp (' + DateTime.local().zoneName + ')',
        sortProperty: 'date',
        sortOrder: 'desc'
      }),
      new ExtendedTableHeader({key: 'PLATFORM_NAME', value: 'Platform Name', sortProperty: 'apiToken.platform.name'}),
      new ExtendedTableHeader({key: 'IP', value: 'IP', sortProperty: 'ip'}),
      new ExtendedTableHeader({key: 'TOKEN_NAME', value: 'Token Name', sortProperty: 'apiToken.name'}),
      new ExtendedTableHeader({key: 'ENTITY_ID', value: 'Company ID', sortProperty: 'apiToken.company.id'}),
      new ExtendedTableHeader({
        key: 'ENTITY_LEGAL_NAME',
        value: 'Company Legal Name',
        sortProperty: 'entity.legalName'
      }),
      new ExtendedTableHeader({key: 'ACTION', value: 'Action', sortProperty: 'action'}),
      new ExtendedTableHeader({key: 'RESULT', value: 'Result', sortProperty: 'success'}),
      new ExtendedTableHeader({key: 'DETAILS', value: 'Details', sortProperty: null})
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: ['dateFrom', 'dateTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Date Range', nullable: true}
      },
      {
        filterProperty: 'platformName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Platform Name'}
      },
      {
        filterProperty: 'ip',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'IP'}
      },
      {
        filterProperty: 'tokenName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Token Name'}
      },

      {
        filterProperty: 'entityId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'Company ID'}
      },
      {
        filterProperty: 'legalName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Company Legal Name'}
      },
      {
        filterProperty: 'action',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: ApiAuditActionFilterValues,
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => ApiAuditActionEnumValue.get(value)
        }
      },
      {
        filterProperty: 'success',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: [true, false],
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => ApiAuditResultValue.get(value),
        }
      },
      {
        filterProperty: 'details',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Details'}
      }
    ];
  }

  get service() {
    return this.apiAuditService;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }
}
