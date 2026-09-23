import {ChangeDetectorRef, Component, ElementRef, forwardRef, Injector} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from '@angular/forms';
import {PasswordValidator} from "../../helpers/password.validator";
import {ChangePasswordLabels} from "./change-password-labels";
import {FormGroupAsFormControlComponent} from "../formgroup/form-group-as-form-control.component";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ErrorService} from "../../utils/errorhandler/error.service";
import {ServerErrorService} from "../../utils/server-error.service";
import {FormValidatorMustBeTheSameErrorModel} from "../../models/common/form-validator-error.model";
import {CustomValidator} from "../../helpers/custom.validator";

@Component({
  standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChangePasswordComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ChangePasswordComponent,
      multi: true
    }
  ]
})
export class ChangePasswordComponent extends FormGroupAsFormControlComponent {

  public readonly PASSWORD_MAX_LENGTH = PasswordValidator.MAX_LENGTH;
  public readonly PASSWORD_MIN_LENGTH = PasswordValidator.MIN_LENGTH;

  public readonly Labels = ChangePasswordLabels;

  public _oldPassword: FormControl = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OldPassword)(c), c => CustomValidator.maxLength(this.Labels.OldPassword, this.PASSWORD_MAX_LENGTH)(c)]));
  public _newPassword: FormControl = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.NewPassword)(c),
    c => PasswordValidator.validateStrength(this.Labels.NewPassword)(c)]));
  public _confirmNewPassword: FormControl = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.ConfirmNewPassword)(c), c => CustomValidator.maxLength(this.Labels.ConfirmNewPassword, this.PASSWORD_MAX_LENGTH)(c),
    c => {
      return this._newPassword && this._newPassword.value !== c.value ? {'mustBeTheSame': new FormValidatorMustBeTheSameErrorModel(this.Labels.ConfirmNewPassword, this.Labels.NewPassword)} : null;
    }]));
  private _form: FormGroup = this._fb.group({
      oldPassword: this._oldPassword,
      newPassword: this._newPassword,
      confirmNewPassword: this._confirmNewPassword
    });

  constructor(protected elementRef: ElementRef,
              protected _fb: FormBuilder,
              public errorService: ErrorService,
              private injector: Injector,
              public serverErrorService: ServerErrorService,
              protected ch: ChangeDetectorRef) {
    super(elementRef, errorService, ch, serverErrorService);
  }


  getForm(): FormGroup {
    return this._form;
  }

  protected formValueChanges(): Observable<{ oldPassword: string, newPassword: string }> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }

  protected onReInit() {
  }


  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }


  getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['password', this._oldPassword],
      ['newPassword', this._newPassword]
    ]);
  }


  protected onInit(): void {
    this.subscriptions.add(
      this._newPassword.valueChanges.subscribe(result => {
        this._confirmNewPassword.updateValueAndValidity();
      })
    );
  }

  get value(): { oldPassword: string, newPassword: string } {
    return {oldPassword: this._oldPassword.value, newPassword: this._newPassword.value}
  }
}
