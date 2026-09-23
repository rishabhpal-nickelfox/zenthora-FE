import {ChangeDetectorRef, Component, ElementRef, forwardRef, Injector, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl
} from "@angular/forms";
import {PermissionModel} from "../../../models/permission.model";
import {UserLabels} from "./user-labels";
import {ServerErrorService} from "../../../../../common/src/lib/utils/server-error.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";
import {
  FormGroupAsFormControlComponent
} from "../../../../../common/src/lib/components/formgroup/form-group-as-form-control.component";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CustomerPermissionEnum, CustomerPermissionEnumHelper} from "../../../enums/customer-permission.enum";

@Component({
  standalone: false,
  selector: 'app-user-permissions-component',
  templateUrl: './user-permissions.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserPermissionsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: UserPermissionsComponent,
      multi: true
    }
  ]
})
export class UserPermissionsComponent extends FormGroupAsFormControlComponent implements OnInit, OnDestroy {

  readonly Labels = UserLabels;
  _checkAllPermissions = new FormControl<boolean>(false);
  _permissions: FormArray = new FormArray<any>([]);
  protected CustomerPermissionEnum = CustomerPermissionEnum;
  private _form = this._fb.group<UserPermissionsFormGroupModel>({
    checkAllPermissions: this._checkAllPermissions,
    permissions: this._permissions
  });
  private allPermissions: PermissionModel[];
  private isSelfEdit: boolean;
  protected isInvite: boolean;

  constructor(public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              protected _fb: FormBuilder,
              public errorService: ErrorService,
              protected ch: ChangeDetectorRef,
              public currentDataService: CustomerCurrentDataService,
              private injector: Injector) {
    super(elementRef, errorService, ch, serverErrorService);
  }

  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }

  get value(): UserPermissionsViewModel {
    const checkedPermissions =
      this._permissions.getRawValue().map((checked, i) => (
        {
          permission: this.allPermissions[i],
          checked: checked
        }
      )).filter(o => o.checked).map(permissionWithValue => permissionWithValue.permission);

    return {
      permissions: checkedPermissions,
      isSelfEdit: this.isSelfEdit,
      allPermissions: this.allPermissions,
      isInvite: this.isInvite
    }
  }

  getForm(): FormGroup<UserPermissionsFormGroupModel> {
    return this._form;
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['permissions', this._checkAllPermissions]
    ]);
  }

  protected formValueChanges(): Observable<UserPermissionsViewModel> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }

  protected onInit(): void {
    this.getForm().addValidators(
      [c => {
        return !this.isInvite || this.value.permissions.length > 0 ? null : {'atLeastOnePermissionIsRequired': true};
      }]
    );
  }

  protected onReInit(data: UserPermissionsViewModel) {
    this.isSelfEdit = data.isSelfEdit;
    this.isInvite = data.isInvite;

    this.allPermissions = data.allPermissions;

    while (this._permissions.length !== 0) {
      this._permissions.removeAt(0)
    }

    data.allPermissions.forEach(permission => {
      const hasPermission = ObjectHelper.isDefined(data.permissions.find(p => p.permissionKey == permission.permissionKey));
      const parentPermission = CustomerPermissionEnumHelper.getParent(permission.permissionKey);
      const hasParent = ObjectHelper.isDefined(parentPermission);
      const hasParentPermission = parentPermission && ObjectHelper.isDefined(data.permissions.find(p => p.permissionKey == parentPermission))
      this._permissions.push(new FormControl({
        value: hasPermission,
        disabled: (permission.protected && hasPermission && this.isSelfEdit) || (hasParent && !hasParentPermission)
      }));
    });

    this._checkAllPermissions.reset(!ObjectHelper.isDefined(this._permissions.getRawValue().find(v => !v)), {emitEvent: false});

    this.subscriptions.add(
      this._checkAllPermissions.valueChanges.subscribe(
        checkAll => {
          this._permissions.controls
            .forEach((c, i) => {
                if (!(this.isSelfEdit && this.allPermissions[i].protected)) {
                  c.setValue(checkAll, {emitEvent: false});
                  if (checkAll) {
                    c.enable();
                  } else {
                    const hasParent = ObjectHelper.isDefined(CustomerPermissionEnumHelper.getParent(this.allPermissions[i].permissionKey));
                    if (hasParent) {
                      c.disable();
                    }
                  }
                }
              }
            );
        }
      )
    );

    this._permissions.controls.forEach((c, i) =>
      this.subscriptions.add(
        c.valueChanges.subscribe(newValue => {

          //change Check All value
          if (newValue && !ObjectHelper.isDefined(this._permissions.controls.filter((c, i) => !this.allPermissions[i].protected)
            .find(c => !c.value))) {
            this._checkAllPermissions.setValue(true, {emitEvent: false});
          } else {
            this._checkAllPermissions.setValue(false, {emitEvent: false});
          }

          //change parent-child permissions value
          const children = CustomerPermissionEnumHelper.getChildren(this.allPermissions[i].permissionKey);
          children.forEach(child => {
            const childIndex = this.allPermissions.findIndex(permission => permission.permissionKey == child);
            this._permissions.controls[childIndex].setValue(newValue);
            if (!newValue) {
              this._permissions.controls[childIndex].disable();
            } else {
              this._permissions.controls[childIndex].enable();
            }
          });
        })
      ));


    this._form.markAsPristine();
    this.ch.detectChanges();
  }

  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  protected getPermissionName(i: number): string {
    return CustomerPermissionEnumHelper.getDisplayName(this.allPermissions[i]);
  }

  protected isChildPermission(i: number): boolean {
    return ObjectHelper.isDefined(CustomerPermissionEnumHelper.getParent(this.allPermissions[i].permissionKey));
  }
}


export interface UserPermissionsViewModel {
  permissions: PermissionModel[];
  allPermissions: PermissionModel[];
  isSelfEdit: boolean;
  isInvite: boolean;
}

interface UserPermissionsFormGroupModel {
  checkAllPermissions: FormControl<boolean>;
  permissions: FormArray;
}
