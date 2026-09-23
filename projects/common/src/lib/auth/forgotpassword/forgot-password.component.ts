import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AutoScrollingFormPageComponent} from '../../pages/auto-scrolling-form-page.component';
import {FormPageStateService} from '../../utils/form-page-state.service';
import {ForgotPasswordLabels} from './forgot-password-labels';
import {CustomValidator} from '../../helpers/custom.validator';
import {ErrorService} from "../../utils/errorhandler/error.service";
import {ServerErrorService} from "../../utils/server-error.service";


@Component({
  standalone: false,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../common-auth.component.scss'],
  outputs: ['cancelEvent'],
  providers: [FormPageStateService]
})

export class ForgotPasswordComponent extends AutoScrollingFormPageComponent implements OnInit {

  _username: FormControl;
  readonly EMAIL_MAX_LENGTH = 100;
  readonly Labels = ForgotPasswordLabels;
  @Output() sendNewPassword: EventEmitter<ForgotPasswordModel> = new EventEmitter();
  private _form: FormGroup;

  constructor(formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected _fb: FormBuilder,
              errorService: ErrorService,
              serverErrorService: ServerErrorService) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  ngOnInit(): void {
    this._username = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.Email)(c), c => CustomValidator.emailValidation(this.Labels.Email)(c), c => CustomValidator.maxLength(this.Labels.Email, this.EMAIL_MAX_LENGTH)(c)]));
    this._form = this._fb.group({
      username: this._username
    });

    this.wsKeyFormControlNameMap = new Map([
      ['email', 'username'],
      ['username', 'username']
    ]);
    super.ngOnInit();
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['email', this._username],
      ['username', this._username]
    ]);
  }

  onReInit() {
    this._username.reset(null, {emitEvent: false});
  }

  getForm(): FormGroup {
    return this._form;
  }

  onSubmit(value) {
    this.sendNewPassword.emit({
      username: this._username.value
    });
    return false;
  }

  onCancel(): boolean {
    this.cancelEvent.emit();
    return false;
  }
}

export interface ForgotPasswordModel {
  username: string;
}
