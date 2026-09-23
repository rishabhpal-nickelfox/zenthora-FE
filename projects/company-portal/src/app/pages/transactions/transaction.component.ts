import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {ExtendedTableFilter, ExtendedTableHeader} from "../../../../../common/src/lib/table/table.component";
import {TransactionLabels} from "./transaction-labels";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {ActivatedRoute} from "@angular/router";
import {FilterInputComponent} from "../../../../../common/src/lib/table/filter/filter-input.component";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterFloatInputComponent} from "../../../../../common/src/lib/table/filter/filter-float-input.component";
import {PaymentSourceEnum, PaymentSourceEnumValue} from "../../../../../common/src/lib/enums/sale/payment-source.enum";
import {
  TransactionPaymentMethodEnum,
  TransactionPaymentMethodEnumValue
} from "../../../../../common/src/lib/enums/sale/transaction-payment-method.enum";
import {CreditCardEnumValue} from "../../../../../common/src/lib/enums/sale/credit-card.enum";
import {AccountTypeEnumValue} from "../../../../../common/src/lib/enums/sale/account-type.enum";
import moment from "moment";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {MoneyHelper} from "../../../../../common/src/lib/helpers/money.helper";
import {
  TransactionPaymentStatusEnum,
  TransactionPaymentStatusEnumValue
} from "../../../../../common/src/lib/enums/sale/transaction-payment-status.enum";
import {TransactionTableComponent} from "./transaction-table.component";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {TransactionModel} from "../../models/transactions/transaction.model";
import {TransactionService} from "../../../services/transaction/transaction.service";
import {CompanyRoutingService} from "../../../services/company-routing.service";
import {SaleUiKeyService} from "../../../services/sale/sale-ui-key.service";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-transactions',
  templateUrl: './transaction.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './transaction.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class TransactionComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;
  readonly Labels = TransactionLabels;
  @ViewChild('table', {static: true}) protected table: TransactionTableComponent;
  protected readonly PaymentSourceEnumValue = PaymentSourceEnumValue;
  protected readonly TransactionPaymentMethodEnum = TransactionPaymentMethodEnum;
  protected readonly CreditCardEnumValue = CreditCardEnumValue;
  protected readonly AccountTypeEnumValue = AccountTypeEnumValue;
  protected readonly TransactionPaymentStatusEnum = TransactionPaymentStatusEnum;
  protected readonly TransactionPaymentStatusEnumValue = TransactionPaymentStatusEnumValue;
  protected readonly TransactionPaymentMethodEnumValue = TransactionPaymentMethodEnumValue;
  protected readonly DocTypeEnum = DocTypeEnum;
  protected readonly DocTypeEnumValue = DocTypeEnumValue;

  constructor(protected elementRef: ElementRef,
              private transactionService: TransactionService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              private saleUiKeyService: SaleUiKeyService) {
    super(elementRef, routingService);
  }

  get service() {
    return this.transactionService;
  }

  ngOnInit() {
    this.reInit();
    if (this.isRedirectWithSpecifiedId()) {
      this.processRedirectWithSpecifiedId();
    }
  }

  reInit() {
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers: ExtendedTableHeader[] = [];
    headers.push(new ExtendedTableHeader({key: 'id', value: this.Labels.ID, sortProperty: null}));
    headers.push(new ExtendedTableHeader({
      key: 'transactionTimestamp',
      value: `${this.Labels.TransactionTimestamp} (${moment.tz.guess()})`,
      sortProperty: 'transactionTimestamp'
    }));
    headers.push(new ExtendedTableHeader({key: 'docType', value: this.Labels.DocType, sortProperty: 'docType'}));
    headers.push(new ExtendedTableHeader({key: 'docNumber', value: this.Labels.DocNumber, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'source', value: this.Labels.Source, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'paymentMethod', value: this.Labels.PaymentMethod, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'last4', value: this.Labels.Last4, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'amount', value: this.Labels.Amount, sortProperty: 'amount'}));
    headers.push(new ExtendedTableHeader({key: 'surcharge', value: this.Labels.Surcharge, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'totalAmount', value: this.Labels.Total, sortProperty: 'totalAmount'}));
    headers.push(new ExtendedTableHeader({key: 'status', value: this.Labels.Status, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'authCode', value: this.Labels.AuthCode, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'vaultProductId', value: this.Labels.ProductId, sortProperty: null}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(...[
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.ID}
      },
      {
        filterProperty: ['transactionTimestampFrom', 'transactionTimestampTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: this.Labels.DateRange}
      },
      {
        filterProperty: 'docType',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(DocTypeEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => this.DocTypeEnumValue.get(value)
        }
      },
      {
        filterProperty: 'docNumber',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.DocNumber}
      },
      {
        filterProperty: 'source',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(PaymentSourceEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => this.PaymentSourceEnumValue.get(value)
        }
      },
      {
        filterProperty: 'paymentMethod',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(TransactionPaymentMethodEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => this.TransactionPaymentMethodEnumValue.get(value)
        }
      },
      {
        filterProperty: 'last4',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.Last4Placeholder}
      },
      {
        filterProperty: 'amount',
        componentType: FilterFloatInputComponent,
        componentParams: {placeholder: this.Labels.Amount}
      },
      null,
      {
        filterProperty: 'totalAmount',
        componentType: FilterFloatInputComponent,
        componentParams: {placeholder: this.Labels.Total}
      },
      {
        filterProperty: 'status',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(TransactionPaymentStatusEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => this.TransactionPaymentStatusEnumValue.get(value)
        }
      },
      {
        filterProperty: 'authCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.AuthCode}
      },
      {
        filterProperty: 'vaultProductId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.ProductId}
      }
    ]);

    return filters;
  }


  isSuccessful(rowData: TransactionModel): boolean {
    return rowData.success;
  }

  getCurrencyPrefix(rowData: TransactionModel): string {
    return MoneyHelper.getCurrencyPrefix(rowData.currency);
  }

  get companyRoutingService(): CompanyRoutingService {
    return this.routingService as CompanyRoutingService;
  }

  goToSale(saleId: number) {
    this.companyRoutingService.getRouter().navigate([this.companyRoutingService.salePagePath], {
      queryParams: {
        id: saleId
      },
      skipLocationChange: true
    });
  }


  canGoToSale() {
    return this.saleUiKeyService.showInvoices();
  }


  isRedirectWithSpecifiedId() {
    return this.isDefined(this.router.snapshot.queryParamMap.get('transactionId'));
  }

  processRedirectWithSpecifiedId() {
    this.companyRoutingService.clearRoutingQueryParams();
    this.table.setStaticFilter('id', this.router.snapshot.queryParamMap.get('transactionId'));
  }

  protected readonly ObjectHelper = ObjectHelper;
}
