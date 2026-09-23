import {Component, ElementRef, OnInit} from '@angular/core';
import {convertRoleToJSON, RoleModel} from '../../../models/usermanagement/role.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService} from '../../../../../../common/src/lib/utils/errorhandler/error.service';
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {PermissionModel} from "../../../models/usermanagement/permission.model";
import {ServerErrorService} from "../../../../../../common/src/lib/utils/server-error.service";
import {RoleLabels} from "./role-labels";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {deepEqual, isDefined, ObjectHelper} from "../../../../../../common/src/lib/helpers/object.helper";
import {CustomValidator} from "../../../../../../common/src/lib/helpers/custom.validator";

@Component({
  standalone: false,
  selector: 'app-rolemanage-createeditrole-component',
  templateUrl: './role-create-edit.component.html',
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class RoleCreateEditComponent extends AutoScrollingFormPageComponent implements OnInit {


  wsKeyFormControlNameMap: Map<string, string>;
  readonly MAX_LENGTH = {
    ROLE_NAME: 100
  };
  _roleNameControl: FormControl;
  _selectAllPermissionsControl: FormControl;
  _permissionsControl: FormArray;
  private _form: FormGroup;
  private role = new RoleModel();
  private entityPermissions: PermissionModel[] = [];
  readonly Labels = RoleLabels;

  constructor(public formPageStateService: FormPageStateService,
              public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              private _fb: FormBuilder,
              public errorService: ErrorService) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  get isCreateMode() {
    return !isDefined(this.role) || !isDefined(this.role.id);
  }

  getForm(): FormGroup {
    return this._form;
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['name', this._roleNameControl]
    ]);
  }

  onSubmit(value) {
    this.saveEvent.emit(this.value);
    return false;
  }

  getWSKeyFormControlNameMap(): Map<string, string> {
    return this.wsKeyFormControlNameMap;
  }

  objectChanged(): boolean {
    const roleJSON = convertRoleToJSON(this.role);
    const formJSON = convertRoleToJSON(this.value);
    return !deepEqual(roleJSON, formJSON);
  }

  getPermissionName(i: number): string {
    return this.entityPermissions[i].name;
  }

  protected onInit(): void {
    this._roleNameControl = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.RoleName)(c),
        c => CustomValidator.maxLength(this.Labels.RoleName, this.MAX_LENGTH.ROLE_NAME)(c)]));
    this._selectAllPermissionsControl = new FormControl(false);
    this._permissionsControl = new FormArray([]);
    this._form = this._fb.group({
      roleName: this._roleNameControl,
      selectAll: this._selectAllPermissionsControl,
      permissions: this._permissionsControl
    });

    this.subscriptions.add(
      this._selectAllPermissionsControl.valueChanges.subscribe(value => {
        this._permissionsControl.controls.forEach(permissionControl => {
          if (permissionControl.enabled) {
            permissionControl.setValue(value);
          }
        });
      })
    );
  }

  protected onReInit(data: { role: RoleModel, entityPermissions: PermissionModel[] }) {
    this.role = data.role;
    this.entityPermissions = data.entityPermissions;
    this.resetForm();
  }

  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  get value() {
    return Object.assign(ObjectHelper.cloneDeep(this.role),
      {
        name: this._roleNameControl.value,
        permissions: this._permissionsControl.getRawValue()
          .map((checked, i) => {
            return {checked: checked, permission: this.entityPermissions[i]}
          })
          .filter(checkedPermission => checkedPermission.checked).map(checkedPermission => checkedPermission.permission)
      });
  }

  private resetForm() {
    this._roleNameControl.reset(this.role.name, {emitEvent: false});
    this._selectAllPermissionsControl.reset(false, {emitEvent: false});
    this._permissionsControl = new FormArray([]);
    this.entityPermissions.forEach(permission => {
      const hasPermission = isDefined(this.role.permissions.find(p => p.uiKey === permission.uiKey));
      this._permissionsControl.push(new FormControl({
        value: hasPermission,
        disabled: this.role.admin && permission.protected && hasPermission
      }));
    });
    this._form.markAsPristine();
  }
}
