import {ActivatedRoute} from '@angular/router';
import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {catchError, finalize, map} from 'rxjs/operators';
import {CustomerCompanyInvitationLabels} from "./customer-company-invitation-labels";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {PasswordValidator} from "../../../../../../common/src/lib/helpers/password.validator";
import {
  FormValidatorMustBeTheSameErrorModel
} from "../../../../../../common/src/lib/models/common/form-validator-error.model";
import {CustomValidator} from "../../../../../../common/src/lib/helpers/custom.validator";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {CustomerService} from "../../../../services/customer.service";
import {RecaptchaService} from "../../../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {
  CustomerCompanyRegistrationDetailsResponseModel
} from "../../../../../../common/src/lib/models/payer/customer-company-registration-details-response.model";
import {UserLabels} from "../../../portal-page/users/user-labels";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../../../common/src/lib/utils/base-settings-provider.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-customer-company-invitation',
  templateUrl: './customer-company-invitation.component.html',
  styleUrls: ['./customer-company-invitation.component.scss'],
  providers: [FormPageStateService]
})
export class CustomerCompanyInvitationComponent extends AutoScrollingFormPageComponent implements OnInit {
  readonly MAX_LENGTH = {
    PASSWORD: PasswordValidator.MAX_LENGTH,
    FIRST_NAME: 100,
    LAST_NAME: 100,
    MIDDLE_NAME: 100
  }
  readonly MIN_LENGTH = {
    PASSWORD: PasswordValidator.MIN_LENGTH
  }
  protected _showSuccessMessage = false;
  protected _showErrorMessage = false;
  protected _showForm = false;
  protected _showAcceptInvitation = false;
  protected _showAlreadyRegistered = false;
  protected invitationAccepted = false;
  protected loading = true;
  protected readonly Labels = CustomerCompanyInvitationLabels;
  _password = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.Password)(c), c => PasswordValidator.validateStrength(this.Labels.Password)(c)]));
  _confirmPassword = new FormControl<string>(null, Validators.compose([c => CustomValidator.required(this.Labels.ConfirmPassword)(c), c => CustomValidator.maxLength(this.Labels.ConfirmPassword, this.MAX_LENGTH.PASSWORD)(c), c => {
    return this._password && this._password.value !== c.value ? {'mustBeTheSame': new FormValidatorMustBeTheSameErrorModel(this.Labels.ConfirmPassword, this.Labels.Password)} : null;
  }]));
  _firstName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.FirstName, this.MAX_LENGTH.FIRST_NAME)(c), c => CustomValidator.required(this.Labels.FirstName)(c)]));
  _middleName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.MiddleName, this.MAX_LENGTH.MIDDLE_NAME)(c)]));
  _lastName = new FormControl<string>(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.LastName, this.MAX_LENGTH.LAST_NAME)(c), c => CustomValidator.required(this.Labels.LastName)(c)]));

  protected email: string;
  protected legalName: string;
  protected customerName: string;
  protected emailAlreadyConfirmed: boolean;
  private token: string;
  private _form = this._fb.group<CustomerCompanyConfirmRegistrationModel>({
    password: this._password,
    confirmPassword: this._confirmPassword,
    firstName: this._firstName,
    middleName: this._middleName,
    lastName: this._lastName
  });

  constructor(public formPageStateService: FormPageStateService, protected element: ElementRef, protected _fb: FormBuilder, protected customerService: CustomerService,
              public errorService: ErrorService, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, private recaptchaService: RecaptchaService, @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, protected router: ActivatedRoute, private ch: ChangeDetectorRef) {
    super(formPageStateService, element, errorService);
  }


  ngOnInit(): void {
    this.token = this.router.snapshot.paramMap.get('token');
    this.loading = true;
    this.subscriptions.add(
      this.customerService.getCompanyInvitationDetails(this.token).pipe(finalize(() => {
        this.loading = false;
        this.ch.detectChanges();
      })).pipe(catchError(error => {
        this.showErrorMessage()
        throw error;
      })).pipe(map(response => {
        this.email = response.customer.email;
        this.legalName = response.legalName;
        this.customerName = response.customerName;
        this.emailAlreadyConfirmed = response.customer.emailAlreadyConfirmed;
        if (!this.emailAlreadyConfirmed) {
          this.showForm(response)
        } else if (response.invitationPending) {
          this.showAcceptInvitation();
        } else {
          this.showAlreadyRegistered();
        }
      })).subscribe());

    this.subscriptions.add(this._password.valueChanges.subscribe(result => {
      this._confirmPassword.updateValueAndValidity();
    }));

  }

  getForm(): FormGroup {
    return this._form;
  }

  protected onReInit() {
    this._form.reset();
  }


  protected onSubmit({value}: { value: any }) {
    return this.invite();
  }

  protected redirect() {
    this.routingService.navigateLoginPageAndBroadcast();
  }

  protected invite() {
    this.loading = true;

    const companyInvitation = (token?: string) => this.subscriptions.add(
      this.customerService.companyNewInvitation(this.token, this._firstName.value, this._middleName.value, this._lastName.value, this._password.value, token)
        .pipe(finalize(() => {
          this.loading = false;
          this.afterSubmit();
          this.ch.detectChanges();
        })).pipe(map(response => {
        this.errorService.showSuccess('Success', '');
        this.showSuccessMessage();
      })).subscribe());

    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.CUSTOMER_CHANGE_PASSWORD, companyInvitation);
    } else {
      companyInvitation();
    }
    return false;
  }

  protected acceptInvitation() {
    return this.consumeInvitation(() => {
      this.errorService.showSuccess('Success', '');
      this.invitationAccepted = true;
      this.showSuccessMessage();
    });
  }

  protected openPortal() {
    return this.consumeInvitation(() => this.redirect());
  }

  private consumeInvitation(onSuccess: () => void) {
    this.loading = true;

    const acceptInvitation = (token?: string) => this.subscriptions.add(
      this.customerService.acceptCompanyInvitation(this.token, token)
        .pipe(finalize(() => {
          this.loading = false;
          this.ch.detectChanges();
        })).pipe(catchError(error => {
        this.showErrorMessage();
        throw error;
      })).pipe(map(() => onSuccess())).subscribe());

    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.CUSTOMER_COMPANY_INVITE, acceptInvitation);
    } else {
      acceptInvitation();
    }
    return false;
  }

  private showSuccessMessage() {
    this._showForm = false;
    this._showAcceptInvitation = false;
    this._showAlreadyRegistered = false;
    this._showErrorMessage = false;
    this._showSuccessMessage = true;
  }

  private showAcceptInvitation() {
    this._showForm = false;
    this._showAcceptInvitation = true;
    this._showAlreadyRegistered = false;
    this._showErrorMessage = false;
    this._showSuccessMessage = false;
  }

  private showAlreadyRegistered() {
    this._showForm = false;
    this._showAcceptInvitation = false;
    this._showAlreadyRegistered = true;
    this._showErrorMessage = false;
    this._showSuccessMessage = false;
  }

  private showForm(details: CustomerCompanyRegistrationDetailsResponseModel) {
    this._showForm = true;
    this._showAcceptInvitation = false;
    this._showAlreadyRegistered = false;
    this._form.reset(
      {
        password: null,
        confirmPassword: null,
        firstName: details.customer.firstName,
        middleName: details.customer.middleName,
        lastName: details.customer.lastName,
      }, {emitEvent: false}
    )
    this._showErrorMessage = false;
    this._showSuccessMessage = false;
  }

  private showErrorMessage() {
    this._showForm = false;
    this._showAcceptInvitation = false;
    this._showAlreadyRegistered = false;
    this._showErrorMessage = true;
    this._showSuccessMessage = false;
  }

  protected readonly UserLabels = UserLabels;
}

interface CustomerCompanyConfirmRegistrationModel {
  firstName: FormControl<string>;
  middleName: FormControl<string>;
  lastName: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}
