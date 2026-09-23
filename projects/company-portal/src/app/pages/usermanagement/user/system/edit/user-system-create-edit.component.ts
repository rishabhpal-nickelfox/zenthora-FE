import {ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {UIKeyService} from '../../../../../../services/ui-key.service';
import {UserModel} from '../../../../../models/usermanagement/user.model';
import {CompanyCurrentDataService} from '../../../../../../services/company-current-data.service';
import {FormPageStateService} from '../../../../../../../../common/src/lib/utils/form-page-state.service';
import {UserSystemAdminUpdateRequest} from '../../../../../models/usermanagement/user-request.model';
import {UserEditRolesComponent} from '../../common/roles/user-edit-roles.component';
import {UserLabels} from '../../user-labels';
import {ServerErrorService} from '../../../../../../../../common/src/lib/utils/server-error.service';
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {CustomValidator} from "../../../../../../../../common/src/lib/helpers/custom.validator";
import {deepEqual, ObjectHelper} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";

@Component({
  standalone: false,
  selector: 'app-user-system-create-edit',
  templateUrl: './user-system-create-edit.component.html',
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService, ServerErrorService]
})
export class UserSystemCreateEditComponent extends AutoScrollingFormPageComponent {

  currentEntityName;
  _firstName: FormControl;
  _middleName: FormControl;
  _lastName: FormControl;
  _username: FormControl;
  _resetPassword: FormControl;
  _mustChangePassword: FormControl;
  _contactInfo: FormGroup;
  _mainPhone: FormControl;
  _workPhone: FormControl;
  _mobile: FormControl;
  _fax: FormControl;
  _ccEmail: FormControl;
  readonly NAME_MAX_LENGTH = 100;
  readonly EMAIL_MAX_LENGTH = 100;
  @ViewChild('editRolesComponent', {static: true}) editRolesComponent: UserEditRolesComponent;
  roles = [];
  readonly Labels = UserLabels;
  private editUser = new UserModel();
  private _form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              public uiKeyService: UIKeyService,
              private currentDataService: CompanyCurrentDataService,
              private _fb: FormBuilder,
              public errorService: ErrorService,
              private ch: ChangeDetectorRef,) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  get isCreateMode() {
    return !this.isDefined(this.editUser.id);
  }

  get isSelfEdit() {
    return this.currentDataService.getCurrentUser() ? this.editUser.username === this.currentDataService.getCurrentUser().username : false;
  }

  protected onInit(): void {
    this._firstName = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.FirstName)(c), c => CustomValidator.maxLength(this.Labels.FirstName, this.NAME_MAX_LENGTH)(c)]));
    this._middleName = new FormControl(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.MiddleName, this.NAME_MAX_LENGTH)(c)]));
    this._lastName = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.LastName)(c), c => CustomValidator.maxLength(this.Labels.LastName, this.NAME_MAX_LENGTH)(c)]));
    this._username = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.Email)(c), c => CustomValidator.emailValidation(this.Labels.Email)(c), c => CustomValidator.maxLength(this.Labels.Email, this.EMAIL_MAX_LENGTH)(c)]));
    this._mainPhone = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.MainPhone)(c), c => CustomValidator.phoneValidation(this.Labels.MainPhone)(c)]));
    this._workPhone = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.WorkPhone)(c)]));
    this._mobile = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.Mobile)(c)]));
    this._fax = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.Fax)(c)]));
    this._ccEmail = new FormControl(null, Validators.compose([c => CustomValidator.emailValidation(this.Labels.CCEmail)(c), c => CustomValidator.maxLength(this.Labels.CCEmail, this.EMAIL_MAX_LENGTH)(c)]));
    this._resetPassword = new FormControl(false);
    this._mustChangePassword = new FormControl(false);
    this._contactInfo = this._fb.group({
      mainPhone: this._mainPhone,
      workPhone: this._workPhone,
      mobile: this._mobile,
      fax: this._fax,
      ccEmail: this._ccEmail
    });

    this._form = this._fb.group({
        firstName: this._firstName,
        middleName: this._middleName,
        lastName: this._lastName,
        username: this._username,
        resetPassword: this._resetPassword,
        mustChangePassword: this._mustChangePassword,
        contactInfo: this._contactInfo
      }
    );
  }

  onReInit(editUser) {
    this.editUser = editUser;
    this.roles = [...editUser.roles];
    this.editRolesComponent.reInit(this.roles);
    this.resetForm(this.editUser);
    this.ch.detectChanges();
  }

  resetForm(user: UserModel) {
    this._firstName.reset(user.firstName, {emitEvent: false});
    this._middleName.reset(user.middleName, {emitEvent: false});
    this._lastName.reset(user.lastName, {emitEvent: false});
    this._username.reset(user.username, {emitEvent: false});
    this._mustChangePassword.reset({
      value: this.editUser.mustChangePassword,
      disabled: this.editUser.mustChangePassword
    }, {emitEvent: false});
    this._resetPassword.reset(false, {emitEvent: false});
    this._mainPhone.reset(user.contactInfo.mainPhone, {emitEvent: false});
    this._workPhone.reset(user.contactInfo.workPhone, {emitEvent: false});
    this._mobile.reset(user.contactInfo.mobile, {emitEvent: false});
    this._fax.reset(user.contactInfo.fax, {emitEvent: false});
    this._ccEmail.reset(user.contactInfo.ccEmail, {emitEvent: false});
    this._form.markAsPristine();
  }

  ifEditUserHasNoRoles() {
    return !this.roles || this.roles.length === 0;
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['firstName', this._firstName],
      ['middleName', this._middleName],
      ['lastName', this._lastName],
      ['email', this._username],
      ['login', this._username],
      ['resetPassword', this._resetPassword],
      ['contactInfo.mainPhone', this._mainPhone],
      ['contactInfo.workPhone', this._workPhone],
      ['contactInfo.mobile', this._mobile],
      ['contactInfo.fax', this._fax],
      ['contactInfo.ccEmail', this._ccEmail]
    ]);
  }


  onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  getForm(): FormGroup {
    return this._form;
  }

  onSubmit(value) {
    const model = this.value;
    this.saveEvent.emit({
      user: model.user,
      resetPassword: model.resetPassword,
      mustChangePassword: model.mustChangePassword
    });
    return false;
  }

  onRolesChanged(newRoles) {
    this.roles = newRoles;
    this.getForm().updateValueAndValidity();
  }

  get value(): { user: UserModel, resetPassword: boolean, mustChangePassword: boolean } {
    const model: UserModel = Object.assign(ObjectHelper.cloneDeep(this.editUser), this.getForm().getRawValue());
    model.roles = this.roles;
    return {
      user: model,
      resetPassword: this._resetPassword.value,
      mustChangePassword: this._mustChangePassword.value
    };
  }


  objectChanged(): boolean | Observable<boolean> {
    const newValue = this.value;
    return !deepEqual(UserSystemAdminUpdateRequest.toJSON(newValue.user, newValue.resetPassword, newValue.mustChangePassword), UserSystemAdminUpdateRequest.toJSON(this.editUser, false, false));
  }

  public afterSubmit(): void {
    super.afterSubmit();
    this.ch.detectChanges();
  }
}
