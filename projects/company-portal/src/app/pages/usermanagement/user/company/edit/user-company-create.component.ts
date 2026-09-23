import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UIKeyService} from '../../../../../../services/ui-key.service';
import {UserModel} from '../../../../../models/usermanagement/user.model';
import {CompanyCurrentDataService} from '../../../../../../services/company-current-data.service';
import {FormPageStateService} from '../../../../../../../../common/src/lib/utils/form-page-state.service';
import {UserEditRolesComponent} from '../../common/roles/user-edit-roles.component';
import {UserLabels} from '../../user-labels';
import {RoleModel} from '../../../../../models/usermanagement/role.model';
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {CustomValidator} from "../../../../../../../../common/src/lib/helpers/custom.validator";
import {Observable} from "rxjs";
import {deepEqual, ObjectHelper} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {
  UserCompanyAdminCreateRequest,
  UserCompanyAdminUpdateRequest,
  UserSystemAdminUpdateRequest
} from "../../../../../models/usermanagement/user-request.model";

@Component({
  standalone: false,
    selector: 'app-user-company-create-component',
    templateUrl: './user-company-create.component.html',
    outputs: ['saveEvent', 'cancelEvent'],
    providers: [FormPageStateService]
})
export class UserCompanyCreateComponent extends AutoScrollingFormPageComponent implements OnInit {

    editUser = new UserModel();

    currentEntityName;
    _firstName: FormControl;
    _middleName: FormControl;
    _lastName: FormControl;
    _username: FormControl;
    _contactInfo: FormGroup;
    _mainPhone: FormControl;
    _workPhone: FormControl;
    _mobile: FormControl;
    _fax: FormControl;
    _ccEmail: FormControl;

    readonly MAX_LENGTH = {
        NAME: 100,
        EMAIL: 100,
        EMV: 100
    };

    readonly MIN_LENGTH = {
        EMV: 4
    };

    @ViewChild('editRolesComponent', {static: true}) editRolesComponent: UserEditRolesComponent;
    roles = [];
    readonly Labels = UserLabels;
    private _form: FormGroup;

    constructor(public formPageStateService: FormPageStateService,
                protected elementRef: ElementRef,
                private uiKeyService: UIKeyService,
                private currentDataService: CompanyCurrentDataService,
                private _fb: FormBuilder,
                public errorService: ErrorService) {
        super(formPageStateService, elementRef, errorService);
    }

    get isCreateMode() {
        return !this.isDefined(this.editUser.id);
    }

    get isSelfEdit() {
        return this.currentDataService.getCurrentUser() ? this.editUser.username === this.currentDataService.getCurrentUser().username : false;
    }

    ngOnInit(): void {

        this.editUser = new UserModel();

        this._firstName = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.FirstName)(c), c => CustomValidator.maxLength(this.Labels.FirstName, this.MAX_LENGTH.NAME)(c)]));
        this._middleName = new FormControl(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.MiddleName, this.MAX_LENGTH.NAME)(c)]));
        this._lastName = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.LastName)(c), c => CustomValidator.maxLength(this.Labels.LastName, this.MAX_LENGTH.NAME)(c)]));
        this._username = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.Email)(c), c => CustomValidator.emailValidation(this.Labels.Email)(c), c => CustomValidator.maxLength(this.Labels.Email, this.MAX_LENGTH.EMAIL)(c)]));
        this._mainPhone = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.MainPhone)(c), c => CustomValidator.phoneValidation(this.Labels.MainPhone)(c)]));
        this._workPhone = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.WorkPhone)(c)]));
        this._mobile = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.Mobile)(c)]));
        this._fax = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.Fax)(c)]));
        this._ccEmail = new FormControl(null, Validators.compose([c => CustomValidator.emailValidation(this.Labels.CCEmail)(c), c => CustomValidator.maxLength(this.Labels.CCEmail, this.MAX_LENGTH.EMAIL)(c)]));
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
                contactInfo: this._contactInfo
            },
            {
                validators: (control: AbstractControl) => {
                    return this.ifEditUserHasNoRoles() ? {'emptyRoles': control.value} : null;
                }
            }
        );
        this.wsKeyFormControlNameMap = this.createWSMap();
    }

    onReInit(editUser) {
        this.editUser = editUser;
        this.roles = [...editUser.roles];
        this.resetForm(this.editUser, this.roles);
    }

    resetForm(user: UserModel, roles: RoleModel[]) {
        this._firstName.reset(user.firstName, {emitEvent: false});
        this._middleName.reset(user.middleName, {emitEvent: false});
        this._lastName.reset(user.lastName, {emitEvent: false});
        this._username.reset(user.username, {emitEvent: false});
        this._mainPhone.reset(user.contactInfo.mainPhone, {emitEvent: false});
        this._workPhone.reset(user.contactInfo.workPhone, {emitEvent: false});
        this._mobile.reset(user.contactInfo.mobile, {emitEvent: false});
        this._fax.reset(user.contactInfo.fax, {emitEvent: false});
        this._ccEmail.reset(user.contactInfo.ccEmail, {emitEvent: false});
        this.editRolesComponent.reInit(roles);
        this._form.markAsPristine();
    }

    ifEditUserHasNoRoles() {
        return !this.roles || this.roles.length === 0;
    }

    createWSMap(): Map<string, string> {
        return new Map([
            ['firstName', 'firstName'],
            ['middleName', 'middleName'],
            ['lastName', 'lastName'],
            ['email', 'username'],
            ['login', 'username'],
            ['contactInfo.mainPhone', 'contactInfo.mainPhone'],
            ['contactInfo.workPhone', 'contactInfo.workPhone'],
            ['contactInfo.mobile', 'contactInfo.mobile'],
            ['contactInfo.fax', 'contactInfo.fax'],
            ['contactInfo.ccEmail', 'contactInfo.ccEmail']
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
        this.saveEvent.emit({
          user: this.value
        });
        return false;
    }

    onRolesChanged(newRoles) {
        this.roles = newRoles;
        this.getForm().updateValueAndValidity();
    }


  get value(): UserModel {
    const model: UserModel = Object.assign(ObjectHelper.cloneDeep(this.editUser), this.getForm().getRawValue());
    model.roles = this.roles;
    return model;
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(UserCompanyAdminCreateRequest.toJSON(this.value), UserCompanyAdminCreateRequest.toJSON(this.editUser));
  }

}
