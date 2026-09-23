import {AfterViewInit, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {EmailService} from "../../../services/email/email.service";
import {EmailUiKeyService} from "../../../services/email/email-ui-key.service";
import {
  EmailStatusDescription,
  EmailStatusEnum,
  EmailStatusEnumValue, EmailStatusFilterEnum
} from "../../../../../common/src/lib/enums/email/email-status.enum";
import {ActivatedRoute} from "@angular/router";
import {EmailModel} from "../../../../../common/src/lib/models/email/email.model";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {EmailTypeEnum, EmailTypeEnumValue} from "../../../../../common/src/lib/enums/sale/email-type.enum";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';
import {
  EmailAddressTypeEnum,
  EmailAddressTypeEnumValue
} from "../../../../../common/src/lib/enums/sale/email-address-type.enum";

@Component({
  standalone: false,
  selector: 'app-email',
  templateUrl: './email-table.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './email-table.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class EmailTableComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;
  isSystemEmail;

  @ViewChild('table', { static: true }) protected table: TableComponent;

  EmailStatusDescription = EmailStatusDescription;
  EmailStatusEnumValue = EmailStatusEnumValue;
  constructor(protected elementRef: ElementRef,
              private emailService: EmailService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected emailUiKeyService: EmailUiKeyService,
              protected alertService: AlertService,
              protected router: ActivatedRoute) {
    super(elementRef, routingService);
  }

  ngOnInit() {
    this.reInit();
    if (this.isRedirectWithSpecifiedId()) {
      this.processRedirectWithSpecifiedId();
    }
  }

  reInit() {
    this.isSystemEmail = this.emailUiKeyService.showSystemEmails();
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers = [];
    headers.push({key: 'EXPAND', value: '', sortProperty: null});
    headers.push(
      {key: 'ID', value: 'ID', sortProperty: 'id'});
    if (this.isSystemEmail) {
      headers.push({key: 'VAULT_COMPANY_ID', value: 'Vault Company ID', sortProperty: null});
      headers.push({key: 'PLATFORM_ID', value: 'Platform ID', sortProperty: null});
      headers.push({key: 'COMPANY_ID', value: 'Company ID', sortProperty: 'companyId'});
    }
    headers.push({key: 'TOKEN_NAME', value: 'Token Name', sortProperty: 'apiToken.name'});
    headers.push({key: 'EMAILED_ON', value: 'Emailed on (' + DateTime.local().zoneName + ')', sortProperty: 'emailedOn'});
    headers.push({key: 'TYPE', value: 'Type', sortProperty: 'type'});
    headers.push({key: 'SUBJECT', value: 'Subject', sortProperty: null});
    headers.push({key: 'TO', value: 'To/CC/BCC', sortProperty: 'to', collapsible: false});
    headers.push({key: 'STATUS', value: 'Status', sortProperty: 'sgStatus.status', collapsible: false});
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(null);
    filters.push({
      filterProperty: 'id',
      componentType: FilterIntegerInputComponent,
      componentParams: {placeholder: 'ID'}
    });
    if (this.isSystemEmail) {
      filters.push({
        filterProperty: 'vaultCompanyId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'Vault Company ID'}
      });
      filters.push({
        filterProperty: 'platformId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'Platform ID'}
      });
      filters.push({
        filterProperty: 'companyId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'Company ID'}
      });
    }
    filters.push(
      {
        filterProperty: 'tokenName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Token Name'}
      },
      {
        filterProperty: ['emailedOnFrom', 'emailedOnTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Date Range', nullable: true}
      },
      {
        filterProperty: 'type',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(EmailTypeEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => EmailTypeEnumValue.get(value)
        }
      },
      {
        filterProperty: 'subject',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Subject'}
      },
      {
        filterProperty: 'to',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'To'}
      },
      {
        filterProperty: 'status',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: EmailStatusFilterEnum,
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => EmailStatusEnumValue.get(value)
        }
      }
    );
    return filters;
  }

  get service() {
    return this.emailService;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  getStatusName(status: string): string {
    return EmailStatusEnumValue.get(status);
  }

  isRedirectWithSpecifiedId() {
    return this.isDefined(this.router.snapshot.queryParamMap.get('id'));
  }

  processRedirectWithSpecifiedId() {
    this.routingService.clearRoutingQueryParams();
    this.table.setStaticFilter('id', this.router.snapshot.queryParamMap.get('id'));
  }


  showExpandStatuses(row: EmailModel): boolean {
    return row.statuses && row.statuses.length > 0;
  }

  expandStatuses(row: EmailModel): void {
    row._expandStatuses = !row._expandStatuses;
  }

  protected readonly EmailTypeEnumValue = EmailTypeEnumValue;
  protected readonly EmailAddressTypeEnum = EmailAddressTypeEnum;
  protected readonly EmailAddressTypeEnumValue = EmailAddressTypeEnumValue;
}
