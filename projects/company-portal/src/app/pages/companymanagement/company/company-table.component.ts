import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {CompanyManageCreateEditEntityComponent} from './company-create-edit.component';
import {EntityService} from '../../../../services/companymanagement/entity.service';
import {EntityModel} from '../../../models/companymanage/entity.model';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../../common/src/lib/table/table.component';
import {
  FilterIntegerInputComponent
} from '../../../../../../common/src/lib/table/filter/filter-integer-input.component';
import {FilterInputComponent} from '../../../../../../common/src/lib/table/filter/filter-input.component';
import {UIKeyService} from "../../../../services/ui-key.service";
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import * as hermes from '../../../../../../common/src/assets/hermes/hermes.min';
import {FormBuilder} from "@angular/forms";
import {ConfirmModalComponent} from "../../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HermesEnum} from "../../../../../../common/src/lib/enums/utils/hermes.enum";
import {
  FieldValidationErrorService
} from "../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {finalize} from "rxjs/operators";
import {VaultErrorService} from "../../../../../../common/src/lib/utils/errorhandler/vault-error.service";
import {CompanyLabels} from "./company-labels";
import {NbCardListPage} from "../../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../services/company-table-view-settings.service";
import {ComponentCanDeactivate} from "../../../../../../common/src/lib/pages/can-deactivate.component";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-companymanage',
  templateUrl: './company-table.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', './company-table.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class CompanyTableComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {

  headers;
  filters;
  showCreateEditForm = false;
  @ViewChildren(CompanyManageCreateEditEntityComponent) editComponents: QueryList<CompanyManageCreateEditEntityComponent>;
  hideTrustedPlatforms: boolean;
  hideInactive: boolean;
  @ViewChild('table', {static: true}) protected table: TableComponent;
  private entity;

  readonly Labels = CompanyLabels;

  constructor(protected elementRef: ElementRef, protected _fb: FormBuilder, private entityService: EntityService, private vaultErrorService: VaultErrorService, private fieldValidationErrorService: FieldValidationErrorService, @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, protected uiKeyService: UIKeyService, protected alertService: AlertService, private ch: ChangeDetectorRef, protected modalService: NgbModal) {
    super(elementRef, routingService);
  }

  get entityCreateEditComponent() {
    return this.editComponents.first;
  }

  get service() {
    return this.entityService;
  }

  ngOnInit() {
    this.reInit();
  }

  onHideTrustedPlatforms() {
    this.hideTrustedPlatforms = !this.hideTrustedPlatforms;
    if (this.hideTrustedPlatforms) {
      this.table.setStaticFilter('hideTrustedPlatforms', 'true');
    } else {
      this.table.removeStaticFilter('hideTrustedPlatforms');
    }
    this.table.refresh();
  }

  onHideInactive(){
    this.hideInactive = !this.hideInactive;
    if (this.hideInactive) {
      this.table.setStaticFilter('hideInactive', 'true');
    } else {
      this.table.removeStaticFilter('hideInactive');
    }
    this.table.refresh();
  }

  initHeaders(): ExtendedTableHeader[] {
    return [
      new ExtendedTableHeader({
        key: 'ID',
        value: this.Labels.Id,
        sortProperty: 'id'
      }),
      new ExtendedTableHeader({
        key: 'VAULT_COMPANY_ID',
        value: this.Labels.VaultCompanyID,
        sortProperty: 'vaultCompanyId'
      }),
      new ExtendedTableHeader({
        key: 'PLATFORM_ID',
        value: this.Labels.PlatformId,
        sortProperty: 'platformId'
      }),
      new ExtendedTableHeader({
        key: 'PLATFORM_NAME',
        value: this.Labels.PlatformName,
        sortProperty: 'platformName'
      }),
      new ExtendedTableHeader({
        key: 'LEGAL_NAME',
        value: this.Labels.LegalName,
        sortProperty: 'legalName'
      }),
      new ExtendedTableHeader({
        key: 'ADMINISTRATORS',
        value: this.Labels.Administrators,
        sortProperty: null
      }),
      new ExtendedTableHeader({
        key: 'ACTIVE_USERS',
        value: this.Labels.ActiveUsers,
        sortProperty: null
      }),
      new ExtendedTableHeader({
        key: 'ACTIVE_TOKENS',
        value: this.Labels.ActiveTokens,
        sortProperty: null
      }),
      new ExtendedTableHeader({
        key: 'EXTERNAL_ID',
        value: this.Labels.ExternalId,
        sortProperty: 'externalId'
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
        componentParams: {placeholder: this.Labels.Id}
      },
      {
        filterProperty: 'vaultCompanyId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.VaultCompanyID}
      },
      {
        filterProperty: 'platformId',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.PlatformId}
      },
      {
        filterProperty: 'platformName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.PlatformName}
      },
      {
        filterProperty: 'legalName',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.LegalName}
      },
      {
        filterProperty: 'admins.email',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.Administrators}
      },
      null,
      null,
      {
        filterProperty: 'externalId',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.ExternalId}
      },
      null];
  }

  onEntitySaved(model) {
    this.subscriptions.add(this.entityService.save(model.entity, model.administrator).pipe(finalize(() => {
      this.entityCreateEditComponent.afterSubmit();
    })).subscribe(data => {
      this.table.refresh();
      this.showCreateEditForm = false;
    }, error => {
      this.fieldValidationErrorService.error(error, this.entityCreateEditComponent);
    }));
  }

  onEntityEditCancel(event) {
    this.showCreateEditForm = false;
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.subscriptions.add(this.editComponents.changes.subscribe((comps: QueryList<CompanyManageCreateEditEntityComponent>) => {
      if (comps.first) {
        comps.first.reInit(this.entity);
        this.ch.detectChanges();
      }
    }));
  }

  showDisableEnable(entity) {
    return this.uiKeyService.isSystemCompaniesAdmin();
  }

  onShowEnableDialog(entity) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.EnableCompanyHeader;
    modalRef.componentInstance.body = this.Labels.EnableCompanyBody(entity.legalName);
    modalRef.componentInstance.okButtonText = this.Labels.Ok;
    modalRef.result.then(result => {
      this.subscriptions.add(this.entityService.enable(entity.id).subscribe(success => {
        entity.disabled = false;
        this.alertService.showSuccess('', this.Labels.EnableCompanyFinished);
        hermes.send(HermesEnum.COMPANY_ENABLE_DISABLE, true, true);
      }, error => {
        entity.disabled = true;
      }));
    }, reason => {
    });
  }

  onShowDisableDialog(entity) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.DisableCompanyHeader;
    modalRef.componentInstance.body = this.Labels.DisableCompanyBody(entity.legalName);
    modalRef.componentInstance.okButtonText = this.Labels.Ok;
    modalRef.result.then(result => {
      this.subscriptions.add(this.entityService.disable(entity.id).subscribe(success => {
        entity.disabled = true;
        this.alertService.showSuccess('', this.Labels.DisableCompanyFinished);
        hermes.send(HermesEnum.COMPANY_ENABLE_DISABLE, false, true);
      }, error => {
        entity.disabled = false;
      }));
    }, reason => {
    });
  }

  onCreate() {
    this.entity = new EntityModel();
    this.editComponents.notifyOnChanges();
    this.showCreateEditForm = true;
  }

  onEdit(entity) {
    this.subscriptions.add(this.entityService.getAdditionalInfo(entity.id).subscribe(data => {
      this.entity = data;
      this.entity.id = entity.id;
      this.editComponents.notifyOnChanges();
      this.showCreateEditForm = true;
    }, error => {
      this.fieldValidationErrorService.error(error, this.entityCreateEditComponent);
    }));
  }

  reInit() {
    this.hideTrustedPlatforms = false;
    this.hideInactive = true;
    this.entity = new EntityModel();
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    this.table.setStaticFilter('hideInactive', 'true');
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !(this.showCreateEditForm && this.entityCreateEditComponent.objectChanged());
  }


}
