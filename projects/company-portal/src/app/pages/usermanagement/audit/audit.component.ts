import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ExtendedTableFilter, ExtendedTableHeader} from '../../../../../../common/src/lib/table/table.component';
import {AuditCompanyService} from '../../../../services/auditerrorsmanagement/audit.company.service';
import {AuditSystemService} from '../../../../services/auditerrorsmanagement/audit.system.service';
import {ErrorService} from '../../../../../../common/src/lib/utils/errorhandler/error.service';
import {FilterInputComponent} from '../../../../../../common/src/lib/table/filter/filter-input.component';
import {
  FilterIntegerInputComponent
} from '../../../../../../common/src/lib/table/filter/filter-integer-input.component';
import {FilterSelectComponent} from '../../../../../../common/src/lib/table/filter/filter-select.component';
import {
  CompanyAuditActionEnum,
  CompanyAuditActionName,
  SystemAuditActionEnum,
  SystemAuditActionName
} from '../../../../enums/usermanagement/audit-action.enum';
import {
  FilterTimestampRangeOpenBoundariesComponent
} from '../../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component';
import {CompanyCurrentDataService} from "../../../../services/company-current-data.service";
import {UiKeyEnum} from "../../../../enums/usermanagement/ui-key.enum";
import {NbCardListPage} from "../../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';

@Component({
  standalone: false,
  selector: 'app-new-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class AuditComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;
  isSystemAudit;

  constructor(protected elementRef: ElementRef,
              protected _auditSystemService: AuditSystemService,
              protected _auditCompanyService: AuditCompanyService,
              protected currentDataService: CompanyCurrentDataService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {
    super(elementRef, routingService);
  }

  ngOnInit(): void {
    this.reInit();
  }

  reInit() {
    this.isSystemAudit = this.currentRoleContainPermission(UiKeyEnum.SYSTEM_API_AUDIT)
      || this.currentRoleContainPermission(UiKeyEnum.SYSTEM_SENDGRID_AUDIT)
      || this.currentRoleContainPermission(UiKeyEnum.SYSTEM_USER_AUDIT);
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers = [
      new ExtendedTableHeader({
        key: 'TIMESTAMP', value: 'Timestamp (' + DateTime.local().zoneName + ')',
        sortProperty: 'date', sortOrder: 'desc'
      }),
      new ExtendedTableHeader({key: 'IP', value: 'IP', sortProperty: 'ip'}),
      new ExtendedTableHeader({key: 'LOGIN', value: 'Login', sortProperty: 'user.email'})
    ];
    if (this.showEntityIdColumn) {
      headers.push(new ExtendedTableHeader({key: 'ENTITY_ID', value: 'Entity ID', sortProperty: 'role.entity.id'}));
    }
    if (this.showEntityIdColumn) {
      headers.push(new ExtendedTableHeader({
        key: 'ENTITY_LEGAL_NAME',
        value: 'Entity Legal Name',
        sortProperty: 'role.entity.legalName'
      }));
    }
    headers.push(new ExtendedTableHeader({key: 'ACTION', value: 'Action', sortProperty: 'action'}));
    headers.push(new ExtendedTableHeader({key: 'DETAILS', value: 'Details', sortProperty: null}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(...[
      {
        filterProperty: ['dateFrom', 'dateTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Date Range', nullable: true}
      },
      {
        filterProperty: 'ip',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'IP'}
      },
      {
        filterProperty: 'user.email',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Login'}
      }]);
    if (this.showEntityIdColumn) {
      filters.push({
        filterProperty: 'role.entity.id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'Entity ID'}
      });
    }
    if (this.showEntityLegalNameColumn) {
      filters.push({
        filterProperty: 'role.entity.legalName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Entity Legal Name'}
      });
    }
    filters.push({
      filterProperty: 'action',
      componentType: FilterSelectComponent,
      componentParams: {
        placeholder: 'All',
        options: Object.keys(this.isSystemAudit ? SystemAuditActionEnum : CompanyAuditActionEnum),
        optionValueFunction: (value) => value,
        optionNameFunction: (value) => this.isSystemAudit ? SystemAuditActionName.get(value) : CompanyAuditActionName.get(value)
      }
    });
    filters.push({
      filterProperty: 'details',
      componentType: FilterInputComponent,
      componentParams: {placeholder: 'Details'}
    });

    return filters;
  }

  get auditService() {
    return this.isSystemAudit ? this._auditSystemService : this._auditCompanyService;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  get showEntityIdColumn() {
    return this.isSystemAudit;
  }

  get showEntityLegalNameColumn() {
    return this.isSystemAudit;
  }

  currentRoleContainPermission(uiKey) {
    let hasPermission = false;
    const currentUser = this.currentDataService.getCurrentUser();
    if (currentUser && currentUser.currentRole && currentUser.currentRole.permissions) {
      currentUser.currentRole.permissions.forEach(permission => {
        hasPermission = hasPermission || permission.uiKey === uiKey;
      });
    }
    return hasPermission;
  }
}
