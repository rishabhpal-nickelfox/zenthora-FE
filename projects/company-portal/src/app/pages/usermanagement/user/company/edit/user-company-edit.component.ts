import {ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserEditRolesComponent} from '../../common/roles/user-edit-roles.component';
import {UIKeyService} from '../../../../../../services/ui-key.service';
import {UserModel} from '../../../../../models/usermanagement/user.model';
import {CompanyCurrentDataService} from '../../../../../../services/company-current-data.service';
import {FormPageStateService} from '../../../../../../../../common/src/lib/utils/form-page-state.service';
import {
  UserCompanyAdminCreateRequest,
  UserCompanyAdminUpdateRequest
} from '../../../../../models/usermanagement/user-request.model';
import {RoleModel} from '../../../../../models/usermanagement/role.model';
import {UserLabels} from '../../user-labels';
import {ServerErrorService} from '../../../../../../../../common/src/lib/utils/server-error.service';
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {deepEqual} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {Observable} from "rxjs";

@Component({
  standalone: false,
  selector: 'app-user-company-edit-component',
  templateUrl: './user-company-edit.component.html',
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService, ServerErrorService]
})
export class UserCompanyEditComponent extends AutoScrollingFormPageComponent {

  user = new UserModel();

  currentEntityName;
  roles = [];

  readonly Labels = UserLabels;

  @ViewChild('editRolesComponent', {static: true}) editRolesComponent: UserEditRolesComponent;
  private _form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              private uiKeyService: UIKeyService,
              private currentDataService: CompanyCurrentDataService,
              private _fb: FormBuilder, public errorService: ErrorService,
              private ch: ChangeDetectorRef) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  get isSelfEdit() {
    return this.currentDataService.getCurrentUser() ? this.user.username === this.currentDataService.getCurrentUser().username : false;
  }

  onReInit(viewUser) {
    this.user = viewUser;
    this.roles = [...viewUser.roles];
    this.resetForm(this.user, this.roles);
  }

  resetForm(viewUser: UserModel, roles: RoleModel[]) {
    this.editRolesComponent.reInit(roles);
    this.ch.detectChanges();
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([]);
  }

  onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  getForm(): FormGroup {
    return this._form;
  }

  onRolesChanged(newRoles) {
    this.roles = newRoles;
    this.getForm().updateValueAndValidity();
  }

  onSubmit(value) {
    this.saveEvent.emit({
      user: this.value
    });
    return false;
  }


  protected onInit(): void {
    this._form = this._fb.group({});
  }


  get value(): UserModel {
    const model: UserModel = Object.assign(new UserModel(), this.user, this.getForm().getRawValue());
    model.roles = this.roles;
    return model;
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(UserCompanyAdminUpdateRequest.toJSON(this.value), UserCompanyAdminUpdateRequest.toJSON(this.user));
  }

}
