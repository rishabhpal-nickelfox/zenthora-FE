import {Component, ElementRef, Inject, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomerPreFilledLoginModalLabels} from "./customer-pre-filled-login-modal-labels";
import {FormPageComponent} from "../../../../../../common/src/lib/pages/form-page.component";
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../../common/src/lib/utils/base-settings-provider.service";
import {RecaptchaService} from "../../../../../../common/src/lib/utils/recaptcha.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerService} from "../../../../services/customer.service";
import {finalize} from "rxjs/operators";
import {CustomValidator} from "../../../../../../common/src/lib/helpers/custom.validator";
import {RecaptchaActionEnum} from "../../../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {PasswordValidator} from "../../../../../../common/src/lib/helpers/password.validator";
import {CustomerSettingsProvider} from "../../../../services/customer-settings-provider.service";


@Component({
  standalone: false,
  selector: 'app-customer-pre-filled-login-modal',
  templateUrl: './customer-pre-filled-login-modal.component.html',
  styleUrls: ['../../../../../../common/src/lib/modals/external-modal.scss', './customer-pre-filled-login-modal.component.scss']
})
export class CustomerPreFilledLoginModal extends FormPageComponent implements OnInit, OnDestroy {

  _email = new FormControl<string>(null);
  _password = new FormControl<string>(null);
  readonly Labels = CustomerPreFilledLoginModalLabels;
  readonly MAX_LENGTH = {
    PASSWORD: PasswordValidator.MAX_LENGTH
  }
  private form = this._fb.group<CustomerPreFilledLoginFormGroupModel>({
    email: this._email,
    password: this._password
  });

  constructor(public formPageStateService: FormPageStateService, protected element: ElementRef, protected _fb: FormBuilder, protected activeModal: NgbActiveModal, protected customerService: CustomerService,
              public errorService: ErrorService, public settingsProvider: CustomerSettingsProvider, private recaptchaService: RecaptchaService) {
    super(formPageStateService, element, errorService);
  }

  getForm(): FormGroup<CustomerPreFilledLoginFormGroupModel> {
    return this.form;
  }

  ngOnInit() {
    this._password.setValidators(Validators.compose([c => CustomValidator.required(this.Labels.Password)(c), c => CustomValidator.maxLength(this.Labels.Password, this.MAX_LENGTH.PASSWORD)(c)]));
  }

  protected onReInit(newData: CustomerPreFilledLoginModel) {
    this._email.reset({value: newData.email, disabled: true});
    this._password.reset(null);
    this._password.markAsPristine();
  }

  protected onSubmit({value}: { value: CustomerPreFilledLoginFormGroupModel }) {
    const login = (recaptchaToken?: string) => this.subscriptions.add(
      this.customerService.loginAndGetCompanies(this._email.value, this._password.value, recaptchaToken)
        .pipe(finalize(() => this.afterSubmit()))
        .subscribe(
          response => {
            this.activeModal.close();
          }
        ));
    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.CUSTOMER_LOGIN, login);
    } else {
      login();
    }
  }
}

export class CustomerPreFilledLoginModel {
  email: string;
  password: string;

  constructor(email: string) {
    this.email = email;
  }
}

interface CustomerPreFilledLoginFormGroupModel {
  email: FormControl<string>;
  password: FormControl<string>;
}
