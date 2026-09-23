import {AfterViewInit, ChangeDetectorRef, ElementRef, HostListener, Inject, Injectable, OnInit} from '@angular/core';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {ActivatedRoute} from "@angular/router";
import {
  FilterDateRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-date-range-open-boundaries.component";
import {PaymentStatusEnum, PaymentStatusEnumValue} from "../../../../../common/src/lib/enums/sale/payment-status.enum";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {SaleService} from "../../../services/sale.service";
import {SalePortalPaymentViewModel, SaleTableModel} from "../../../models/sale-portal-payment-view.model";
import {SalePortalPaymentComponent} from "./sale-portal-payment.component";
import {finalize} from "rxjs/operators";
import {MoneyHelper} from "../../../../../common/src/lib/helpers/money.helper";
import {SaleLabels} from "./sale-labels";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {ComponentCanDeactivate} from "../../../../../common/src/lib/pages/can-deactivate.component";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';

@Injectable()
export abstract class SaleComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  headers;
  filters;
  showArchivedSales;
  showPaidSales;
  DocTypeEnumValue = DocTypeEnumValue;
  PaymentStatusEnumValue = PaymentStatusEnumValue;
  protected table: TableComponent;
  protected showSalePayment: boolean;
  protected saleModel: SalePortalPaymentViewModel;
  protected _saleComponent: SalePortalPaymentComponent;
  protected readonly Labels = SaleLabels;

  constructor(protected elementRef: ElementRef,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef) {
    super(elementRef, routingService);
  }

  abstract get docType(): DocTypeEnum;

  abstract get service(): SaleService

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.showSalePayment = false;
    this.saleModel = null;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    if (this.ifIsRedirectWithSpecifiedSaleId()) {
      this.processIsRedirectWithSpecifiedSaleId();
    }
  }

  private ifIsRedirectWithSpecifiedSaleId(): boolean{
    return ObjectHelper.isDefined(this.router.snapshot.queryParamMap.get('saleId'));
  }

  private processIsRedirectWithSpecifiedSaleId(): void{
    const id = Number(this.router.snapshot.queryParamMap.get('saleId'));
    this.onViewSale(id);
    this.routingService.clearRoutingQueryParams();
  }

  onShowArchivedSales() {
    this.showArchivedSales = !this.showArchivedSales;
    if (this.showArchivedSales) {
      this.table.setStaticFilter('showArchived', 'true');
    } else {
      this.table.removeStaticFilter('showArchived');
    }
    this.table.refresh();
  }

  onShowPaidSales() {
    this.showPaidSales = !this.showPaidSales;
    if (this.showPaidSales) {
      this.table.setStaticFilter('showPaid', 'true');
    } else {
      this.table.removeStaticFilter('showPaid');
    }
    this.table.refresh();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers: ExtendedTableHeader[] = [];
    headers.push(new ExtendedTableHeader({key: 'docNumber', value: `${DocTypeEnumValue.get(this.docType)} #`, sortProperty: 'docNumber'}));
    headers.push(new ExtendedTableHeader({key: 'docDate', value: this.Labels.Date, sortProperty: 'docDate'}));
    headers.push(new ExtendedTableHeader({key: 'total', value: this.Labels.Total, sortProperty: 'total'}));
    headers.push(new ExtendedTableHeader({key: 'appliedAmount', value: this.Labels.AppliedAmount, sortProperty: 'appliedAmount'}));
    headers.push(new ExtendedTableHeader({key: 'amountDue', value: this.Labels.AmountDue, sortProperty: 'amountDue'}));
    headers.push(new ExtendedTableHeader({key: 'paymentStatus', value: this.Labels.PaymentStatus, sortProperty: null}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters: ExtendedTableFilter[] = [];
    filters.push(
      {
        filterProperty: 'docNumber',
        componentType: FilterInputComponent,
        componentParams: {placeholder: `${DocTypeEnumValue.get(this.docType)} #`}
      },
      {
        filterProperty: ['docDateFrom', 'docDateTo'],
        componentType: FilterDateRangeOpenBoundariesComponent,
        componentParams: {placeholder: this.Labels.DateRange, nullable: true}
      },
      null,
      null,
      null,
      {
        filterProperty: 'paymentStatus',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(PaymentStatusEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => PaymentStatusEnumValue.get(value)
        }
      }
    );
    return filters;
  }

  onViewSale(rowDataId: number) {
    this.table.loading = true;
    this.subscriptions.add(this.service.getAdditionalInfo(rowDataId)
      .pipe(finalize(() => {
        this.table.loading = false;
        this.ch.detectChanges();
      }))
      .subscribe(
        responseModel => {
          this.saleModel = responseModel;
          this.showSalePayment = true;
        }
      ))
  }

  onCancel() {
    this.showSalePayment = false;
    this.table.refresh();
  }

  getCurrencyPrefix(rowData: SaleTableModel): string {
    return MoneyHelper.getCurrencyPrefix(rowData.currency);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this._saleComponent || !this._saleComponent.processPayment;
  }

}
