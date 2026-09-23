import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {VaultErrorsService} from "../../../services/vaulterrors/vault-errors.service";
import {VaultErrorsUiKeyService} from "../../../services/vaulterrors/vault-errors-ui-key.service";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {OperationEnum, OperationName} from "../../../../../common/src/lib/enums/vaulterrors/operation.enum";
import {VaultActionEnum, VaultActionName} from "../../../../../common/src/lib/enums/vaulterrors/vault-action.enum";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';

@Component({
  standalone: false,
  selector: 'app-vault-errors',
  templateUrl: './vault-errors-table.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class VaultErrorsTableComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;
  isSystemVaultErrors;

  @ViewChild('table', {static: true}) protected table: TableComponent;

  constructor(protected elementRef: ElementRef,
              private vaultErrorsService: VaultErrorsService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected vaultErrorsUiKeyService: VaultErrorsUiKeyService,
              protected alertService: AlertService) {
    super(elementRef, routingService);
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.isSystemVaultErrors = this.vaultErrorsUiKeyService.showSystemVaultErrors();
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers = [];
    if (this.isSystemVaultErrors) {
      headers.push({key: 'COMPANY_ID', value: 'Company ID', sortProperty: 'companyId'});
    }
    headers.push({key: 'DATE', value: 'Date (' + DateTime.local().zoneName + ')', sortProperty: 'date'});
    headers.push({key: 'USER_ROLE', value: 'User / Role', sortProperty: 'user.email'});
    headers.push({key: 'OPERATION', value: 'Operation', sortProperty: 'operation'});
    headers.push({key: 'VAULT_ACTION', value: 'Vault action', sortProperty: 'vaultAction'});
    headers.push({key: 'VAULT_HTTP_CODE', value: 'Vault HTTP code', sortProperty: 'vaultHttpCode'});
    headers.push({key: 'VAULT_ERROR_CODE', value: 'Vault error code', sortProperty: 'vaultErrorCode'});
    headers.push({key: 'VAULT_ERROR_MESSAGE', value: 'Vault error message', sortProperty: 'vaultErrorMessage'});
    headers.push({key: 'BANK_ERROR_CODE', value: 'Bank error code', sortProperty: 'bankErrorCode'});
    headers.push({key: 'BANK_ERROR_MESSAGE', value: 'Bank error message', sortProperty: 'bankErrorMessage'});
    if (this.isSystemVaultErrors) {
      headers.push({key: 'VAULT_RESPONSE_BODY', value: 'Vault response body', sortProperty: 'vaultResponseBody'});
      headers.push({key: 'EXCEPTION_MESSAGE', value: 'Exception message', sortProperty: 'exceptionMessage'});
    }
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    if (this.isSystemVaultErrors) {
      filters.push({
        filterProperty: 'companyId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'Company ID'}
      });
    }
    filters.push(
      {
        filterProperty: ['dateFrom', 'dateTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Date Range', nullable: true}
      },
      {
        filterProperty: 'userRole',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'User / Role'}
      },
      {
        filterProperty: 'operation',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(OperationEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => OperationName.get(value)
        }
      },
      {
        filterProperty: 'vaultAction',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(VaultActionEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => VaultActionName.get(value)
        }
      },
      {
        filterProperty: 'vaultHttpCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Vault HTTP code'}
      },
      {
        filterProperty: 'vaultErrorCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Vault error code'}
      },
      {
        filterProperty: 'errorMessage',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Vault error message'}
      },
      {
        filterProperty: 'bankErrorCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Bank error code'}
      },
      {
        filterProperty: 'bankErrorMessage',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Bank error message'}
      }
    );

    if (this.isSystemVaultErrors) {
      filters.push(
        {
          filterProperty: 'vaultResponseBody',
          componentType: FilterInputComponent,
          componentParams: {placeholder: 'Vault response body'}
        },
        {
          filterProperty: 'exceptionMessage',
          componentType: FilterInputComponent,
          componentParams: {placeholder: 'Exception message'}
        });
    }

    return filters;
  }

  get service() {
    return this.vaultErrorsService;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  getOperationName(operation: string): string {
    return OperationName.get(operation);
  }

  getVaultActionName(vaultAction: string): string {
    return VaultActionName.get(vaultAction);
  }
}
