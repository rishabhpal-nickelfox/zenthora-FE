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

import {UIKeyService} from '../../../../../../services/ui-key.service';
import {UserService} from '../../../../../../services/usermanagement/user.service';
import {ExtendedTableFilter, ExtendedTableHeader} from '../../../../../../../../common/src/lib/table/table.component';
import {CompanyCurrentDataService} from '../../../../../../services/company-current-data.service';
import {FilterInputComponent} from '../../../../../../../../common/src/lib/table/filter/filter-input.component';
import {
  FilterIntegerInputComponent
} from '../../../../../../../../common/src/lib/table/filter/filter-integer-input.component';
import {UserModel} from '../../../../../models/usermanagement/user.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {finalize} from 'rxjs/operators';
import {UserTableComponent} from '../../common/user-table.component';
import {UserCompanyCreateComponent} from '../edit/user-company-create.component';
import {UserCompanyEditComponent} from '../edit/user-company-edit.component';
import {UserAlreadyExistsModalComponent} from '../../common/modal/user-already-exists-modal.component';
import {UserLabels} from '../../user-labels';
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {NbCardListPage} from "../../../../../../../../common/src/lib/pages/nb-card-list-page";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {
  BaseRoutingService,
  ROUTING_SERVICE_TOKEN
} from "../../../../../../../../common/src/lib/utils/base-routing.service";


@Component({
  standalone: false,
  selector: 'app-user-company',
  templateUrl: './user-company.component.html',
  styleUrls: ['./user-company.component.scss', '../../../../../../../../common/src/lib/table/table.component.scss']
})
export class UserCompanyComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  user = new UserModel();

  headers;
  filters;

  showCreateForm = false;
  showEditForm = false;

  readonly Labels = UserLabels;

  @ViewChild('tableElement', {static: true}) protected table: UserTableComponent;

  constructor(protected elementRef: ElementRef,
              public userService: UserService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              private currentDataService: CompanyCurrentDataService,
              private uiKeyService: UIKeyService,
              private fieldValidationErrorService: FieldValidationErrorService,
              public errorService: ErrorService,
              private ch: ChangeDetectorRef,
              private modalService: NgbModal) {
    super(elementRef, routingService);
  }

  private _createComponent;

  get createComponent(): UserCompanyCreateComponent {
    return this._createComponent;
  }

  @ViewChild(UserCompanyCreateComponent)
  set createComponent(c: UserCompanyCreateComponent) {
    this._createComponent = c;
    if (this._createComponent) {
      this._createComponent.reInit(this.user);
    }
  }

  private _editComponent;

  get editComponent(): UserCompanyEditComponent {
    return this._editComponent;
  }

  @ViewChild(UserCompanyEditComponent)
  set editComponent(c: UserCompanyEditComponent) {
    this._editComponent = c;
    if (this._editComponent) {
      this._editComponent.reInit(this.user);
    }
  }

  get maxUsersExceeded(): boolean {
    return this.table.maxUsersInCompany != 0 && this.table.totalElements >= this.table.maxUsersInCompany;
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    return [
      new ExtendedTableHeader({key: 'ID', value: this.Labels.IdHeader, sortProperty: 'id'}),
      new ExtendedTableHeader({key: 'EMAIL', value: this.Labels.EmailHeader, sortProperty: 'email'}),
      new ExtendedTableHeader({key: 'ROLES', value: this.Labels.RolesHeader, sortProperty: null}),
      new ExtendedTableHeader({key: 'ACTIONS', value: this.Labels.ActionsHeader, sortProperty: null})
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.IdHeader}
      },
      {
        filterProperty: 'email',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.EmailHeader}
      },
      {
        filterProperty: 'roles.name',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.RolesHeader}
      },
      null
    ];
  }

  onCreate() {
    if (!this.maxUsersExceeded) {
      this.onEdit(null);
    }
    return false;
  }

  onEdit(id) {
    this.table.loading = true;
    this.subscriptions.add(
      this.userService.getAdditionalInfo(id)
        .pipe(finalize(() => {
          this.table.loading = false;
          this.ch.detectChanges();
        }))
        .subscribe(data => {
        this.user = data;
        if (this.isDefined(id)) {
          this.showCreateForm = false;
          this.showEditForm = true;
        } else {
          this.showEditForm = false;
          this.showCreateForm = true;
        }
        this.ch.detectChanges();
      })
    );
  }

  onSubmit(userData) {
    this.subscriptions.add(
      this.userService.save(userData.user)
        .pipe(finalize(() => {
          if (this.isDefined(this.createComponent)) {
            this.createComponent.afterSubmit();
          }
          if (this.isDefined(this.editComponent)) {
            this.editComponent.afterSubmit();
          }
        this.ch.detectChanges();
        })).subscribe(
        data => {
          this.showCreateForm = false;
          this.showEditForm = false;
          this.table.refresh();
        },
        error => {
          if (this.ifNeedUserAlreadyExistsModal(error)) {
            this.showUserAlreadyExistsModal(userData.user, error);
          } else {
            this.fieldValidationErrorService.error(error, this.createComponent);
          }
        })
    );
  }

  ifNeedUserAlreadyExistsModal(error) {
    return this.errorService.isUserAlreadyExistsError(error);
  }

  showUserAlreadyExistsModal(user, error) {
    const modalRef = this.modalService.open(UserAlreadyExistsModalComponent, {
      windowClass: 'auto-size',
      backdrop: 'static'
    });

    modalRef.componentInstance.userEmail = user.username;
    modalRef.result.then(result => {
      this.inviteUserToCurrentCompany(user);
    }, reason => {
      this.fieldValidationErrorService.error(error, this.createComponent);
    });
  }

  inviteUserToCurrentCompany(user) {
    if (this.isDefined(this.createComponent)) {
      this.createComponent.lockSubmit();
      this.ch.detectChanges();
    }
    this.subscriptions.add(
      this.userService.sendInvitation(user)
        .pipe(finalize(() => {
          if (this.isDefined(this.createComponent)) {
            this.createComponent.afterSubmit();
          }
          this.ch.detectChanges();
        })).subscribe(
        data => {
          this.errorService.showSuccess('', this.Labels.InvitationSend);
          this.showEditForm = false;
          this.showCreateForm = false;
          this.table.refresh();
        },
        error => {
          this.fieldValidationErrorService.error(error, this.createComponent);
        })
    );
  }

  showReInvite(user) {
    const currentEntity = this.currentDataService.getCurrentEntity();
    return this.isPendingEntity(user, currentEntity ? currentEntity.id : null);
  }

  reInviteUserToCurrentCompany(user) {
    this.subscriptions.add(
      this.userService.resendInvitation(user)
        .subscribe(success => {
          this.errorService.showSuccess('', this.Labels.InvitationSend);
        }));
  }

  onUserCreateCancel() {
    this.showCreateForm = false;
  }

  onUserEditCancel() {
    this.showEditForm = false;
  }

  isCreateMode() {
    return !this.isDefined(this.user.id);
  }


  getEntities(rowData: UserModel) {
    return Array.from(rowData.rolesMap.keys()).filter(key => this.isCurrentEntity(key));
  }

  showPendingMsg(rowData: UserModel, entityId) {
    return this.isCurrentEntity(entityId) && this.isPendingEntity(rowData, entityId);
  }

  isPendingEntity(rowData: UserModel, entityId) {
    const roles: any[] = rowData.rolesMap.get(entityId) || [];
    return roles.find(role => role.pending);
  }

  isUserDataVisible(user) {
    return  Array.from(user.rolesMap.keys()).find(entityId => this.isCurrentEntity(entityId));
  }

  private isCurrentEntity(entityId) {
    const currentEntity = this.currentDataService.getCurrentEntity();
    return this.currentDataService.getCurrentEntity() ? String(entityId) === String(currentEntity.id) : false;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateForm && this.createComponent.objectChanged() || this.showEditForm && this.editComponent.objectChanged());
  }

}
