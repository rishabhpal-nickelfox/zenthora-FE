import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, ViewChild} from "@angular/core";
import {SaleComponent} from "../sale.component";
import {InvoiceService} from "../../../../services/invoice.service";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {ActivatedRoute} from "@angular/router";
import {ExtendedTableFilter, ExtendedTableHeader} from "../../../../../../common/src/lib/table/table.component";
import {DocTypeEnum} from "@eps/common";
import {InvoicePaymentComponent} from "./invoice-payment.component";
import {ObjectHelper} from "../../../../../../common/src/lib/helpers/object.helper";
import {InvoiceMultiplePaymentComponent} from "./invoice-multiple-payment.component";
import {InvoiceTableComponent} from "./invoice-table.component";
import {InvoiceTableModel} from "../../../../models/invoice.model";
import {CustomerPermissionService} from "../../../../services/customer-permission.service";
import {SelectAllComponent} from "../../../../../../common/src/lib/table/filter/select-all.component";
import {finalize, map} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SelectCurrencyModal} from "./modal/select-currency-modal.component";
import {SaleLabels} from "../sale-labels";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";
import {forkJoin} from "rxjs";
import {PaymentMethodTypeEnum} from "../../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {PaymentStatusEnum} from "../../../../../../common/src/lib/enums/sale/payment-status.enum";

@Component({
  standalone: false,
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', '../sale.component.scss']
})
export class InvoiceComponent extends SaleComponent {

  @ViewChild('table', {static: true}) protected table: InvoiceTableComponent;
  protected showMultipleSalePayment = false;
  protected readonly SaleLabels = SaleLabels;
  private selectedInvoices: InvoiceTableModel[] = [];
  private _creditCardAuthorizationMessage: string;
  private _achAuthorizationMessage: string;
  private _creditCardPaymentAmountLeft: number;
  private _selectedInvoicesLengthNotExceedsLimit = true;
  private readonly INVOICES_MAX_SIZE = 2147483647;

  constructor(protected elementRef: ElementRef,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              protected invoiceService: InvoiceService,
              protected customerPermissionService: CustomerPermissionService,
              protected modalService: NgbModal) {
    super(elementRef, errorService, routingService, alertService, router, ch);
  }

  private _invoiceMultiplePaymentComponent: InvoiceMultiplePaymentComponent;

  @ViewChild(InvoiceMultiplePaymentComponent)
  set invoiceMultiplePaymentComponent(c: InvoiceMultiplePaymentComponent) {
    this._invoiceMultiplePaymentComponent = c;
    if (this._invoiceMultiplePaymentComponent) {
      this._invoiceMultiplePaymentComponent.reInit(
        {
          invoices: this.selectedInvoices,
          invoicePartialPaymentsAllowed: this.table.invoicePartialPaymentsAllowed,
          allowedPaymentMethods: this.table.allowedPaymentMethods,
          creditCardAuthorizationMessage: this._creditCardAuthorizationMessage,
          achAuthorizationMessage: this._achAuthorizationMessage,
          globalPaymentsEnabled: this.table.globalPaymentsEnabled,
          creditCardPaymentAmountLimit: this.table.creditCardPaymentAmountLimit,
          creditCardPaymentAmountLeft: this._creditCardPaymentAmountLeft,
          surchargePercent: this.table.surchargePercent,
          surchargeProhibitedStates: this.table.surchargeProhibitedStates
        });
    }
  }

  @ViewChild(InvoicePaymentComponent)
  set saleComponent(c: InvoicePaymentComponent) {
    this._saleComponent = c;
    if (this._saleComponent) {
      this._saleComponent.reInit(this.saleModel);
    }
  }

  get service(): InvoiceService {
    return this.invoiceService;
  }

  get docType(): DocTypeEnum {
    return DocTypeEnum.INVOICE;
  }

  get showProcessPaymentButton(): boolean {
    return this.selectedInvoices.length > 0;
  }

  get isProcessPaymentButtonDisabled(): boolean {
    return this.selectedInvoicesLengthExceedsLimit;
  }

  get selectedInvoicesLengthExceedsLimit(): boolean {
    return !this._selectedInvoicesLengthNotExceedsLimit;
  }

  get showTable(): boolean {
    return !this.showSalePayment && !this.showMultipleSalePayment;
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers: ExtendedTableHeader[] = super.initHeaders();
    if (this.customerPermissionService.canProcessInvoicesPayments) {
      headers.unshift(new ExtendedTableHeader({key: 'SELECT', value: ``, sortProperty: null}));
    }
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = super.initFilters();
    if (this.customerPermissionService.canProcessInvoicesPayments) {
      filters.unshift({
        filterProperty: null,
        componentType: SelectAllComponent,
        componentParams: {onSelectAll: this.onSelectAll}
      })
    }
    return filters;

  }

  onSelectAll = (value: boolean) => {
    this.selectedInvoices.splice(0);
    if (value) {
      if (this.table.currencies.length == 1) {
        this.invoiceService.getAllWithPaging(0, this.INVOICES_MAX_SIZE, this.table.filterValues, this.table.sortProperty, this.table.sortOrder)
          .pipe(map(response => this.invoiceService.getFromResponse(response)))
          .subscribe(invoices => this.selectInvoices(invoices));
      } else {
        const selectCurrencyModalRef = this.modalService.open(SelectCurrencyModal, {backdrop: 'static'});
        selectCurrencyModalRef.componentInstance.currencies = this.table.currencies;
        selectCurrencyModalRef.result.then(currency => {

          const filters = new Map(this.table.filterValues);
          filters.set("currency", currency);

          this.subscriptions.add(this.invoiceService.getAllWithPaging(0, this.INVOICES_MAX_SIZE, filters, this.table.sortProperty, this.table.sortOrder)
            .pipe(map(response => this.invoiceService.getFromResponse(response)))
            .subscribe(invoices => this.selectInvoices(invoices)));
        }, reason => {
        });
      }

    }

    this.ch.detectChanges();
  };

  isSelected(invoice: InvoiceTableModel): boolean {
    return ObjectHelper.isDefined(this.selectedInvoices.find(i => i.id == invoice.id));
  }

  isCancelled(invoice: InvoiceTableModel): boolean {
    return invoice.paymentStatus == PaymentStatusEnum.CANCELLED;
  }

  canSelect(invoice: InvoiceTableModel): boolean {
    return !this.isCancelled(invoice) && (this.selectedInvoices.length == 0 || this.selectedInvoices[0].currency == invoice.currency);
  }

  onSelectionChange(value, invoice: InvoiceTableModel) {
    if (value && !this.isSelected(invoice) && this.canSelect(invoice)) {
      this.selectInvoice(invoice);
    } else if (!value && this.isSelected(invoice)) {
      this.unSelectInvoice(invoice)
    }
    this.ch.detectChanges();
  }

  onProcessPayment() {
    if (this.isProcessPaymentButtonDisabled) {
      return;
    }
    this.table.loading = true;
    this.subscriptions.add(
      this.invoiceService.getMultiplePaymentInfo(this.selectedInvoices.map(invoice => invoice.id))
        .pipe(finalize(() => {
          this.table.loading = false;
          this.ch.detectChanges();
        }))
        .pipe(map(response => {
          this.selectedInvoices = response.invoices;
          this._creditCardAuthorizationMessage = response.creditCardAuthorizationMessage;
          this._achAuthorizationMessage = response.achAuthorizationMessage;
          this._creditCardPaymentAmountLeft = response.creditCardPaymentAmountLeft;
          this.showMultipleSalePayment = true;
        })).subscribe()
    );
  }

  reInit() {
    this.showMultipleSalePayment = false;
    this._creditCardAuthorizationMessage = null;
    this._achAuthorizationMessage = null;
    this._creditCardPaymentAmountLeft = null;
    this.clearSelection();
    super.reInit();
  }

  onMultipleCancel() {
    this.showMultipleSalePayment = false;
    this._creditCardAuthorizationMessage = null;
    this._achAuthorizationMessage = null;
    this._creditCardPaymentAmountLeft = null;
    this.clearSelection();
    this.table.refresh();
  }

  onMultipleGoBackToInvoiceList() {
    this.showMultipleSalePayment = false;
    this._creditCardAuthorizationMessage = null;
    this._achAuthorizationMessage = null;
    this._creditCardPaymentAmountLeft = null;
    this.table.refresh();
  }

  private selectInvoices(invoices: InvoiceTableModel[]) {
    this.selectedInvoices.push(...invoices.filter(invoice => !this.isCancelled(invoice)));
    this.updateSelectedInvoicesLengthNotExceedLimit();
    this.ch.detectChanges();
  }

  private selectInvoice(invoice: InvoiceTableModel) {
    this.selectedInvoices.push(invoice);
    this.updateSelectedInvoicesLengthNotExceedLimit();
  }

  private unSelectInvoice(invoice: InvoiceTableModel) {
    const indexToRemove = this.selectedInvoices.findIndex(i => i.id == invoice.id);
    this.selectedInvoices.splice(indexToRemove, 1);
    this.updateSelectedInvoicesLengthNotExceedLimit();
  }

  private clearSelection() {
    this.selectedInvoices.splice(0);
    this._selectedInvoicesLengthNotExceedsLimit = true;
  }

  private updateSelectedInvoicesLengthNotExceedLimit() {
    this._selectedInvoicesLengthNotExceedsLimit = ObjectHelper.isDefined(this.table.invoiceNumberStringMaxLength) ? this.selectedInvoices.map(invoice => invoice.docNumber).join("|").length <= this.table.invoiceNumberStringMaxLength : true;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return super.canDeactivate() && this.selectedInvoices.length == 0;
  }

}
