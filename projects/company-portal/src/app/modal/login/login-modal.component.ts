import {Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../../services/authentication.service';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {finalize, mergeMap} from 'rxjs/operators';
import {FormPageComponent} from '../../../../../common/src/lib/pages/form-page.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyCurrentDataService} from "../../../services/company-current-data.service";
import {inactivity_login_failed_attempts} from '../../../../../../environments/environment';
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../common/src/lib/utils/base-settings-provider.service";
import {RecaptchaService} from "../../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {isDefined} from "../../../../../common/src/lib/helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['../../../../../common/src/lib/modals/external-modal.scss', './login-modal.component.scss']
})
export class LoginModalComponent extends FormPageComponent implements OnInit, OnDestroy {

  static readonly ATTEMPTS_EXCEEDED = 'attempts-exceeded';

  @Input() role;

  loginForm;
  attempts = inactivity_login_failed_attempts;

  constructor(public formPageStateService: FormPageStateService, protected element: ElementRef, protected _fb: FormBuilder, protected activeModal: NgbActiveModal, protected authenticationService: AuthenticationService, protected currentDataService: CompanyCurrentDataService, public errorService: ErrorService, private renderer: Renderer2, @Inject(SETTINGS_PROVIDER_TOKEN) public settingsProvider: BaseSettingsProvider, private recaptchaService: RecaptchaService) {
    super(formPageStateService, element, errorService);
  }

  ngOnInit(): void {
    this.onReInit();

    this.wsKeyFormControlNameMap = new Map([['username', 'username'], ['password', 'password']]);

    this.renderer.addClass(document.body, 'blurred');

    this.subscriptions.add(window.addEventListener('storage', (event) => {
      if (event.key == CompanyCurrentDataService.CURRENT_USER && isDefined(this.currentDataService.getCurrentUser())) {
        this.activeModal.dismiss();
      }
    }));
  }

  onReInit() {
    const usernameDefault = this.authenticationService.getRememberMeValue() || '';
    this.loginForm = this._fb.group({
      username: [usernameDefault, Validators.compose([Validators.required, Validators.email, Validators.maxLength(100)])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  getForm(): FormGroup {
    return this.loginForm;
  }

  onSubmit(value) {
    const login = (token?: string) => {
      this.subscriptions.add(this.authenticationService.login(value.username, value.password, null, token)
        .pipe(mergeMap(() => this.authenticationService.updateCurrentUserRoles()))
        .pipe(mergeMap(() => this.authenticationService.selectRole(this.role)))
        .pipe(finalize(() => this.afterSubmit()))
        .subscribe(success => {
          this.activeModal.close();
        }, serverError => {
          this.attempts--;
          serverError.error.attempts = this.attempts;
          if (!this.attempts) {
            this.activeModal.dismiss(LoginModalComponent.ATTEMPTS_EXCEEDED);
          }
        }));
    };
    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this.loginForm, RecaptchaActionEnum.LOGIN, login);
    } else {
      login();
    }
    return false;
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'blurred');
  }

  protected onCancel(): boolean {
    return false;
  }

}

