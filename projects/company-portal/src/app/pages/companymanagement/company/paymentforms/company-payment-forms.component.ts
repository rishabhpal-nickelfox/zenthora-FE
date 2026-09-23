import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {catchError, finalize, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {NbCardListPage} from '../../../../../../../common/src/lib/pages/nb-card-list-page';
import {
  ExtendedTableFilter,
  ExtendedTableHeader
} from '../../../../../../../common/src/lib/table/table.component';
import {FilterIntegerInputComponent} from '../../../../../../../common/src/lib/table/filter/filter-integer-input.component';
import {FilterInputComponent} from '../../../../../../../common/src/lib/table/filter/filter-input.component';
import {TableViewSettingsService} from '../../../../../../../common/src/lib/utils/table-view-settings.service';
import {CompanyTableViewSettingsService} from '../../../../../services/company-table-view-settings.service';
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from '../../../../../../../common/src/lib/utils/base-routing.service';
import {PaymentFormService} from '../../../../../services/companymanagement/payment-form.service';
import {CompanyPaymentFormsLabels} from './company-payment-forms-labels';
import {ComponentCanDeactivate} from '../../../../../../../common/src/lib/pages/can-deactivate.component';
import {
  FieldValidationErrorService
} from '../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service';
import {PaymentFormModel} from '../../../../models/companymanage/payment-form.model';
import {
  CompanyPaymentFormCreateEditComponent,
  PaymentFormCreateEditData
} from './company-payment-form-create-edit.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmModalComponent} from '../../../../../../../common/src/lib/modals/confirm/confirm-modal.component';
import {CompanyPaymentFormsTableComponent} from './company-payment-forms-table.component';

@Component({
  standalone: false,
  selector: 'app-company-payment-forms',
  templateUrl: './company-payment-forms.component.html',
  styleUrls: ['../../../../../../../common/src/lib/table/table.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class CompanyPaymentFormsComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  headers;
  filters;
  showCreateEditForm = false;
  showInactive = false;
  readonly Labels = CompanyPaymentFormsLabels;
  @ViewChild('table', {static: true}) protected table: CompanyPaymentFormsTableComponent;
  @ViewChild(CompanyPaymentFormCreateEditComponent) protected editComponent: CompanyPaymentFormCreateEditComponent;
  private paymentForm = new PaymentFormModel();

  constructor(protected elementRef: ElementRef,
              protected service: PaymentFormService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              private fieldValidationErrorService: FieldValidationErrorService,
              private modalService: NgbModal,
              protected ch: ChangeDetectorRef) {
    super(elementRef, routingService);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateEditForm && this.editComponent.objectChanged());
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    this.hideInactiveForms();
  }

  initHeaders(): ExtendedTableHeader[] {
    return [
      new ExtendedTableHeader({key: 'id', value: this.Labels.ID, sortProperty: 'id'}),
      new ExtendedTableHeader({key: 'name', value: this.Labels.Name, sortProperty: 'name'}),
      new ExtendedTableHeader({
        key: 'paymentFormCode',
        value: this.Labels.PaymentFormCode,
        sortProperty: 'paymentFormCode'
      }),
      new ExtendedTableHeader({key: '', value: '', sortProperty: null, collapsible: false})
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.ID}
      },
      {
        filterProperty: 'name',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.Name}
      },
      {
        filterProperty: 'paymentFormCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.PaymentFormCode}
      },
      null
    ];
  }

  get canCreate(): boolean {
    return !!this.table.paymentFormsCompanyId && !!this.table.paymentFormsUrl;
  }

  onCreate() {
    if (!this.canCreate) {
      return;
    }
    this.paymentForm = new PaymentFormModel();
    this.showCreateEditForm = true;
    this.ch.detectChanges();
    this.editComponent.reInit(this.getCreateEditData(this.paymentForm));
  }

  onEdit(paymentForm: PaymentFormModel) {
    this.subscriptions.add(
      this.service.get(paymentForm.id)
        .pipe(map(result => {
          result.id = paymentForm.id;
          result.disabled = paymentForm.disabled;
          this.openEditForm(result);
        }))
        .subscribe()
    );
  }

  private openEditForm(paymentForm: PaymentFormModel) {
    this.paymentForm = paymentForm;
    this.showCreateEditForm = true;
    this.ch.detectChanges();
    this.editComponent.reInit(this.getCreateEditData(this.paymentForm));
  }

  private getCreateEditData(paymentForm: PaymentFormModel): PaymentFormCreateEditData {
    return {
      paymentForm,
      paymentFormsCompanyId: this.table.paymentFormsCompanyId,
      paymentFormsUrl: this.table.paymentFormsUrl,
      paymentFormsCompanyLogo: this.table.logo,
      paymentFormsCompanyLogoContentType: this.table.logoContentType
    };
  }

  onPaymentFormSaved(paymentForm: PaymentFormModel) {
    this.subscriptions.add(
      this.service.save(paymentForm)
        .pipe(finalize(() => this.editComponent.afterSubmit()))
        .pipe(map(() => {
          this.showCreateEditForm = false;
          this.table.refresh();
        }))
        .pipe(catchError(error => {
          this.fieldValidationErrorService.error(error, this.editComponent);
          return throwError(error);
        }))
        .subscribe()
    );
  }

  onEditCancel() {
    this.showCreateEditForm = false;
  }

  onShowInactive() {
    this.showInactive = !this.showInactive;
    if (this.showInactive) {
      this.table.removeStaticFilter('hideInactive');
    } else {
      this.hideInactiveForms();
    }
    this.table.refresh();
  }

  private hideInactiveForms() {
    this.table.setStaticFilter('hideInactive', 'true');
  }

  onActivateDeactivate(paymentForm: PaymentFormModel, activate: boolean) {
    const action = activate ? this.Labels.Activate : this.Labels.Deactivate;
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.ActivateDeactivateHeader(action);
    modalRef.componentInstance.body = this.Labels.ActivateDeactivateMessage(action);
    modalRef.componentInstance.okButtonText = this.Labels.ActivateDeactivateConfirm(action);
    modalRef.componentInstance.cancelButtonText = this.Labels.ActivateDeactivateCancel;
    modalRef.result.then(result => {
      const request = activate ? this.service.activate(paymentForm.id) : this.service.deactivate(paymentForm.id);
      this.subscriptions.add(request.subscribe(() => {
        this.table.refresh();
      }));
    }, reason => {
    });
  }
}
