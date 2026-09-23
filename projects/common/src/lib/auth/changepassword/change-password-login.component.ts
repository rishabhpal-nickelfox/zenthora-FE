import {Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {ChangePasswordLoginLabels} from './change-password-login-labels';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormPageStateService} from "../../utils/form-page-state.service";
import {FieldValidationErrorService} from "../../utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../utils/errorhandler/error.service";
import {CustomValidator} from "../../helpers/custom.validator";
import {FormValidatorMustBeTheSameErrorModel} from "../../models/common/form-validator-error.model";
import {FormPageComponent} from "../../pages/form-page.component";
import {PasswordValidator} from "../../helpers/password.validator";

@Component({
  standalone: false,
  selector: 'app-change-password-login',
  templateUrl: './change-password-login.component.html',
  styleUrls: ['../common-auth.component.scss', 'change-password-login.component.scss'],
  outputs: ['cancelEvent']
})
export class ChangePasswordLoginComponent extends FormPageComponent {

  readonly Labels = ChangePasswordLoginLabels;
  public readonly PASSWORD_MAX_LENGTH = PasswordValidator.MAX_LENGTH;
  public _oldPassword: FormControl;
  public _newPassword: FormControl;
  public _confirmNewPassword: FormControl;
  @Output() changePassword: EventEmitter<ChangePasswordModel> = new EventEmitter();
  private _form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected fieldValidationErrorService: FieldValidationErrorService,
              protected _fb: FormBuilder,
              public errorService: ErrorService) {
    super(formPageStateService, elementRef, errorService);
  }

  onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  getForm(): FormGroup {
    return this._form;
  }

  ngOnInit(): void {

    this._oldPassword = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OldPassword)(c), c => CustomValidator.maxLength(this.Labels.OldPassword, this.PASSWORD_MAX_LENGTH)(c)]));
    this._newPassword = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.NewPassword)(c), c => CustomValidator.maxLength(this.Labels.NewPassword, this.PASSWORD_MAX_LENGTH)(c),
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
    this.changePassword.emit(value);
    return false;
  }
}

export interface ChangePasswordModel {
  oldPassword: string;
  newPassword: string;
}
