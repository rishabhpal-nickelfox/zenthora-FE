import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UIKeyService} from '../../../../../../services/ui-key.service';
import {CompanyCurrentDataService} from '../../../../../../services/company-current-data.service';
import {
  convertRolesArrayToRolesGroupedByEntitiesMap,
  RoleModel
} from '../../../../../models/usermanagement/role.model';
import {UserLabels} from '../../user-labels';
import {ServerErrorService} from '../../../../../../../../common/src/lib/utils/server-error.service';
import {RolePermissionService} from '../../../../../../services/usermanagement/role-permission.service';
import {EntityModel} from '../../../../../models/companymanage/entity.model';
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {finalize} from "rxjs/operators";
import { isDefined } from '../../../../../../../../common/src/lib/helpers/object.helper';
import {FormComponent} from "../../../../../../../../common/src/lib/pages/form.component";

@Component({
  standalone: false,
  selector: 'app-usermanage-editroles-component',
  templateUrl: './user-edit-roles.component.html',
  styleUrls: ['../../../../../../../../common/src/lib/table/table.component.scss']
})
export class UserEditRolesComponent extends FormComponent implements OnInit {
  get loading(): boolean {
    return this._loading;
  }


  roleGroups;
  checkedRoles: RoleModel[] = [];
  entityRoles: RoleModel[] = [];
  @Input() selfEdit = false;
  showRoleTree;
  entity: EntityModel = null;
  @Output() rolesChanged: EventEmitter<any> = new EventEmitter();
  _selectAllRoles: FormControl;
  _rolesControl: FormArray;
  readonly Labels = UserLabels;
  private _form: FormGroup;
  private _loading = false;

  constructor(protected elementRef: ElementRef, public errorService: ErrorService,
              public serverErrorService: ServerErrorService,
              private uiKeyService: UIKeyService,
              private currentDataService: CompanyCurrentDataService, private _fb: FormBuilder, private rolePermissionService: RolePermissionService,
              private ch: ChangeDetectorRef) {
    super(elementRef, errorService, serverErrorService);
  }

  get showPending() {
    return !this.uiKeyService.isSystemUserAdmin() && this.checkedRoles ? isDefined(this.checkedRoles.find(role => role.pending)) : false;
  }

  getForm(): FormGroup {
    return this._form;
  }

  ngOnInit(): void {
    this._selectAllRoles = new FormControl(false);
    this._rolesControl = new FormArray([]);
    this._form = this._fb.group({
      selectAll: this._selectAllRoles,
      roles: this._rolesControl
    });

    this.subscriptions.add(
      this._selectAllRoles.valueChanges.subscribe(value => {
        this._rolesControl.controls.forEach(roleControl => {
          if (roleControl.enabled) {
            roleControl.setValue(value);
          }
        });
      })
    );
  }

  getGroupedRoles(data) {
    let rolesGroupedByEntitiesMap = new Map();
    const currentEntity = this.currentDataService.getCurrentEntity();
    if (isDefined(currentEntity)) {
      if (this.uiKeyService.isSystemUserAdmin()) {
        rolesGroupedByEntitiesMap = convertRolesArrayToRolesGroupedByEntitiesMap(data);
      } else {
        rolesGroupedByEntitiesMap = convertRolesArrayToRolesGroupedByEntitiesMap(data.filter(
          role => role.entity.id === currentEntity.id));
      }
      if (!rolesGroupedByEntitiesMap.get(currentEntity.id)) {
        rolesGroupedByEntitiesMap.set(currentEntity.id, [{entity: currentEntity}]);
      }
    }
    return rolesGroupedByEntitiesMap;
  }

  getEntity(roleGroup: RoleModel[]): EntityModel {
    return roleGroup[0].entity;
  }

  getRolesString(roleGroup) {
    return roleGroup.map(role => role.name).join(', ');
  }

  onEditRoleGroup(roleGroup: RoleModel[]) {
    this.entity = this.getEntity(roleGroup);
    this._rolesControl = new FormArray([]);
    this._loading = true;
    this.subscriptions.add(
      this.rolePermissionService.getRolesForEntity(this.entity)
        .pipe(finalize(() => {
          this._loading = false;
          this.ch.detectChanges();
        }))
        .subscribe(
        data => {
          this.entityRoles = data;
          this.entityRoles.forEach(role => {
            const hasPermission = isDefined(roleGroup.find(r => r.id === role.id));
            this._rolesControl.push(new FormControl({value: hasPermission, disabled: role.admin && this.selfEdit}));
          });
          this.ch.detectChanges();
        }
      )
    );

    this._selectAllRoles.reset(!this._rolesControl.getRawValue().find(value => !value), {emitEvent: false});
    this.showRoleTree = true;
    this._form.markAsPristine();
    return false;
  }

  getRoleName(i: number): string {
    return this.entityRoles[i].name;
  }

  cancelChangingRoles(): void {
    this.showRoleTree = false;
    this.entity = null;
  }

  changeRoles(): void {
    const roles = this._rolesControl.getRawValue()
      .map((checked, i) => {
        return {checked: checked, role: this.entityRoles[i]};
      })
      .filter(checkedRole => checkedRole.checked).map(checkedRole => checkedRole.role);
    const newRoles = this.checkedRoles.filter(role => role.entity.id != this.entity.id);
    newRoles.push(...roles);

    this.reInit(newRoles);
    this.showRoleTree = false;
    this.entity = null;
    this.rolesChanged.emit(newRoles);
  }

  protected onReInit(newData?: any) {
    this.checkedRoles = newData;
    this.roleGroups = Array.from(this.getGroupedRoles(newData).values()).sort((g1, g2) => g1[0].entity.id > g2[0].entity.id ? 1 : -1);

  }
}
