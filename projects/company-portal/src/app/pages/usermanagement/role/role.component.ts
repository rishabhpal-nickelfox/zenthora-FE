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
import {RoleCreateEditComponent} from './role-create-edit.component';
import {RolePermissionService} from '../../../../services/usermanagement/role-permission.service';
import {RoleModel} from '../../../models/usermanagement/role.model';
import {CompanyCurrentDataService} from '../../../../services/company-current-data.service';
import {
  ExtendedTableFilter,
  ExtendedTableHeader,
  TableComponent
} from '../../../../../../common/src/lib/table/table.component';
import {
  FilterIntegerInputComponent
} from '../../../../../../common/src/lib/table/filter/filter-integer-input.component';
import {FilterInputComponent} from '../../../../../../common/src/lib/table/filter/filter-input.component';
import {ConfirmModalComponent} from "../../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  FieldValidationErrorService
} from "../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {PermissionModel} from "../../../models/usermanagement/permission.model";
import {catchError, finalize, map} from "rxjs/operators";
import {NbCardListPage} from "../../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../services/company-table-view-settings.service";
import {AuthenticationService} from "../../../../services/authentication.service";
import {Observable, throwError} from "rxjs";
import {ComponentCanDeactivate} from "../../../../../../common/src/lib/pages/can-deactivate.component";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-rolemanage',
  templateUrl: './role.component.html',
  styleUrls: ['../../../../../../common/src/lib/table/table.component.scss', './role.component.scss'],
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class RoleComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {

  headers;
  filters;
  showCreateEditForm = false;
  @ViewChild('table', {static: true}) protected table: TableComponent;
  private entity;
  private role;
  private entityPermissions: PermissionModel[] = [];

  constructor(protected elementRef: ElementRef,
              private currentDataService: CompanyCurrentDataService,
              private fieldValidationErrorService: FieldValidationErrorService,
              public rolePermissionService: RolePermissionService,
              private ch: ChangeDetectorRef,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected modalService: NgbModal,
              protected companyUserAuthService: AuthenticationService) {
    super(elementRef, routingService);
  }

  private _editComponent;

  get editComponent(): RoleCreateEditComponent {
    return this._editComponent;
  }

  @ViewChild(RoleCreateEditComponent)
  set editComponent(c: RoleCreateEditComponent) {
    this._editComponent = c;
    if (this._editComponent) {
      this._editComponent.reInit({role: this.role, entityPermissions: this.entityPermissions});
    }
  }

  get newRole() {
    const role = new RoleModel();
    role.entity = this.entity;
    return role;
  }

  get service() {
    return this.rolePermissionService;
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.entity = this.currentDataService.getCurrentUser().currentRole.entity;
    this.role = this.newRole;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  onCreate() {
    this.onCreateOrEdit(this.newRole);
  }

  onEdit(row) {
    this.onCreateOrEdit(row);
  }

  private onCreateOrEdit(role) {
    this.role = role;
    this.subscriptions.add(
      this.rolePermissionService.getAllPermissionsForEntity(this.role.entity).subscribe(
        data => {
          this.entityPermissions = data;
          this.showCreateEditForm = true;
          this.ch.detectChanges();
        }
      )
    );
  }

  onDelete(role: RoleModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.header = 'Delete Role';
    modalRef.componentInstance.body = 'Are you sure you want to delete the Role ' + role.name + '?';
    modalRef.componentInstance.okButtonText = 'Yes, delete';

    modalRef.result.then(() => {
      this.subscriptions.add(
        this.rolePermissionService.delete(role).subscribe(
          data => {
            this.table.refresh();
          })
      );
    }, reason => {
    });
    return false;
  }

  onRoleSaved(role) {
    this.subscriptions.add(
      this.rolePermissionService.save(role)
        .pipe(finalize(() => {
          this.editComponent.afterSubmit();
        }))
        .pipe(map(data => {
          this.showCreateEditForm = false;
          if (role.id == this.currentDataService.getCurrentUser().currentRole.id) {
            this.companyUserAuthService.updateCurrentPermissions();
          }
          this.table.refresh();
        }))
        .pipe(catchError(error => {
          this.fieldValidationErrorService.error(error, this.editComponent);
          return throwError(error);
        })).subscribe()
    );
  }

  onRoleCancel() {
    this.showCreateEditForm = false;
  }

  initHeaders(): ExtendedTableHeader[] {
    return [
      new ExtendedTableHeader({key: 'ID', value: 'ID', sortProperty: 'id'}),
      new ExtendedTableHeader({key: 'ROLE', value: 'Role', sortProperty: 'name'}),
      new ExtendedTableHeader({key: 'ACTIONS', value: 'Actions', sortProperty: null})
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'ID'}
      },
      {
        filterProperty: 'name',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Role'}
      },
      null
    ];
  }


  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateEditForm && this.editComponent.objectChanged());
  }
}
