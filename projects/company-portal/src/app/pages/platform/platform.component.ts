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
import {PlatformCreateEditEntityComponent} from './platform-create-edit.component';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../common/src/lib/table/table.component';
import {FilterInputComponent} from '../../../../../common/src/lib/table/filter/filter-input.component';
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {PlatformService} from "../../../services/platform/platform.service";
import {PlatformModel} from "../../models/platform/platform.model";
import {PlatformUiKeyService} from "../../../services/platform/platform-ui-key.service";
import {ConfirmModalComponent} from "../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {catchError, finalize, map} from "rxjs/operators";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../services/company-table-view-settings.service";
import {ComponentCanDeactivate} from "../../../../../common/src/lib/pages/can-deactivate.component";
import {Observable, throwError} from "rxjs";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {PlatformLabels} from './platform-labels';

@Component({
  standalone: false,
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './platform.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class PlatformComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  headers;
  filters;
  showCreateEditForm = false;
  @ViewChild('table', {static: true}) protected table: TableComponent;
  protected readonly Labels = PlatformLabels;
  private platform;
  hideInactive: boolean;

  constructor(protected elementRef: ElementRef, private platformService: PlatformService, public errorService: ErrorService, public fieldValidationErrorService: FieldValidationErrorService, @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, protected platformUiKeyService: PlatformUiKeyService, protected alertService: AlertService, private ch: ChangeDetectorRef, protected modalService: NgbModal) {
    super(elementRef, routingService);
  }

  private _editComponent: PlatformCreateEditEntityComponent;

  get editComponent(): PlatformCreateEditEntityComponent {
    return this._editComponent;
  }

  @ViewChild(PlatformCreateEditEntityComponent)
  set editComponent(c: PlatformCreateEditEntityComponent) {
    this._editComponent = c;
    if (this._editComponent) {
      this._editComponent.reInit(this.platform);
    }
  }

  get service() {
    return this.platformService;
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.platform = new PlatformModel();
    this.platform.trusted = false;
    this.platform.epsCheckout = false;

    this.hideInactive = true;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    this.table.setStaticFilter('hideInactive', 'true');
  }

  initHeaders(): ExtendedTableHeader[] {
    return [
      new ExtendedTableHeader({key: 'ID', value: 'ID', sortProperty: 'id'}),
      new ExtendedTableHeader({
        key: 'NAME',
        value: 'Platform',
        sortProperty: 'name'
      }), new ExtendedTableHeader({
        key: 'TRUSTED',
        value: 'Trusted',
        sortProperty: 'trusted'
      }),
      new ExtendedTableHeader({
        key: 'EPS_CHECKOUT',
        value: 'EPS checkout',
        sortProperty: 'epsCheckout'
      }),
      new ExtendedTableHeader({
        key: 'COMPANIES',
        value: '# Companies',
        sortProperty: null
      }),
      new ExtendedTableHeader({
        key: '',
        value: '',
        sortProperty: null
      })
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: "ID"}
      },
      {
        filterProperty: 'name',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Platform'}
      },
      null,
      null,
      null,
      null
    ];
  }

  onCreate() {
    this.platform = new PlatformModel();
    this.platform.trusted = false;
    this.platform.epsCheckout = false;
    this.showCreateEditForm = true;
    this.ch.detectChanges();
  }

  onEdit(platform) {
    this.platform = platform;
    this.showCreateEditForm = true;
    this.ch.detectChanges();
  }

  onPlatformSaved(platform) {
    this.subscriptions.add(this.platformService.save(platform).pipe(finalize(() =>
      this.editComponent.afterSubmit()))
      .pipe(map(() => {
        this.showCreateEditForm = false;
        this.table.refresh();
      }))
      .pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this.editComponent);
        return throwError(error);
      })).subscribe());

  }

  onPlatformEditCancel(event) {
    this.showCreateEditForm = false;
  }

  onShowEnableDialog(platform: PlatformModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.EnablePlatformHeader;
    modalRef.componentInstance.body = this.Labels.EnablePlatformBody(platform.name);
    modalRef.componentInstance.okButtonText = this.Labels.Ok;
    modalRef.componentInstance.cancelButtonText = this.Labels.Cancel;
    modalRef.result.then(result => {
      this.subscriptions.add(this.platformService.enable(platform.id).subscribe(success => {
        platform.disabled = false;
        this.alertService.showSuccess('', this.Labels.EnablePlatformFinished);
      }, error => {
        platform.disabled = true;
      }));
    }, reason => {
    });
  }

  onShowDisableDialog(platform: PlatformModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.DisablePlatformHeader;
    modalRef.componentInstance.body = this.Labels.DisablePlatformBody(platform.name);
    modalRef.componentInstance.okButtonText = this.Labels.Ok;
    modalRef.componentInstance.cancelButtonText = this.Labels.Cancel;
    modalRef.result.then(result => {
      this.subscriptions.add(this.platformService.disable(platform.id).subscribe(success => {
        platform.disabled = true;
        this.alertService.showSuccess('', this.Labels.DisablePlatformFinished);
      }, error => {
        platform.disabled = false;
      }));
    }, reason => {
    });
  }

  onShowDeleteDialog(platform: PlatformModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.DeletePlatformHeader;
    modalRef.componentInstance.body = this.Labels.DeletePlatformBody(platform.name);
    modalRef.componentInstance.okButtonText = this.Labels.Ok;
    modalRef.componentInstance.cancelButtonText = this.Labels.Cancel;
    modalRef.result.then(result => {
      this.subscriptions.add(this.platformService.delete(platform.id).subscribe(success => {
        this.table.refresh();
        this.alertService.showSuccess('', this.Labels.DeletePlatformFinished);
      }));
    }, reason => {
    });
  }

  onHideInactive() {
    this.hideInactive = !this.hideInactive;
    if (this.hideInactive) {
      this.table.setStaticFilter('hideInactive', 'true');
    } else {
      this.table.removeStaticFilter('hideInactive');
    }
    this.table.refresh();
  }


  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateEditForm && this.editComponent.objectChanged());
  }
}
