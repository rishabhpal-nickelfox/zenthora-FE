import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";
import {PermissionModel} from "../../../models/permission.model";
import {UserLabels} from "./user-labels";
import {ServerErrorService} from "../../../../../common/src/lib/utils/server-error.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {UserModel} from "../../../models/user.model";
import {deepEqual, ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";
import {UserPermissionsViewModel} from "./user-permissions.component";
import {Observable} from "rxjs";
import {CustomerUserStatusEnum} from "../../../enums/customer-user-status.enum";

@Component({
  standalone: false,
  selector: 'app-customer-user-edit',
  templateUrl: './user-edit.component.html',
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class UserEditComponent extends AutoScrollingFormPageComponent implements OnInit {

  readonly MAX_LENGTH = {
    EMAIL: 100,
    FIRST_NAME: 100,
    LAST_NAME: 100,
    MIDDLE_NAME: 100
  };

  readonly Labels = UserLabels;
  _id = new FormControl<number>(null);
  _permissions = new FormControl<UserPermissionsViewModel>({
    permissions: [],
    allPermissions: [],
    isSelfEdit: false,
    isInvite: false
  });
  _status = new FormControl<CustomerUserStatusEnum>(null);
  _email = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.Email, this.MAX_LENGTH.EMAIL)(c), c => CustomValidator.required(this.Labels.Email)(c), c => CustomValidator.emailValidation(this.Labels.Email)(c)]))
  _firstName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.FirstName, this.MAX_LENGTH.FIRST_NAME)(c), c => CustomValidator.required(this.Labels.FirstName)(c)]));
  _middleName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.MiddleName, this.MAX_LENGTH.MIDDLE_NAME)(c)]));
  _lastName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.LastName, this.MAX_LENGTH.LAST_NAME)(c), c => CustomValidator.required(this.Labels.FirstName)(c)]));

  private _form = this._fb.group<UserFormGroupModel>({
    id: this._id,
    email: this._email,
    firstName: this._firstName,
    middleName: this._middleName,
    lastName: this._lastName,
    permissions: this._permissions,
    status: this._status
  });
  private user: UserModel;
  private allPermissions: PermissionModel[];

  constructor(public formPageStateService: FormPageStateService,
              public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              private _fb: FormBuilder,
              public errorService: ErrorService,
              private ch: ChangeDetectorRef,
              public currentDataService: CustomerCurrentDataService) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  protected get isCreateMode(): boolean {
    return !ObjectHelper.isDefined(this._id.getRawValue());
  }

  getForm(): FormGroup<UserFormGroupModel> {
    return this._form;
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['email', this._email],
      ['firstName', this._firstName],
      ['middleName', this._middleName],
      ['lastName', this._lastName],
      ['permissions', this._permissions]
    ]);
  }

  onSubmit(value) {
    this.saveEvent.emit(this.value);
    return false;
  }

  protected onInit(): void {
  }

  protected onReInit(data: UserEditViewModel) {
    this.user = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      permissions: data.permissions ?? [],
      status: data.status
    };

    this._id.reset({value: this.user.id, disabled: true}, {emitEvent: false});
    this._email.reset({value: this.user.email, disabled: false}, {emitEvent: false});
    this._firstName.reset({value: this.user.firstName, disabled: this.isCreateMode}, {emitEvent: false});
    this._middleName.reset({value: this.user.middleName, disabled: this.isCreateMode}, {emitEvent: false});
    this._lastName.reset({value: this.user.lastName, disabled: this.isCreateMode}, {emitEvent: false});
    this._status.reset({value: this.user.status, disabled: true}, {emitEvent: false});
    this.allPermissions = data.allPermissions;

    this._permissions.reset({
      permissions: this.user.permissions,
      allPermissions: this.allPermissions,
      isSelfEdit: this.user.email == this.currentDataService.currentCustomer.email,
      isInvite: this.isCreateMode
    }, {emitEvent: false});

    this._form.markAsPristine();
    this.ch.detectChanges();
  }

  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  get value(): UserModel {
    const userFormValue = this.getForm().getRawValue();
    return {
      id: userFormValue.id,
      email: userFormValue.email,
      firstName: userFormValue.firstName,
      middleName: userFormValue.middleName,
      lastName: userFormValue.lastName,
      permissions: userFormValue.permissions.permissions,
      status: userFormValue.status
    }
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(UserModel.toJSON(this.value), UserModel.toJSON(this.user));
  }

}


export interface UserEditViewModel {
  id: number;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  permissions: PermissionModel[];
  allPermissions: PermissionModel[];
  status: CustomerUserStatusEnum;
}

interface UserFormGroupModel {
  id: FormControl<number>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  middleName: FormControl<string>;
  lastName: FormControl<string>;
  permissions: FormControl<UserPermissionsViewModel>
  status: FormControl<CustomerUserStatusEnum>;
}
