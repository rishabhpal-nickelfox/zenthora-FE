import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {UserService} from '../../../../services/usermanagement/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService} from '../../../../../../common/src/lib/utils/errorhandler/error.service';
import {EntityModel, VaultFeatures, WebhookSettings} from '../../../models/companymanage/entity.model';
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {PlatformService} from "../../../../services/platform/platform.service";
import {PlatformModel} from "../../../models/platform/platform.model";
import {CountryEnum} from "../../../../../../common/src/lib/enums/utils/county.enum";
import {VaultService} from "../../../../services/companymanagement/vault.service";
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {
  MailingMethodEnum,
  MailingMethodEnumValue
} from "../../../../../../common/src/lib/enums/companymanagement/companysettings/mailing-method.enum";
import {
  FieldValidationErrorService
} from "../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {CompanyLabels} from "./company-labels";

import cloneDeep from 'lodash/cloneDeep';
import {
  WebhookAuthTypeEnum
} from "../../../../../../common/src/lib/enums/companymanagement/platform/webhook-auth-type.enum";
import {WebhookSettingsViewModel} from "./webhook/company-webhook-component";
import {
  CountryISO,
  CountryISOEnum,
  CountryISOShort
} from "../../../../../../common/src/lib/enums/utils/country-iso.enum";
import {USStateEnum, USStateEnumValue} from "../../../../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum, CAStateEnumValue} from "../../../../../../common/src/lib/enums/utils/ca-state.enum";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {deepEqual, isDefined} from '../../../../../../common/src/lib/helpers/object.helper';
import {NumberHelper} from "../../../../../../common/src/lib/helpers/number.helper";
import {CustomValidator} from "../../../../../../common/src/lib/helpers/custom.validator";
import {finalize, pairwise, startWith} from "rxjs/operators";
import {WebhookEventEnum} from "../../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {WebhookUiKeyService} from "../../../../services/webhook/webhook-ui-key.service";
import {Observable} from "rxjs";
import {PaymentMethodTypeEnumValue} from "../../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {UserLabels} from "../../usermanagement/user/user-labels";
import {
  PrivateSmtpSecurityMode, PrivateSmtpSecurityModeDefaultPort,
  PrivateSmtpSecurityModeValue
} from "../../../../enums/companymanagement/private-smtp-security-mode.enum";

@Component({
  standalone: false,
  selector: 'app-companymanage-createeditentity',
  templateUrl: './company-create-edit.component.html',
  styleUrls: ['./company-create-edit.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class CompanyManageCreateEditEntityComponent extends AutoScrollingFormPageComponent implements OnInit {
  entity: EntityModel;
  wsKeyFormControlNameMap;
  _webhookSettings: FormControl;
  vaultFeatures: VaultFeatures;

  protected readonly CountryISOShort = CountryISOShort;


  protected readonly CountryISOEnum = CountryISOEnum;
  protected readonly CountryISO = CountryISO;

  protected readonly USStateEnum = USStateEnum;
  protected readonly CAStateEnumValue = CAStateEnumValue;
  protected readonly USStateEnumValue = USStateEnumValue;
  protected readonly CAStateEnum = CAStateEnum;
  protected readonly PrivateSmtpSecurityMode = PrivateSmtpSecurityMode;
  protected readonly PrivateSmtpSecurityModeValue = PrivateSmtpSecurityModeValue;

  readonly MailingMethodEnumValue = MailingMethodEnumValue;
  readonly Labels = CompanyLabels;
  readonly MAX_LENGTH = {
    LEGAL_NAME: 100,
    DISPLAY_NAME: 100,
    STREET: 100,
    CITY: 100,
    EMAIL: 100,
    WEBSITE: 1000,
    FROM: 100,
    SERVER: 100,
    PORT: 100,
    USER: 100,
    PASSWORD: 100,
    VAULT_AUTH_KEY: 100,
    VAULT_COMPANY_ID: 10,
    PAYMENT_FORMS_COMPANY_ID: 100,
    VAULT_USER_ID: 10,
    ZIP: 20
  };
  readonly MAX_VALUE = {
    TOKEN_LIMIT: NumberHelper.MAX_INT,
    MAX_USERS_IN_COMPANY: NumberHelper.MAX_INT,
    MAX_CUSTOMER_USERS_IN_CUSTOMER: NumberHelper.MAX_INT,
    VAULT_COMPANY_ID: NumberHelper.MAX_INT,
    VAULT_USER_ID: NumberHelper.MAX_INT
  }
  private readonly PAYMENT_FORM_PATTERN = '^[A-Za-z0-9-]+$';
  zipMask = {
    mask: rawValue => this.MASK.COUNTRY_ZIP(rawValue, this.country), guide: false
  };
  private administrator: { id: number, email: string };
  private platform: PlatformModel;
  private companyForm: FormGroup;
  private previousSecurityMode: PrivateSmtpSecurityMode;

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, protected userService: UserService, protected alertService: AlertService, protected _fb: FormBuilder, public errorService: ErrorService, private fieldValidationService: FieldValidationErrorService, private platformService: PlatformService, protected vaultService: VaultService,
              protected webhookUiKeyService: WebhookUiKeyService,
              protected ch: ChangeDetectorRef) {
    super(formPageStateService, elementRef, errorService);
  }

  get connectLocked(): boolean {
    const formValue = this.companyForm.getRawValue();
    return !isDefined(formValue.platform)
      || !isDefined(formValue.vault.companyId)
      || !isDefined(formValue.vault.userId)
      || !isDefined(formValue.vault.authKey);
  }

  protected connecting = false;

  get isCreateMode() {
    return !this.isEditMode;
  }

  get isEditMode() {
    return isDefined(this.entity?.id) && isDefined(this.entity.id);
  }

  get paymentFormsEnabled(): boolean {
    return this.vaultFeatures?.paymentFormsFeatureEnabled === true;
  }

  get companyId() {
    return (isDefined(this.entity) && isDefined(this.entity.id)) ? this.entity.id : -1;
  }

  get showSmtpFields() {
    return this.getForm()?.controls.mailingMethod.value == MailingMethodEnum.PRIVATE_SMTP;
  }

  private _platformWebhookAuthType: WebhookAuthTypeEnum = null;

  get platformWebhookAuthType(): WebhookAuthTypeEnum {
    return this._platformWebhookAuthType;
  }

  private _platformTrusted: boolean = null;

  get showCompanyWebhookSettings(): boolean {
    return isDefined(this._platformWebhookAuthType) && this._platformTrusted !== true;
  }

  private _platformCustomerRegistrationOnCheckoutPageEnabled: boolean = null;

  get platformCustomerRegistrationOnCheckoutPageEnabled(): boolean {
    return this._platformCustomerRegistrationOnCheckoutPageEnabled;
  }

  get hasEmailOptions(): boolean {
    return this.getForm()?.controls.emailSale.getRawValue() == true || this.getForm()?.controls.emailReceipt.getRawValue() == true;
  }

  private _isEmailReceiptEditable = false;

  get isEmailReceiptEditable(): boolean {
    return this._isEmailReceiptEditable;
  }

  set isEmailReceiptEditable(value: boolean) {
    this._isEmailReceiptEditable = value;
    this.getControls().mailingMethod.updateValueAndValidity();
  }

  private get country() {
    return this.getForm() ? this.getForm().get('address.country').value : null;
  }

  ngOnInit(): void {
    this.entity = new EntityModel();
    this.initForm();

    this.wsKeyFormControlNameMap = new Map([['platformId', 'platform'],
      ['platformName', 'platform'],
      ['legalName', 'legalName'],
      ['displayName', 'displayName'],
      ['logo', 'logo'],
      ['contactInfo.phone', 'contactInfo.phone'],
      ['contactInfo.email', 'contactInfo.email'],
      ['contactInfo.website', 'contactInfo.website'],
      ['address.street', 'address.street'],
      ['address.city', 'address.city'],
      ['address.state', 'address.state'],
      ['address.country', 'address.country'],
      ['address.zip', 'address.zip'],
      ['userAdminId', 'administrator'],
      ['vault.companyId', 'vault.companyId'],
      ['paymentFormsCompanyId', 'paymentFormsCompanyId'],
      ['vault.userId', 'vault.userId'],
      ['vault.authKey', 'vault.authKey'],
      ['globalPaymentsEnabled', 'globalPaymentsEnabled'],
      ['customerRegistrationOnCheckoutPageEnabled', 'customerRegistrationOnCheckoutPageEnabled'],
      ['emailReceipt', 'emailReceipt'],
      ['mailingMethod', 'mailingMethod'],
      ['privateSmtp.from', 'privateSmtp.from'],
      ['privateSmtp.server', 'privateSmtp.server'],
      ['privateSmtp.securityMode', 'privateSmtp.securityMode'],
      ['privateSmtp.port', 'privateSmtp.port'],
      ['privateSmtp.user', 'privateSmtp.user'],
      ['privateSmtp.password', 'privateSmtp.password'],
      ['tokenLimit', 'tokenLimit'],
      ['maxUsersInCompany', 'maxUsersInCompany'],
      ['maxCustomerUsersInCustomer', 'maxCustomerUsersInCustomer']
    ]);
  }

  initForm() {
    this.companyForm = this._fb.group({
      platform: [null, Validators.compose([c => CustomValidator.required(this.Labels.PlatformName)(c)])],
      legalName: [null, Validators.compose([c => CustomValidator.required(this.Labels.LegalName)(c), c => CustomValidator.maxLength(this.Labels.LegalName, this.MAX_LENGTH.LEGAL_NAME)(c)])],
      displayName: [null, Validators.compose([c => CustomValidator.required(this.Labels.DisplayName)(c), c => CustomValidator.maxLength(this.Labels.DisplayName, this.MAX_LENGTH.DISPLAY_NAME)(c)])],
      logo: [null, Validators.compose([])],
      administrator: [null],
      contactInfo: this._fb.group({
        phone: [null, Validators.compose([c => CustomValidator.required(this.Labels.Phone)(c), c => CustomValidator.addIf(c => CustomValidator.phoneValidation(this.Labels.Phone)(c), this.isCreateMode)(c)])],
        email: [null, Validators.compose([c => CustomValidator.required(this.Labels.Email)(c), c => CustomValidator.emailValidation(this.Labels.Email)(c), c => CustomValidator.maxLength(this.Labels.Email, this.MAX_LENGTH.EMAIL)(c)])],
        website: [null, Validators.compose([c => CustomValidator.urlValidation(this.Labels.Website)(c), c => CustomValidator.maxLength(this.Labels.Website, this.MAX_LENGTH.WEBSITE)(c)])]
      }),
      globalPaymentsEnabled: [false],
      customerRegistrationOnCheckoutPageEnabled: [false],
      address: this._fb.group({
        street: [null, Validators.compose([c => CustomValidator.required(this.Labels.Street)(c), c => CustomValidator.maxLength(this.Labels.Street, this.MAX_LENGTH.STREET)(c)])],
        city: [null, Validators.compose([c => CustomValidator.required(this.Labels.City)(c), c => CustomValidator.maxLength(this.Labels.City, this.MAX_LENGTH.CITY)(c)])],
        country: [CountryISOEnum.US, Validators.compose([c => CustomValidator.required(this.Labels.Country)(c)])],
        state: [null, Validators.compose([c => CustomValidator.required(this.Labels.State)(c)])],
        zip: [null, Validators.compose([c => CustomValidator.required(this.Labels.Zip)(c), c => CustomValidator.maxLength(this.Labels.Zip, this.country)(c)])]
      }),
      emailSale: [{value: null, disabled: true}],
      emailReceipt: [false],
      mailingMethod: [MailingMethodEnum.SENDGRID, Validators.compose([c => CustomValidator.required(this.Labels.MailingMethod)(c)])],
      privateSmtp: this._fb.group({
        from: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.FromAddress)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.FromAddress, this.MAX_LENGTH.FROM)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.emailRegularOrNamedValidation(this.Labels.FromAddress)(c), this.showSmtpFields)(c)])],
        server: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.SMTPServer)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.SMTPServer, this.MAX_LENGTH.SERVER)(c), this.showSmtpFields)(c)])],
        securityMode: [PrivateSmtpSecurityMode.STARTTLS, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.SecurityMode)(c), this.showSmtpFields)(c)])],
        port: [PrivateSmtpSecurityModeDefaultPort.get(PrivateSmtpSecurityMode.STARTTLS), Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.Port)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.Port, this.MAX_LENGTH.PORT)(c), this.showSmtpFields)(c)])],
        user: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.User)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.User, this.MAX_LENGTH.USER)(c), this.showSmtpFields)(c)])],
        password: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.Password)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.Password, this.MAX_LENGTH.PASSWORD)(c), this.showSmtpFields)(c)])]
      }),
      vault: this._fb.group({
        companyId: [null, Validators.compose([c => CustomValidator.required(this.Labels.VaultCompanyID)(c), c => CustomValidator.max(this.Labels.VaultCompanyID, this.MAX_VALUE.VAULT_COMPANY_ID)(c)])],
        userId: [null, Validators.compose([c => CustomValidator.required(this.Labels.VaultUserID)(c), c => CustomValidator.max(this.Labels.VaultUserID, this.MAX_VALUE.VAULT_USER_ID)(c)])],
        authKey: [null, Validators.compose([c => CustomValidator.required(this.Labels.VaultAuthorizationKey)(c), c => CustomValidator.maxLength(this.Labels.VaultAuthorizationKey, this.MAX_LENGTH.VAULT_AUTH_KEY)(c)])]
      }),
      paymentFormsCompanyId: [null, Validators.compose([
        c => CustomValidator.maxLength(this.Labels.CompanyIdForPaymentForms, this.MAX_LENGTH.PAYMENT_FORMS_COMPANY_ID)(c),
        c => CustomValidator.pattern(this.Labels.CompanyIdForPaymentForms, this.PAYMENT_FORM_PATTERN)(c),
        c => CustomValidator.addIf(
          () => CustomValidator.required(this.Labels.CompanyIdForPaymentForms)(c),
          this.paymentFormsEnabled
        )(c)
      ])],
      tokenLimit: [null, Validators.compose([c => CustomValidator.max(this.Labels.TokenLimit, this.MAX_VALUE.TOKEN_LIMIT)(c)])],
      maxUsersInCompany: [25, Validators.compose([c => CustomValidator.max(this.Labels.MaxUsersInCompany, this.MAX_VALUE.MAX_USERS_IN_COMPANY)(c), c => CustomValidator.minValueStrict(this.Labels.MaxUsersInCompany, 0)(c)])],
      maxCustomerUsersInCustomer: [25, Validators.compose([c => CustomValidator.max(this.Labels.MaxCustomerUsersInCustomer, this.MAX_VALUE.MAX_CUSTOMER_USERS_IN_CUSTOMER)(c), c => CustomValidator.minValueStrict(this.Labels.MaxCustomerUsersInCustomer, 0)(c)])]
    });

    this._webhookSettings = new FormControl({
        webhookSettings: null,
        platformWebhookAuthType: null
      }
    );

    this.addValueChangeListeners();
  }

  connectToVault() {
    if (!this.connectLocked) {
      this.getForm().get('vault.companyId').markAsDirty({onlySelf: true});
      this.getForm().get('vault.userId').markAsDirty({onlySelf: true});
      this.getForm().get('vault.authKey').markAsDirty({onlySelf: true});
      this.connecting = true;
      this.subscriptions.add(
        this.vaultService.connect(
          this.entity.id,
          this.platformId,
          this.getForm().get('vault.companyId').value,
          this.getForm().get('vault.userId').value,
          this.getForm().get('vault.authKey').value
        ).pipe(finalize(() => {
          this.connecting = false;
          this.ch.detectChanges();
        }))
          .subscribe(result => {
              this.alertService.showSuccess(this.Labels.ConnectToVaultHeader, this.Labels.ConnectToVaultBody);
              console.log(result);
              this.vaultFeatures = result;
              if (!this.paymentFormsEnabled) {
                this.getForm().controls.paymentFormsCompanyId.reset();
              }
              this.getForm().controls.paymentFormsCompanyId.updateValueAndValidity();
            }
          ));
    }
    return false;
  }

  getForm(): FormGroup {
    return this.companyForm;
  }

  onSubmit(value) {
    this.saveEvent.emit(this.value);
    return false;
  }

  getWSKeyFormControlNameMap(): Map<string, string> {
    return this.wsKeyFormControlNameMap;
  }

  searchUser = (email, page) => {
    return this.userService.getCandidates(email ? email : '', page);
  }

  userFormatter = (x) => {
    return x.email;
  }

  searchPlatform = (name, page) => {
    return this.platformService.getCandidates(name ? name : '', page);
  }

  platformFormatter = (x) => {
    return x.name;
  }

  selectAdministrator(admin) {
    this.administrator = admin;
    this.companyForm.controls.administrator.updateValueAndValidity();
  }

  onAdministratorBlur() {
    this.getControls().administrator.markAsDirty();
    this.getControls().administrator.updateValueAndValidity();
  }

  selectPlatform(platform: PlatformModel) {
    this.platform = platform;

    this.getControls().platform.updateValueAndValidity();
    this._platformWebhookAuthType = platform ? platform.webhookAuthType : null;
    this._platformTrusted = platform ? platform.trusted : null;
    this._platformCustomerRegistrationOnCheckoutPageEnabled = platform ? platform.customerRegistrationOnCheckoutPageEnabled : null;
    this.updateEmailSale(platform ? platform.emailSale : null)
    this.updateEmailReceiptEditable(platform ? platform.emailReceipt : null);
    this.updateWebhookSettings(null, platform ? platform.webhookEvents : [], []);
  }

  onPlatformBlur() {
    this.getControls().platform.markAsDirty();
    this.getControls().platform.updateValueAndValidity();
  }

  onApiTokenSubmit(event) {
    event.stopPropagation();
  }

  protected onReInit(entity: EntityModel) {
    this.entity = entity;
    this.vaultFeatures = entity.features;
    this.administrator = {id: null, email: ''};

    if (this.isEditMode) {
      this._platformCustomerRegistrationOnCheckoutPageEnabled = entity.platformCustomerRegistrationOnCheckoutPageEnabled;
      this.updateFormValues();
      this.getForm().controls.paymentFormsCompanyId.updateValueAndValidity();
      this.getForm().markAsPristine();
    }
  }

  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  private updateFormValues() {
    const companyCountry = isDefined(this.entity.address.country) && this.enumKeys(CountryEnum).find(key => key === this.entity.address.country) ? this.entity.address.country : CountryEnum.US;
    const companyZIP = isDefined(this.entity.address.zip) ? this.MASK.transformValueToMaskedValue(this.entity.address.zip, this.MASK.COUNTRY_ZIP(this.entity.address.zip, CountryEnum[companyCountry])) : null;
    this._platformWebhookAuthType = this.entity.platformWebhookAuthType;
    this._platformTrusted = this.entity.platformTrusted;

    this.companyForm.patchValue({
      platform: {id: this.entity.platformId, name: this.entity.platformName},
      legalName: this.entity.legalName,
      displayName: this.entity.displayName,
      logo: this.entity.logo,
      administrator: null,
      globalPaymentsEnabled: this.entity.globalPaymentsEnabled,
      customerRegistrationOnCheckoutPageEnabled: this.entity.customerRegistrationOnCheckoutPageEnabled,
      address: {
        street: this.entity.address.street,
        city: this.entity.address.city,
        country: companyCountry,
        state: this.entity.address.state,
        zip: companyZIP
      },
      contactInfo: {
        phone: this.entity.contactInfo.phone,
        email: this.entity.contactInfo.email,
        website: this.entity.contactInfo.website
      },
      emailSale: this.entity.emailSale,
      emailReceipt: this.entity.emailReceipt,
      mailingMethod: this.entity.mailingMethod ? this.entity.mailingMethod : MailingMethodEnum.SENDGRID,
      privateSmtp: {
        from: this.entity.privateSmtp.from,
        server: this.entity.privateSmtp.server,
        securityMode: this.entity.privateSmtp.securityMode,
        port: this.entity.privateSmtp.port,
        user: this.entity.privateSmtp.user,
        password: this.entity.privateSmtp.password
      },
      vault: {
        companyId: this.entity.vault.companyId,
        userId: this.entity.vault.userId,
        authKey: this.entity.vault.authKey,
      },
      paymentFormsCompanyId: this.entity.paymentFormsCompanyId,
      tokenLimit: this.entity.tokenLimit,
      maxUsersInCompany: this.entity.maxUsersInCompany,
      maxCustomerUsersInCustomer: this.entity.maxCustomerUsersInCustomer
    }, {emitEvent: false});

    this.updateEmailReceiptEditable(this.entity.isEmailReceiptEditable);
    this.updateWebhookSettings(this.entity.webhookSettings, this.entity.platformWebhookEvents, this.entity.suppressedWebhookEvents);
    this.previousSecurityMode = this.getForm().get('privateSmtp.securityMode').value;
  }

  private updateWebhookSettings(settings: WebhookSettings, platformWebhookEvents: WebhookEventEnum[], suppressedWebhookEvents: WebhookEventEnum[]) {
    const webhookSettingsViewModel: WebhookSettingsViewModel = {
      webhookSettings: this.platformWebhookAuthType == WebhookAuthTypeEnum.OAUTH_1_0 ? WebhookSettings.withOAuth10(settings?.oAuth10Settings)
        : this.platformWebhookAuthType == WebhookAuthTypeEnum.HMAC_SHA256 ? WebhookSettings.withHmacSha256(settings?.hmacSha256Settings)
          : null,
      platformWebhookAuthType: this.platformWebhookAuthType,
      platformId: this.platformId,
      platformWebhookEvents: platformWebhookEvents,
      suppressedWebhookEvents: suppressedWebhookEvents,
    }

    this._webhookSettings.reset(webhookSettingsViewModel);

    if (this.showCompanyWebhookSettings && !this.getForm().contains('webhookSettings')) {
      this.getForm().addControl('webhookSettings', this._webhookSettings);
    } else if (!this.showCompanyWebhookSettings && this.getForm().contains('webhookSettings')) {
      this.getForm().removeControl('webhookSettings');
    }
    this.ch.detectChanges();
  }


  private updateEmailSale(value: boolean) {
    this.getControls().emailSale.setValue(value);
    this.getControls().mailingMethod.updateValueAndValidity();

  }

  private updateEmailReceiptEditable(value: boolean) {
    this.isEmailReceiptEditable = value;
    if (this.isEmailReceiptEditable) {
      this.getForm().controls.emailReceipt.enable({emitEvent: false});
    } else {
      this.getForm().controls.emailReceipt.disable({emitEvent: false});
    }
  }

  private addValueChangeListeners() {
    this.getForm().controls.mailingMethod.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
        if (prev != next) {
          this.getForm().controls.privateSmtp.reset({
            from: null, server: null, securityMode: PrivateSmtpSecurityMode.STARTTLS, port: PrivateSmtpSecurityModeDefaultPort.get(PrivateSmtpSecurityMode.STARTTLS), user: null, password: null
          });
        }
      });

    this.subscriptions.add(this.getForm().get('address.country').valueChanges.subscribe(() => {
      this.getForm().get('address.zip').markAsDirty();
      this.getForm().get('address.zip').updateValueAndValidity();
    }));

    this.subscriptions.add(this.getForm().controls.emailReceipt.valueChanges
      .subscribe(value => {
        this.getForm().controls.mailingMethod.updateValueAndValidity();
      }));

    this.addPrivateSmtpSecurityModeListener();
  }


  private addPrivateSmtpSecurityModeListener(): void {
    this.previousSecurityMode = this.getForm().get('privateSmtp.securityMode').value;

    this.subscriptions.add(
      this.getForm().get('privateSmtp.securityMode').valueChanges.subscribe((newMode: PrivateSmtpSecurityMode) => {
        const currentPort = this.getForm().get('privateSmtp.port').value;
        const prevDefaultPort = PrivateSmtpSecurityModeDefaultPort.get(this.previousSecurityMode);
        if (currentPort == prevDefaultPort) {
          this.getForm().get('privateSmtp.port').setValue(PrivateSmtpSecurityModeDefaultPort.get(newMode), { emitEvent: false });
        }
        this.previousSecurityMode = newMode;
      })
    );
  }

  get platformId(): number {
    return this.getForm().controls.platform.value?.id;
  }

  get value(): { entity: EntityModel, administrator: { id: number, email: string } } {
    const formValue = this.getForm().getRawValue();
    const entity: EntityModel = cloneDeep(this.entity);
    entity.platformId = formValue.platform.id;
    entity.platformName = formValue.platform.name
    entity.legalName = formValue.legalName;
    entity.displayName = formValue.displayName;
    entity.logo = formValue.logo;
    entity.address = formValue.address;
    entity.contactInfo = formValue.contactInfo;
    entity.emailReceipt = formValue.emailReceipt;
    entity.mailingMethod = formValue.mailingMethod;
    entity.privateSmtp = formValue.privateSmtp;
    entity.vault = formValue.vault;
    entity.features = this.vaultFeatures;
    entity.paymentFormsCompanyId = this.paymentFormsEnabled ? formValue.paymentFormsCompanyId : null;
    entity.tokenLimit = formValue.tokenLimit;
    if (formValue.webhookSettings) {
      entity.webhookSettings = formValue.webhookSettings.settings;
      entity.suppressedWebhookEvents = formValue.webhookSettings.suppressedWebhookEvents;
    } else if (this._platformTrusted === true) {
      entity.webhookSettings = null;
      entity.suppressedWebhookEvents = null;
    }
    entity.globalPaymentsEnabled = formValue.globalPaymentsEnabled;
    entity.customerRegistrationOnCheckoutPageEnabled = formValue.customerRegistrationOnCheckoutPageEnabled;
    entity.maxUsersInCompany = formValue.maxUsersInCompany;
    entity.maxCustomerUsersInCustomer = formValue.maxCustomerUsersInCustomer;
    return {entity: entity, administrator: this.administrator}
  }

  objectChanged(): boolean | Observable<boolean> {
    const newEntity = this.value;
    return !deepEqual(EntityModel.toJSON(newEntity.entity, newEntity.administrator ? newEntity.administrator.id : null), EntityModel.toJSON(this.entity, null));
  }

  protected readonly PaymentMethodTypeEnumValue = PaymentMethodTypeEnumValue;
  protected readonly UserLabels = UserLabels;
  protected readonly MailingMethodEnum = MailingMethodEnum;
}
