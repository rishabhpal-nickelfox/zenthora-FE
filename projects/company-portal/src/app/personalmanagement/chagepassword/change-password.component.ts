import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyCurrentDataService} from '../../../services/company-current-data.service';
import {finalize} from 'rxjs/operators';
import {FormPageStateService} from '../../../../../common/src/lib/utils/form-page-state.service';
import {ChangePasswordLabels} from '../../../../../common/src/lib/components/password/change-password-labels';
import {FormValidatorMustBeTheSameErrorModel} from '../../../../../common/src/lib/models/common/form-validator-error.model';
import {FieldValidationErrorService} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {PasswordValidator} from "../../../../../common/src/lib/helpers/password.validator";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";

@Component({
  standalone: false,
    selector: 'app-company-change-password-component',
    templateUrl: './change-password.component.html',
    providers: [FormPageStateService]
})
export class ChangePasswordComponent extends AutoScrollingFormPageComponent implements OnInit {

    public readonly PASSWORD_MAX_LENGTH = PasswordValidator.MAX_LENGTH;
    public readonly PASSWORD_MIN_LENGTH = PasswordValidator.MIN_LENGTH;

    public readonly Labels = ChangePasswordLabels;

    public _oldPassword: FormControl;
    public _newPassword: FormControl;
    public _confirmNewPassword: FormControl;
    @Output() passwordChanged: EventEmitter<any> = new EventEmitter();
    private _form: FormGroup;

    constructor(public formPageStateService: FormPageStateService,
                protected elementRef: ElementRef,
                protected currentDataService: CompanyCurrentDataService,
                protected fieldValidationErrorService: FieldValidationErrorService,
                protected _fb: FormBuilder,
                public errorService: ErrorService) {
        super(formPageStateService, elementRef, errorService);
    }


    getForm(): FormGroup {
        return this._form;
    }

    ngOnInit(): void {

        this._oldPassword = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OldPassword)(c), c => CustomValidator.maxLength(this.Labels.OldPassword, this.PASSWORD_MAX_LENGTH)(c)]));
        this._newPassword = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.NewPassword)(c),
            c => PasswordValidator.validateStrength(this.Labels.NewPassword)(c)]));
        this._confirmNewPassword = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.ConfirmNewPassword)(c), c => CustomValidator.maxLength(this.Labels.ConfirmNewPassword, this.PASSWORD_MAX_LENGTH)(c),
            c => {
                return this._newPassword && this._newPassword.value !== c.value ? {'mustBeTheSame': new FormValidatorMustBeTheSameErrorModel(this.Labels.ConfirmNewPassword, this.Labels.NewPassword)} : null;
            }]));

        this._form = this._fb.group({
            oldPassword: this._oldPassword,
            newPassword: this._newPassword,
            confirmNewPassword: this._confirmNewPassword
        });

        this.subscriptions.add(
            this._newPassword.valueChanges.subscribe(result => {
                this._confirmNewPassword.updateValueAndValidity();
            })
        );
        this.wsKeyFormControlNameMap = new Map([
            ['password', 'oldPassword'],
            ['newPassword', 'newPassword']
        ]);
    }

    protected onReInit() {
        this._oldPassword.reset(null, {emitEvent: false});
        this._newPassword.reset(null, {emitEvent: false});
        this._confirmNewPassword.reset(null, {emitEvent: false});
        this.getForm().markAsPristine();
    }

    protected onSubmit(value) {
        this.subscriptions.add(
            this.currentDataService.changePasswordForCurrentUser(value.oldPassword, value.newPassword)
                .pipe(finalize(() =>
                    this.afterSubmit()))
                .subscribe(
                    success => {
                        this.errorService.alertService.showSuccess('Success', 'Password Changed');
                        this.passwordChanged.emit();
                    }, error => {
                        this.fieldValidationErrorService.error(error, this);
                    }
                )
        );
    }
}
