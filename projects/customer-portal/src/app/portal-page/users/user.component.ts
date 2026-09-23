import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild
} from "@angular/core";
import {NbCardListPage} from "../../../../../common/src/lib/pages/nb-card-list-page";
import {UserLabels} from "./user-labels";
import {ExtendedTableFilter, ExtendedTableHeader} from "../../../../../common/src/lib/table/table.component";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {AlertService} from "../../../../../common/src/lib/utils/alert.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../../services/user.service";
import {FilterInputComponent} from "../../../../../common/src/lib/table/filter/filter-input.component";
import {FilterIntegerInputComponent} from "../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {UserEditComponent} from "./user-edit.component";
import {UserModel} from "../../../models/user.model";
import {UserTableComponent} from "./user-table.component";
import {catchError, finalize, map} from "rxjs/operators";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {CustomerService} from "../../../services/customer.service";
import {CustomerAuthenticationService} from "../../../services/customer-authentication.service";
import {isEmptyString} from "../../../../../common/src/lib/helpers/string.helper";
import {PermissionModel} from "../../../models/permission.model";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {CustomerPermissionEnumHelper} from "../../../enums/customer-permission.enum";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";
import {ComponentCanDeactivate} from "../../../../../common/src/lib/pages/can-deactivate.component";
import {Observable} from "rxjs";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";
import {AUTHENTICATION_SERVICE_TOKEN} from "../../../../../common/src/lib/services/base-authentication.service";
import {CustomerUserStatusEnum} from "../../../enums/customer-user-status.enum";
import {SDFT} from "../../../../../common/src/lib/helpers/date.helper";
import * as moment from "moment-timezone";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmModalComponent} from "../../../../../common/src/lib/modals/confirm/confirm-modal.component";

@Component({
  standalone: false,
  selector: 'app-customer-users',
  templateUrl: './user.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss', './user.component.scss']
})
export class UserComponent extends NbCardListPage implements OnInit, AfterViewInit, ComponentCanDeactivate {
  headers;
  filters;
  readonly Labels = UserLabels;
  @ViewChild('tableElement', {static: true}) protected table: UserTableComponent;
  protected showCreateEditForm = false;
  private user: UserModel;

  constructor(protected elementRef: ElementRef,
              private userService: UserService,
              private customerService: CustomerService,
              public errorService: ErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected alertService: AlertService,
              protected router: ActivatedRoute,
              protected ch: ChangeDetectorRef,
              private fieldValidationErrorService: FieldValidationErrorService,
              @Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: CustomerAuthenticationService,
              private currentDataService: CustomerCurrentDataService,
              private modalService: NgbModal) {
    super(elementRef, routingService);
  }

  get service() {
    return this.userService;
  }

  private _editComponent: UserEditComponent;

  get editComponent(): UserEditComponent {
    return this._editComponent;
  }

  @ViewChild(UserEditComponent)
  set editComponent(c: UserEditComponent) {
    this._editComponent = c;
    if (this._editComponent) {
      this._editComponent.reInit({
        id: this.user.id,
        email: this.user.email,
        firstName: this.user.firstName,
        middleName: this.user.middleName,
        lastName: this.user.lastName,
        permissions: this.user.permissions,
        status: this.user.status,
        allPermissions: this.table.permissions
      });
    }
  }

  get maxUsersExceeded(): boolean {
    return this.table.maxCustomerUsersInCustomer != 0 && this.table.totalElements >= this.table.maxCustomerUsersInCustomer;
  }


  reInit() {
    this.showCreateEditForm = false;
    this.user = null;
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
  }

  initHeaders(): ExtendedTableHeader[] {
    const headers: ExtendedTableHeader[] = [];
    headers.push(new ExtendedTableHeader({key: 'ID', value: this.Labels.Id, sortProperty: 'id'}));
    headers.push(new ExtendedTableHeader({key: 'EMAIL', value: this.Labels.Email, sortProperty: 'email'}));
    headers.push(new ExtendedTableHeader({key: 'NAME', value: this.Labels.Name, sortProperty: 'name'}));
    headers.push(new ExtendedTableHeader({key: 'PERMISSIONS', value: this.Labels.Permissions, sortProperty: null}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(...[
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: this.Labels.Id}
      },
      {
        filterProperty: 'email',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.Email}
      },
      {
        filterProperty: 'name',
        componentType: FilterInputComponent,
        componentParams: {placeholder: this.Labels.Name}
      },
      null
    ]);

    return filters;
  }

  ngOnInit(): void {
    this.reInit();
  }

  onSave(user: UserModel) {
    this.subscriptions.add(
      this.userService.save(user)
        .pipe(finalize(() => {
          this.editComponent.afterSubmit();
        }))
        .pipe(map(success => {
          this.showCreateEditForm = false;
          if (this.user.email == user.email) {
            this.authService.updateCurrentPermissions();
          }
          this.table.refresh();
        }))
        .pipe(catchError(error => {
          this.fieldValidationErrorService.error(error, this.editComponent);
          throw error;
        }))
        .subscribe()
    );
  }

  onCancel() {
    this.showCreateEditForm = false;
  }

  onEdit(rowData: UserModel) {
    this.user = rowData;
    this.showCreateEditForm = true;
  }

  onCreate() {
    this.user = new UserModel();
    this.showCreateEditForm = true;
  }

  getName(rowData: UserModel): string {
    return [rowData.firstName, rowData.middleName, rowData.lastName].filter(v => !isEmptyString(v)).join(" ");
  }

  isInvited(rowData: UserModel): boolean {
    return rowData.status === CustomerUserStatusEnum.PENDING;
  }

  isInvitationExpired(rowData: UserModel): boolean {
    return !rowData.expiresAt || new Date(rowData.expiresAt).getTime() <= Date.now();
  }

  getInvitationExpiration(rowData: UserModel): string {
    return this.isInvitationExpired(rowData) ? this.Labels.InvitationExpired :
      this.Labels.InvitationExpiresAt(moment(rowData.expiresAt).tz(moment.tz.guess()).format(SDFT + ' z'));
  }

  isCurrentUser(rowData: UserModel): boolean {
    return rowData.email === this.currentDataService.currentCustomer.email;
  }

  onReinvite(rowData: UserModel) {
    this.subscriptions.add(
      this.userService.reinvite(rowData.id).subscribe(() => {
        this.errorService.showSuccess('', this.Labels.Reinvited(rowData.email));
        this.table.refresh();
      })
    );
  }

  onRevoke(rowData: UserModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.header = this.Labels.RevokeInvitation;
    modalRef.componentInstance.body = this.Labels.RevokeConfirmation(rowData.email);
    modalRef.result
      .then(() => this.subscriptions.add(
        this.userService.revoke(rowData.id).subscribe(() => {
          this.errorService.showSuccess('', this.Labels.Revoked(rowData.email));
          this.table.refresh();
        })
      ))
      .catch(() => {
      });
  }

  get companyName() {
    return this.currentDataService.companyName;
  }

  isChildPermission(permission: PermissionModel): boolean {
    return ObjectHelper.isDefined(CustomerPermissionEnumHelper.getParent(permission.permissionKey));
  }

  protected readonly CustomerPermissionEnumHelper = CustomerPermissionEnumHelper;


  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateEditForm && this.editComponent.objectChanged());
  }
}
