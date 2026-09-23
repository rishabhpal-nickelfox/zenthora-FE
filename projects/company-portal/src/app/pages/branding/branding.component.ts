import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {catchError, finalize, map, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {ComponentCanDeactivate} from "../../../../../common/src/lib/pages/can-deactivate.component";
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from "../../../../../common/src/lib/table/table.component";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";
import {BrandingCreateEditComponent} from "./branding-create-edit.component";
import {SendgridSettingsModel} from "../../models/sendgrid/sendgrid-settings.model";
import {ConfirmModalComponent} from "../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BrandingLabels} from "./branding-labels";
import {BrandingService} from "../../../services/branding/branding.service";
import {BrandingModel} from "../../models/branding/branding.model";

@Component({
  standalone: false,
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './branding.component.scss'],
  providers: [{
    provide: TableViewSettingsService, useClass: CompanyTableViewSettingsService, multi: false
  }]
})
export class BrandingComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  headers;
  filters;
  showCreateEditForm = false;
  @ViewChild('table', {static: true}) protected table: TableComponent;
  protected Labels = BrandingLabels;
  private branding: BrandingModel;

  constructor(protected elementRef: ElementRef, protected service: BrandingService, public errorService: ErrorService, public fieldValidationErrorService: FieldValidationErrorService, @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, private ch: ChangeDetectorRef, private modalService: NgbModal) {
    super(elementRef, routingService);
  }

  private _editComponent: BrandingCreateEditComponent;

  get editComponent(): BrandingCreateEditComponent {
    return this._editComponent;
  }

  @ViewChild(BrandingCreateEditComponent) set editComponent(c: BrandingCreateEditComponent) {
    this._editComponent = c;
    if (this._editComponent) {
      this._editComponent.reInit(this.branding);
    }
  }


  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    return [new ExtendedTableHeader({key: 'ID', value: 'ID', sortProperty: 'id'}), new ExtendedTableHeader({
      key: 'NAME', value: 'Name', sortProperty: 'name'
    }), new ExtendedTableHeader({
      key: 'COMPANY_PORTAL_URL', value: 'Company Portal URL'
    }), new ExtendedTableHeader({
      key: 'CUSTOMER_PORTAL_URL', value: 'Customer Portal URL'
    }), new ExtendedTableHeader({
      key: 'PAYMENT_FORMS_URL', value: 'Payment Forms URL'
    }), new ExtendedTableHeader({
      key: 'SALE_FROM', value: 'Sale From'
    }), new ExtendedTableHeader({
      key: 'RECEIPT_FROM', value: 'Receipt From'
    }), new ExtendedTableHeader({
      key: 'EMAIL_FROM', value: 'Email From'
    }), new ExtendedTableHeader({
      key: 'PRODUCT_NAME', value: 'Product Name'
    }), new ExtendedTableHeader({
      key: 'SUPPORT_PHONE', value: 'Support Phone'
    }), new ExtendedTableHeader({
      key: 'SUPPORT_EMAIL', value: 'Support Email'
    }), new ExtendedTableHeader({
      key: '', value: '', sortProperty: null
    })];
  }

  initFilters(): ExtendedTableFilter[] {
    return [];
  }

  onCreate() {
    this.branding = new BrandingModel();
    this.showCreateEditForm = true;
    this.ch.detectChanges();
  }

  onEdit(brandingModel: BrandingModel) {
    this.branding = brandingModel;
    this.showCreateEditForm = true;
  }

  onBrandingSaved(brandingModel: BrandingModel) {
    this.subscriptions.add(this.service.save(brandingModel).pipe(finalize(() => this.editComponent.afterSubmit()))
      .pipe(map(() => {
        this.showCreateEditForm = false;
        this.table.refresh();
      }))
      .pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this.editComponent);
        return throwError(error);
      })).subscribe());

  }

  onBrandingEditCanceled() {
    this.showCreateEditForm = false;
  }


  @HostListener('window:beforeunload') canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateEditForm && this.editComponent.objectChanged());
  }


  onDisable(sendgridSettings: SendgridSettingsModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.DisableHeader;
    modalRef.componentInstance.body = `Are you sure you want to disable the Branding ${sendgridSettings.name}?`;
    modalRef.componentInstance.okButtonText = 'Yes';
    modalRef.result.then(result => {
      this.subscriptions.add(this.service.disable(sendgridSettings.id)
        .pipe(tap(() => {
          sendgridSettings.disabled = true;
          this.errorService.showSuccess('', 'Branding disabled');
        })).subscribe());
    }, reason => {
    });
  }

  onEnable(branding: BrandingModel) {
    this.service.enable(branding.id).pipe(tap(() => {
      branding.disabled = false;
      this.errorService.showSuccess('', 'Branding enabled');
    })).subscribe();
  }

  canEnableDisable(branding: BrandingModel): boolean {
    return !branding.isDefault
  }
}
