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
import {UserSystemCreateEditComponent} from '../edit/user-system-create-edit.component';
import {UserModel} from '../../../../../models/usermanagement/user.model';
import {UserTableComponent} from '../../common/user-table.component';
import {UserService} from '../../../../../../services/usermanagement/user.service';
import {UIKeyService} from '../../../../../../services/ui-key.service';
import {ExtendedTableFilter, ExtendedTableHeader} from '../../../../../../../../common/src/lib/table/table.component';
import {
  FilterIntegerInputComponent
} from '../../../../../../../../common/src/lib/table/filter/filter-integer-input.component';
import {FilterInputComponent} from '../../../../../../../../common/src/lib/table/filter/filter-input.component';
import {CompanyCurrentDataService} from '../../../../../../services/company-current-data.service';
import {finalize} from 'rxjs/operators';
import {ConfirmModalComponent} from '../../../../../../../../common/src/lib/modals/confirm/confirm-modal.component';
import {UserLabels} from '../../user-labels';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {NbCardListPage} from "../../../../../../../../common/src/lib/pages/nb-card-list-page";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {Observable} from "rxjs";
import {
  BaseRoutingService,
  ROUTING_SERVICE_TOKEN
} from "../../../../../../../../common/src/lib/utils/base-routing.service";


@Component({
  standalone: false,
  selector: 'app-user-system',
  templateUrl: './user-system.component.html',
  styleUrls: ['./user-system.component.scss', '../../../../../../../../common/src/lib/table/table.component.scss']
})
export class UserSystemComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  user = new UserModel();

  headers;
  filters;

  showCreateEditForm = false;
  hideInactive: boolean;

  @ViewChild('table', {static: true}) protected table: UserTableComponent;

  readonly Labels = UserLabels;

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

  private _createEditComponent;

  get createEditComponent(): UserSystemCreateEditComponent {
    return this._createEditComponent;
  }

  @ViewChild(UserSystemCreateEditComponent)
  set createEditComponent(c: UserSystemCreateEditComponent) {
    this._createEditComponent = c;
    if (this._createEditComponent) {
      this._createEditComponent.reInit(this.user);
    }
  }

  ngOnInit() {
    this.reInit();
  }

  reInit() {
    this.showCreateEditForm = false;
    this.hideInactive = true;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    this.table.setStaticFilter('hideInactive', 'true');
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
    this.onEdit(null);
  }

  onEdit(id) {
    this.subscriptions.add(
      this.userService.getAdditionalInfo(id).subscribe(data => {
        this.user = data;
        this.showCreateEditForm = true;
        this.ch.detectChanges();
      })
    );
  }

  onSubmit(userData) {
    this.subscriptions.add(
      this.userService.save(userData.user, userData.resetPassword, userData.mustChangePassword)
        .pipe(finalize(() => {
          this.createEditComponent.afterSubmit();
          this.ch.detectChanges();
        })).subscribe(
        data => {
          this.showCreateEditForm = false;
          this.table.refresh();
        },
        error => {
          this.fieldValidationErrorService.error(error, this.createEditComponent);
        })
    );
  }

  onUserEditCancel() {
    this.showCreateEditForm = false;
  }

  isCreateMode() {
    return !this.isDefined(this.user.id);
  }

  getEntities(rowData: UserModel) {
    return Array.from(rowData.rolesMap.keys());
  }

  canDisableEnable(user) {
    return this.uiKeyService.isSystemUserAdmin() && user.username != this.currentDataService.getCurrentUser().username;
  }


  private showDisableEnableDialog(user: UserModel, enable: boolean) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});

    const action: string = enable ? this.Labels.Enable : this.Labels.Disable;

    modalRef.componentInstance.header = this.Labels.EnableDisableHeader(action);
    modalRef.componentInstance.body = this.Labels.EnableDisableMessage(action, user.email);
    modalRef.componentInstance.okButtonText = this.Labels.EnableDisableConfirm(action);
    modalRef.componentInstance.cancelButtonText = this.Labels.EnableDisableCancel;

    modalRef.result.then(() => {
      this.subscriptions.add(
        (enable ? this.userService.enable(user.id) : this.userService.disable(user.id))
          .pipe(finalize(() => this.ch.detectChanges()))
          .subscribe(success => {
            user.disabled = !enable;
            this.errorService.alertService.showSuccess('', this.Labels.EnabledDisabled(enable));
          }, error => {
            user.disabled = enable;
          }));
    }, reason => {
    });
    return false;
  }


  onDisable(user: UserModel) {
    this.showDisableEnableDialog(user, false);
  }

  onEnable(user) {
    this.showDisableEnableDialog(user, true);
  }

  private isCurrentEntity(entityId) {
    const currentEntity = this.currentDataService.getCurrentEntity();
    return this.currentDataService.getCurrentEntity() ? String(entityId) === String(currentEntity.id) : false;
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
    return !(this.showCreateEditForm && this.createEditComponent.objectChanged());
  }

}
