import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from "@angular/core";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {ExtendedTableFilter, ExtendedTableHeader} from "../../../../../common/src/lib/table/table.component";
import {CustomerTransactionLabels} from "./customer-transaction-labels";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {ActivatedRoute} from "@angular/router";
import {CustomerTransactionService} from "../../../services/customer-transaction.service";
import {FilterInputComponent} from "../../../../../common/src/lib/table/filter/filter-input.component";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterFloatInputComponent} from "../../../../../common/src/lib/table/filter/filter-float-input.component";
import {CustomerTransactionTableModel} from "../../../models/customer-transaction.model";
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
import {CustomerTransactionTableComponent} from "./customer-transaction-table.component";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {CustomerPermissionService} from "../../../services/customer-permission.service";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";
import {CustomerRoutingService} from "../../../services/customer-routing.service";

@Component({
  standalone: false,
  selector: 'app-customer-transactions',
  templateUrl: './customer-transaction.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './customer-transaction.component.scss']
})
export class CustomerTransactionComponent extends NbCardListPage implements OnInit, AfterViewInit {
  headers;
  filters;
  readonly Labels = CustomerTransactionLabels;
  @ViewChild('table', {static: true}) protected table: CustomerTransactionTableComponent;
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
              private customerTransactionService: CustomerTransactionService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              private customerPermissionService: CustomerPermissionService) {
    super(elementRef, routingService);
  }

  get service() {
    return this.customerTransactionService;
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers: ExtendedTableHeader[] = [];
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
    headers.push(new ExtendedTableHeader({key: 'surchargeAmount', value: this.Labels.SurchargeAmount, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'totalAmount', value: this.Labels.Total, sortProperty: 'totalAmount'}));
    headers.push(new ExtendedTableHeader({key: 'status', value: this.Labels.Status, sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'authCode', value: this.Labels.AuthCode, sortProperty: null}));
    headers.push(new ExtendedTableHeader({
      key: 'userId',
      value: this.Labels.UserId,
      sortProperty: CustomerTransactionTableComponent.USER_ID_CODE
    }));
    headers.push(new ExtendedTableHeader({key: 'userName', value: this.Labels.UserName, sortProperty: 'userName'}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(...[
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
        filterProperty: CustomerTransactionTableComponent.USER_ID_CODE,
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: this.table.userIds,
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => value
        }
      },
      {
        filterProperty: 'userName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.UserName}
      }
    ]);

    return filters;
  }

  isSuccessful(rowData: CustomerTransactionTableModel): boolean {
    return rowData.success;
  }

  getCurrencyPrefix(rowData: CustomerTransactionTableModel): string {
    return MoneyHelper.getCurrencyPrefix(rowData.currency);
  }

  get customerRoutingService(): CustomerRoutingService {
    return this.routingService as CustomerRoutingService;
  }

  goToSale(docType: DocTypeEnum, saleId: number) {
    let pageUrl;
    switch (docType) {
      case DocTypeEnum.INVOICE:
        pageUrl = this.customerRoutingService.invoicePagePath;
        break;
      case DocTypeEnum.SALES_ORDER:
        pageUrl = this.customerRoutingService.salesOrderPagePath;
        break;
      case DocTypeEnum.DEPOSIT:
        pageUrl = this.customerRoutingService.depositSalesPath;
        break;
    }
    this.customerRoutingService.getRouter().navigate([pageUrl], {
      queryParams: {
        saleId: saleId
      },
      skipLocationChange: true
    });
  }


  canGoToSale(docType: DocTypeEnum) {
    switch (docType) {
      case DocTypeEnum.INVOICE:
        return this.customerPermissionService.canViewInvoices;
      case DocTypeEnum.SALES_ORDER:
        return this.customerPermissionService.canViewSalesOrders;
      case DocTypeEnum.DEPOSIT:
        return this.customerPermissionService.canViewDeposits;
    }
  }

  protected readonly ObjectHelper = ObjectHelper;
}
