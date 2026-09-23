import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {SaleService} from "../../../services/sale/sale.service";
import {SaleUiKeyService} from "../../../services/sale/sale-ui-key.service";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {
  SaleEmailStatusDescription,
  SaleEmailStatusEnum,
  SaleEmailStatusEnumValue, SaleEmailStatusFilterEnum
} from "../../../../../common/src/lib/enums/sale/sale-email-status.enum";
import {ActivatedRoute} from "@angular/router";
import {
  FilterDateRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-date-range-open-boundaries.component";
import {PaymentStatusEnum, PaymentStatusEnumValue} from "../../../../../common/src/lib/enums/sale/payment-status.enum";
import {EmailAddressTypeEnumValue} from "../../../../../common/src/lib/enums/sale/email-address-type.enum";
import {SaleModel} from "../../../../../common/src/lib/models/sale/sale-model";
import {SalePreviewComponent} from "./sale-preview.component";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';

@Component({
  standalone: false,
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './sale.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class SaleComponent extends NbCardListPage implements OnInit, AfterViewInit {

  headers;
  filters;
  isSystemSales;

  @ViewChild('table', {static: true}) protected table: TableComponent;
  private previewModel: SaleModel;

  private _showArchivedSales;
  private _showPaidSales;

  SaleEmailStatusDescription = SaleEmailStatusDescription;
  EmailAddressTypeEnumValue = EmailAddressTypeEnumValue;

  constructor(protected elementRef: ElementRef,
              private saleService: SaleService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected saleUiKeyService: SaleUiKeyService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef) {
    super(elementRef, routingService);
  }

  private _previewComponent: SalePreviewComponent;

  get previewComponent(): SalePreviewComponent {
    return this._previewComponent;
  }

  @ViewChild(SalePreviewComponent)
  set createComponent(c: SalePreviewComponent) {
    this._previewComponent = c;
    if (this._previewComponent) {
      this._previewComponent.reInit(this.previewModel);
    }
    this.ch.detectChanges();
  }

  ngOnInit() {
    this.reInit();
    if (this.isRedirectWithSpecifiedId()) {
      this.processRedirectWithSpecifiedId();
    }
  }

  reInit() {
    this.isSystemSales = this.saleUiKeyService.showSystemSales();
    this.showArchivedSales = false;
    this.showPaidSales = false;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  private _showPreview = false;

  get showPreview(): boolean {
    return this._showPreview;
  }


  DocTypeEnumValue = DocTypeEnumValue;
  SaleEmailStatusEnumValue = SaleEmailStatusEnumValue;
  SaleStatusEnumValue = PaymentStatusEnumValue;


  get service() {
    return this.saleService;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  isRedirectWithSpecifiedId() {
    return this.isDefined(this.router.snapshot.queryParamMap.get('id'));
  }

  processRedirectWithSpecifiedId() {
    this.routingService.clearRoutingQueryParams();
    this.table.setStaticFilter('id', this.router.snapshot.queryParamMap.get('id'));
  }

  showExpandStatuses(row: SaleModel): boolean {
    return row.emailStatuses && row.emailStatuses.length > 0;
  }

  expandStatuses(row: SaleModel): void {
    row._expandStatuses = !row._expandStatuses;
  }

  onShowArchivedSales() {
    this.showArchivedSales = !this.showArchivedSales;
    this.table.refresh();
  }

  onShowPaidSales() {
    this.showPaidSales = !this.showPaidSales;
    this.table.refresh();
  }


  initHeaders(): ExtendedTableHeader[] {
    const headers = [
      new ExtendedTableHeader({key: 'EXPAND', value: '', sortProperty: null, collapsible: false}),
      new ExtendedTableHeader({key: 'ID', value: 'ID', sortProperty: 'id'})
    ];
    if (this.isSystemSales) {
      headers.push(new ExtendedTableHeader({key: 'VAULT_COMPANY_ID', value: 'Vault Company ID', sortProperty: null}));
      headers.push(new ExtendedTableHeader({key: 'PLATFORM_ID', value: 'Platform ID', sortProperty: null}));
      headers.push(new ExtendedTableHeader({key: 'COMPANY_ID', value: 'Company ID', sortProperty: 'companyId'}));
    }
    headers.push(new ExtendedTableHeader({key: 'TOKEN_NAME', value: 'Token Name', sortProperty: 'tokenName'}));
    headers.push(new ExtendedTableHeader({key: 'DOC_TYPE', value: 'Doc Type', sortProperty: 'docType'}));
    headers.push(new ExtendedTableHeader({key: 'DOC_DATE', value: 'Doc Date', sortProperty: 'docDate'}));
    headers.push(new ExtendedTableHeader({key: 'DOC_ID', value: 'Doc Id', sortProperty: 'docId'}));
    headers.push(new ExtendedTableHeader({key: 'DOC_NUMBER', value: 'Doc Number', sortProperty: 'docNumber'}));
    headers.push(new ExtendedTableHeader({key: 'VERSION', value: 'Version', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'EMAILED_ON', value: 'Emailed on (' + DateTime.local().zoneName + ')', sortProperty: 'emailedOn'}));
    headers.push(new ExtendedTableHeader({key: 'TO', value: 'To', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'PAYMENT_STATUS', value: 'Payment Status', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'EMAIL_STATUS', value: 'Email Status', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'ACTIONS', value: '', sortProperty: null}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(...[
      null,
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'ID'}
      }]);
    if (this.isSystemSales) {
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
    filters.push({
        filterProperty: 'tokenName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Token Name'}
      },
      {
        filterProperty: 'docType',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(DocTypeEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => DocTypeEnumValue.get(value)
        }
      },
      {
        filterProperty: ['docDateFrom', 'docDateTo'],
        componentType: FilterDateRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Doc Date Range', nullable: true}
      },
      {
        filterProperty: 'docId',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Doc Id'}
      },
      {
        filterProperty: 'docNumber',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Doc Number'}
      },
      null,
      {
        filterProperty: ['emailedOnDateFrom', 'emailedOnDateTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: 'Emailed On Date Range', nullable: true}
      },
      {
        filterProperty: 'to',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'To'}
      },
      {
        filterProperty: 'paymentStatus',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(PaymentStatusEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => PaymentStatusEnumValue.get(value)
        }
      },
      {
        filterProperty: 'emailStatus',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: SaleEmailStatusFilterEnum,
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => SaleEmailStatusEnumValue.get(value)
        }
      },
      null
    );
    return filters;
  }

  onShowPreview(row: SaleModel): boolean {
    this.previewModel = row;
    this._showPreview = true;
    return false;
  }

  onClosePreview() {
    this.previewModel = null;
    this._showPreview = false;
    this.ch.detectChanges();
  }

  get showPaidSales() {
    return this._showPaidSales;
  }

  set showPaidSales(value) {
    this._showPaidSales = value;
    if (this._showPaidSales) {
      this.table.setStaticFilter('showPaid', 'true');
    } else {
      this.table.removeStaticFilter('showPaid');
    }
  }

  get showArchivedSales() {
    return this._showArchivedSales;
  }

  set showArchivedSales(value: boolean) {
    this._showArchivedSales = value;
    if (this._showArchivedSales) {
      this.table.setStaticFilter('showArchived', 'true');
    } else {
      this.table.removeStaticFilter('showArchived');
    }
  }
}
