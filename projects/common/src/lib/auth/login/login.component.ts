import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AutoScrollingFormPageComponent} from '../../pages/auto-scrolling-form-page.component';
import {FormPageStateService} from '../../utils/form-page-state.service';
import {CustomValidator} from '../../helpers/custom.validator';
import {LoginLabels} from './login-labels';
import {ErrorService} from "../../utils/errorhandler/error.service";
import {ServerErrorService} from "../../utils/server-error.service";


@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../common-auth.component.scss'],
  providers: [FormPageStateService]
})

export class LoginComponent extends AutoScrollingFormPageComponent implements OnInit {

  readonly Labels = LoginLabels;
  _username: FormControl;
  _password: FormControl;
  _rememberMe: FormControl;
  @Output() loginEvent: EventEmitter<LoginComponentModel> = new EventEmitter();
  @Output() forgotPasswordEvent: EventEmitter<any> = new EventEmitter();
  private form: FormGroup;

  constructor(formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected _fb: FormBuilder,
              errorService: ErrorService,
              serverErrorService: ServerErrorService) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  onInit(): void {
    this._username = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.Login)(c), c => CustomValidator.loginValidation(this.Labels.Login)(c), c => CustomValidator.maxLength(this.Labels.Login, 100)(c)]));
    this._password = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.Password)(c)]));
    this._rememberMe = new FormControl(true);
    this.form = this._fb.group({
      username: this._username,
      password: this._password,
      rememberMe: this._rememberMe
    });
  }


  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['email', this._username],
      ['username', this._username],
      ['login', this._username],
      ['password', this._password]
    ]);
  }


  onReInit() {
    //TODO const usernameDefault = this.authenticationService.getRememberMeValue() || '';
    const usernameDefault = '';
    this._username.reset(usernameDefault, {emitEvent: false});
    this._password.reset(null, {emitEvent: false});
    this._rememberMe.reset(true, {emitEvent: false});
    this.form.markAsPristine();
  }

  onForgotPassword() {
    this.forgotPasswordEvent.emit();
    return false;
  }

  getForm(): FormGroup {
    return this.form;
  }

  onSubmit(value) {
    this.loginEvent.emit(value);
    return false;
  }

  onCancel(): boolean {
    return false;
  }
}

export interface LoginComponentModel {
  username: string;
  password: string;
  rememberMe: boolean;
}
