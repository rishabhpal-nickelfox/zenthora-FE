import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/usermanagement/user.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService} from '../../../../../common/src/lib/utils/errorhandler/error.service';
import {PlatformModel, PlatformTemplateSettings} from "../../models/platform/platform.model";
import {CompanyCurrentDataService} from "../../../services/company-current-data.service";
import {PlatformService} from "../../../services/platform/platform.service";
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {
  MailingMethodEnum,
  MailingMethodEnumValue
} from "../../../../../common/src/lib/enums/companymanagement/companysettings/mailing-method.enum";
import {PlatformLabels} from "./platform-labels";
import {
  WebhookAuthTypeEnum,
  WebhookAuthTypeEnumValue
} from "../../../../../common/src/lib/enums/companymanagement/platform/webhook-auth-type.enum";
import {
  WebhookCustomerEvents,
  WebhookEventEnum,
  WebhookEventEnumValue,
  WebhookPaymentDataEvents,
  WebhookPaymentEvents,
  WebhookSaleEvents
} from "../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {finalize, map, switchMap, tap} from "rxjs/operators";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";
import {deepEqual, isDefined, ObjectHelper} from '../../../../../common/src/lib/helpers/object.helper';
import {
  VaultFeatureAvailabilityEnum,
  VaultFeatureAvailabilityEnumValue
} from "../../../enums/platform/vault-feature-availability.enum";
import {Observable, of} from "rxjs";
import {
  VaultPaymentRequestTypeEnum,
  VaultPaymentRequestTypeEnumValue
} from "../../../../../common/src/lib/enums/companymanagement/platform/vault-payment-request-type-enum";
import {InvoiceTemplateModel, InvoiceEmailPaymentTemplateComponent, ReceiptTemplateEditorComponent, ReceiptTemplateModel} from "@eps/common";
import {CountryISOEnum} from "../../../../../common/src/lib/enums/utils/country-iso.enum";
import {DOMHelper} from "../../../../../common/src/lib/helpers/dom.helper";
import {BrandingModel} from "../../models/branding/branding.model";
import {UserLabels} from "../usermanagement/user/user-labels";
import {HmacSha256, OAuth10, WebhookSettings} from "../../models/companymanage/entity.model";
import {
  OAuth10SignatureMethodEnum,
  OAuth10SignatureMethodEnumValue
} from "../../../../../common/src/lib/enums/companymanagement/company/oauth-1.0-signature-method.enum";
import {WebhookService} from "../../../services/webhook/webhook.service";
import {WebhookTestConfigurationRequestModel} from "../../models/webhook/webhook-test-configuration.model";

@Component({
  standalone: false,
  selector: 'app-platform-createedit',
  templateUrl: './platform-create-edit.component.html',
  styleUrls: ['./platform-create-edit.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class PlatformCreateEditEntityComponent extends AutoScrollingFormPageComponent implements OnInit {
  platform: PlatformModel;
  wsKeyFormControlNameMap;
  readonly MailingMethodEnum = MailingMethodEnum;
  readonly MailingMethodEnumValue = MailingMethodEnumValue;
  readonly WebhookAuthTypeEnum = WebhookAuthTypeEnum;
  readonly WebhookAuthTypeEnumValue = WebhookAuthTypeEnumValue;
  readonly WebhookEventEnum = WebhookEventEnum;
  readonly WebhookSaleEvents = WebhookSaleEvents;
  readonly WebhookPaymentEvents = WebhookPaymentEvents;
  readonly WebhookPaymentDataEvents = WebhookPaymentDataEvents;
  readonly WebhookCustomerEvents = WebhookCustomerEvents;
  readonly VaultFeatureAvailabilityEnum = VaultFeatureAvailabilityEnum;
  readonly VaultFeatureAvailabilityEnumValue = VaultFeatureAvailabilityEnumValue;
  protected readonly WEBHOOK_ATTEMPTS_NUMBER = Array(10).fill(1).map((x, i) => i + 1);
  readonly Labels = PlatformLabels;
  readonly MAX_LENGTH = {
    NAME: 100,
    VAULT_PRODUCT_ID: 100,
    VAULT_EMAIL_PAYMENT_FEATURE_NAME: 100,
    VAULT_PAYMENT_FORMS_FEATURE_NAME: 100,
    VAULT_CUSTOMER_PORTAL_FEATURE_NAME: 100,
    VAULT_SURCHARGES_FEATURE_NAME: 100,
    OAUTH_10_WEBHOOK_URL: 1000,
    OAUTH_10_CONSUMER_KEY: 255,
    OAUTH_10_CONSUMER_SECRET: 255,
    OAUTH_10_ACCESS_TOKEN: 255,
    OAUTH_10_TOKEN_SECRET: 1000,
    OAUTH_10_REALM: 255,
    HMAC_SHA256_WEBHOOK_URL: 1000,
    HMAC_SHA256_SECRET: 255
  };
  readonly OAuth10SignatureMethodEnum = OAuth10SignatureMethodEnum;
  readonly OAuth10SignatureMethodEnumValue = OAuth10SignatureMethodEnumValue;
  _name = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.PlatformName)(c),
      c => CustomValidator.maxLength(this.Labels.PlatformName, this.MAX_LENGTH.NAME)(c)
    ])
  );
  _trusted = new FormControl(false);
  _epsCheckout = new FormControl(false);
  _customerRegistrationOnCheckoutPageEnabled = new FormControl(false);
  _sendgridSettingsId = new FormControl(null);
  _brandingId = new FormControl(null, c => CustomValidator.required(this.Labels.Branding)(c));
  _emailSale = new FormControl(false);
  _emailReceipt = new FormControl(false);
  _vaultProductId = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.VaultProductId)(c),
      c => CustomValidator.maxLength(this.Labels.VaultProductId, this.MAX_LENGTH.VAULT_PRODUCT_ID)(c)
    ])
  );
  _vaultPaymentRequestTypesOnCheckoutPage = new FormControl(
    VaultPaymentRequestTypeEnum.CCSALE_CHECKREQUEST,
    Validators.compose([
      c => CustomValidator.addIf(
        () => CustomValidator.required(this.Labels.VaultPaymentRequestsTypeOnCheckoutPage)(c),
        this._trusted.value
      )(c)
    ])
  );
  _customerPortalFeatureEnabled = new FormControl(false);
  _customerPortalFeatureAvailability = new FormControl(
    this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
    Validators.compose([
      c => CustomValidator.addIf(
        () => CustomValidator.required('')(c),
        this._customerPortalFeatureEnabled.value
      )(c)
    ])
  );
  _customerPortalFeatureName = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.maxLength(this.Labels.VaultFeatureName, this.MAX_LENGTH.VAULT_CUSTOMER_PORTAL_FEATURE_NAME)(c),
      c => CustomValidator.addIf(
        () => CustomValidator.required(this.Labels.VaultFeatureName)(c),
        this._customerPortalFeatureAvailability.value ===
        this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME
      )(c)
    ])
  );
  _emailPaymentsFeatureEnabled = new FormControl(false);
  _emailPaymentsFeatureAvailability = new FormControl(
    this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
    Validators.compose([
      c => CustomValidator.addIf(
        () => CustomValidator.required('')(c),
        this._emailPaymentsFeatureEnabled.value
      )(c)
    ])
  );
  _emailPaymentsFeatureName = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.maxLength(this.Labels.VaultFeatureName, this.MAX_LENGTH.VAULT_EMAIL_PAYMENT_FEATURE_NAME)(c),
      c => CustomValidator.addIf(
        () => CustomValidator.required(this.Labels.VaultFeatureName)(c),
        this._emailPaymentsFeatureAvailability.value ===
        this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME
      )(c)
    ])
  );
  _paymentFormsFeatureEnabled = new FormControl(false);
  _paymentFormsFeatureAvailability = new FormControl(
    this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
    Validators.compose([
      c => CustomValidator.addIf(
        () => CustomValidator.required('')(c),
        this._paymentFormsFeatureEnabled.value
      )(c)
    ])
  );
  _paymentFormsFeatureName = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.maxLength(this.Labels.VaultFeatureName, this.MAX_LENGTH.VAULT_PAYMENT_FORMS_FEATURE_NAME)(c),
      c => CustomValidator.addIf(
        () => CustomValidator.required(this.Labels.VaultFeatureName)(c),
        this._paymentFormsFeatureAvailability.value ===
        this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME
      )(c)
    ])
  );
  _surchargesFeatureEnabled = new FormControl(false);
  _surchargesFeatureAvailability = new FormControl(
    this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
    Validators.compose([
      c => CustomValidator.addIf(
        () => CustomValidator.required('')(c),
        this._emailPaymentsFeatureEnabled.value
      )(c)
    ])
  );
  _surchargesFeatureName = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.maxLength(this.Labels.VaultFeatureName, this.MAX_LENGTH.VAULT_SURCHARGES_FEATURE_NAME)(c),
      c => CustomValidator.addIf(
        () => CustomValidator.required(this.Labels.VaultFeatureName)(c),
        this._surchargesFeatureAvailability.value ===
        this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME
      )(c)
    ])
  );
  _webhookAuthType = new FormControl(null);
  _webhookBypassDnsCache = new FormControl(null);
  _customFieldsEnabled = new FormControl(false);
  _advancedFieldsEnabled = new FormControl(false);

  _webhookOAuth10Url = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.OAuth10WebhookUrl)(c),
    c => CustomValidator.maxLength(this.Labels.OAuth10WebhookUrl, this.MAX_LENGTH.OAUTH_10_WEBHOOK_URL)(c)
  ]));
  _webhookOAuth10SignatureMethod = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.OAuth10SignatureMethod)(c)
  ]));
  _webhookOAuth10ConsumerKey = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.OAuth10ConsumerKey)(c),
    c => CustomValidator.maxLength(this.Labels.OAuth10ConsumerKey, this.MAX_LENGTH.OAUTH_10_CONSUMER_KEY)(c)
  ]));
  _webhookOAuth10ConsumerSecret = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.OAuth10ConsumerSecret)(c),
    c => CustomValidator.maxLength(this.Labels.OAuth10ConsumerSecret, this.MAX_LENGTH.OAUTH_10_CONSUMER_SECRET)(c)
  ]));
  _webhookOAuth10AccessToken = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.OAuth10AccessToken)(c),
    c => CustomValidator.maxLength(this.Labels.OAuth10AccessToken, this.MAX_LENGTH.OAUTH_10_ACCESS_TOKEN)(c)
  ]));
  _webhookOAuth10TokenSecret = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.OAuth10TokenSecret)(c),
    c => CustomValidator.maxLength(this.Labels.OAuth10TokenSecret, this.MAX_LENGTH.OAUTH_10_TOKEN_SECRET)(c)
  ]));
  _webhookOAuth10Realm = new FormControl(null, Validators.compose([
    c => CustomValidator.maxLength(this.Labels.OAuth10Realm, this.MAX_LENGTH.OAUTH_10_REALM)(c)
  ]));
  _webhookOAuth10Group = new FormGroup({
    webhookUrl: this._webhookOAuth10Url,
    signatureMethod: this._webhookOAuth10SignatureMethod,
    consumerKey: this._webhookOAuth10ConsumerKey,
    consumerSecret: this._webhookOAuth10ConsumerSecret,
    accessToken: this._webhookOAuth10AccessToken,
    tokenSecret: this._webhookOAuth10TokenSecret,
    realm: this._webhookOAuth10Realm
  });
  _webhookHmacSha256Url = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.HmacSha256WebhookUrl)(c),
    c => CustomValidator.maxLength(this.Labels.HmacSha256WebhookUrl, this.MAX_LENGTH.HMAC_SHA256_WEBHOOK_URL)(c)
  ]));
  _webhookHmacSha256Secret = new FormControl(null, Validators.compose([
    c => CustomValidator.required(this.Labels.HmacSha256Secret)(c),
    c => CustomValidator.maxLength(this.Labels.HmacSha256Secret, this.MAX_LENGTH.HMAC_SHA256_SECRET)(c)
  ]));
  _webhookHmacSha256Group = new FormGroup({
    webhookUrl: this._webhookHmacSha256Url,
    secret: this._webhookHmacSha256Secret
  });
  private _isTestWebhookConfigurationInProgress = false;

  _webhookSaleEventCheckAll = new FormControl<boolean>(false);
  _webhookSaleEventControls: FormArray;
  _webhookPaymentEventCheckAll = new FormControl<boolean>(false);
  _webhookPaymentEventControls: FormArray;
  _webhookPaymentDataCheckAll: FormControl = new FormControl<boolean>(false);
  _webhookPaymentDataEventControls: FormArray;
  _webhookCustomerCheckAll: FormControl = new FormControl<boolean>(false);
  _webhookCustomerEventControls: FormArray;
  _webhookAttemptsNumber: FormControl = new FormControl<number>(null);

  private platformForm: FormGroup;
  private defaultEmailPaymentTemplate: InvoiceTemplateModel;
  private defaultReceiptTemplate: ReceiptTemplateModel;

  emailPaymentTemplateComponent: InvoiceEmailPaymentTemplateComponent;
  receiptTemplateEditorComponent: ReceiptTemplateEditorComponent;
  private _showTemplates: boolean;
  private emailPaymentTemplate: InvoiceTemplateModel;
  private receiptTemplate: ReceiptTemplateModel;

  loading = false;
  private _dictionaries: any;
  private _branding: BrandingModel;

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, protected userService: UserService, protected _fb: FormBuilder, public errorService: ErrorService, protected fieldValidationService: FieldValidationErrorService, private currentDataService: CompanyCurrentDataService, private platformService: PlatformService, private webhookService: WebhookService, private ch: ChangeDetectorRef) {
    super(formPageStateService, elementRef, errorService);
  }


  @ViewChild('emailPaymentTemplate') set emailPaymentTemplateContent(content: InvoiceEmailPaymentTemplateComponent) {
    this.emailPaymentTemplateComponent = content;
    if (this.emailPaymentTemplateComponent) {
      this.emailPaymentTemplateComponent.reInit({
        emailPaymentTemplate: this.emailPaymentTemplate,
        defaultEmailPaymentTemplate: this.defaultEmailPaymentTemplate,
        companyInfo: this.companyInfo
      });
    }
  }

  @ViewChild('receiptTemplateEditor') set receiptTemplateEditorContent(content: ReceiptTemplateEditorComponent) {
    this.receiptTemplateEditorComponent = content;
    if (this.receiptTemplateEditorComponent) {
      this.receiptTemplateEditorComponent.reInit(this.receiptTemplate ?? this.defaultReceiptTemplate);
    }
  }

  get isCreateMode() {
    return !isDefined(this.platform?.id);
  }

  get isEditMode() {
    return isDefined(this.platform?.id);
  }

  get showToken() {
    return isDefined(this.platform) && isDefined(this.platform.refreshToken);
  }

  copyRefreshToken() {
    const token = this.platform?.refreshToken;
    if (!token) {
      return;
    }
    const clipboard = navigator?.clipboard;
    const copied = clipboard?.writeText
      ? clipboard.writeText(token)
      : this.copyTextFallback(token);
    Promise.resolve(copied)
      .then(() => this.errorService.alertService.showSuccess('', this.Labels.RefreshTokenCopied))
      .catch(() => {
        if (this.copyTextFallback(token)) {
          this.errorService.alertService.showSuccess('', this.Labels.RefreshTokenCopied);
        }
      });
  }

  private copyTextFallback(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  }

  get showTemplates() {
    return this._showTemplates;
  }

  updateShowTemplates() {
    const value = this.getForm().controls.customerPortalFeatureEnabled.value || this.getForm().controls.epsCheckout.value;
    if (value && (!isDefined(this.emailPaymentTemplate) || !isDefined(this.receiptTemplate))) {
      this.subscriptions.add(
        this.getTemplateSettings().pipe(tap(() => this._showTemplates = value)).subscribe()
      );
    } else {
      this._showTemplates = value;
    }
  }

  get generateTokenEnabled() {
    return isDefined(this.platform) && isDefined(this.platform.id) && this.getForm().controls.trusted.value;
  }

  ngOnInit(): void {
    this.platform = new PlatformModel();
    this.initForm();
    this.addValueChangeListeners();
    this.wsKeyFormControlNameMap = new Map([
      ['name', 'name'],
      ['sendgridSettingsId', 'sendgridSettingsId'],
      ['emailSale', 'emailSale'],
      ['emailReceipt', 'emailReceipt'],
      ['vaultProductId', 'vaultProductId'],
      ['vaultPaymentRequestTypesOnCheckoutPage', 'vaultPaymentRequestTypesOnCheckoutPage'],
      ['vaultEmailPaymentFeatureName', 'vaultEmailPaymentFeatureName'],
      ['vaultPaymentFormsFeatureName', 'vaultPaymentFormsFeatureName'],
      ['webhookAuthType', 'webhookAuthType'],
      ['webhookAttemptsNumber', 'webhookAttemptsNumber'],
      ['oAuth10Settings.webhookUrl', 'webhookOAuth10Settings.webhookUrl'],
      ['oAuth10Settings.signatureMethod', 'webhookOAuth10Settings.signatureMethod'],
      ['oAuth10Settings.consumerKey', 'webhookOAuth10Settings.consumerKey'],
      ['oAuth10Settings.consumerSecret', 'webhookOAuth10Settings.consumerSecret'],
      ['oAuth10Settings.accessToken', 'webhookOAuth10Settings.accessToken'],
      ['oAuth10Settings.tokenSecret', 'webhookOAuth10Settings.tokenSecret'],
      ['oAuth10Settings.realm', 'webhookOAuth10Settings.realm'],
      ['hmacSha256Settings.webhookUrl', 'webhookHmacSha256Settings.webhookUrl'],
      ['hmacSha256Settings.secret', 'webhookHmacSha256Settings.secret'],
      ['vaultCustomerPortalFeatureName', 'vaultCustomerPortalFeatureName'],
      ['vaultSurchargesFeatureName', 'vaultSurchargesFeatureName'],
      ['customerRegistrationOnCheckoutPageEnabled', 'customerRegistrationOnCheckoutPageEnabled']
    ]);
  }


  initForm() {
    this.initWebhookEventControls();
    this.platformForm = this._fb.group({
      name: this._name,
      trusted: this._trusted,
      epsCheckout: this._epsCheckout,
      customerRegistrationOnCheckoutPageEnabled: this._customerRegistrationOnCheckoutPageEnabled,
      sendgridSettingsId: this._sendgridSettingsId,
      brandingId: this._brandingId,
      emailSale: this._emailSale,
      emailReceipt: this._emailReceipt,
      vaultProductId: this._vaultProductId,
      vaultPaymentRequestTypesOnCheckoutPage: this._vaultPaymentRequestTypesOnCheckoutPage,
      customerPortalFeatureEnabled: this._customerPortalFeatureEnabled,
      customerPortalFeatureAvailability: this._customerPortalFeatureAvailability,
      customerPortalFeatureName: this._customerPortalFeatureName,
      emailPaymentsFeatureEnabled: this._emailPaymentsFeatureEnabled,
      emailPaymentsFeatureAvailability: this._emailPaymentsFeatureAvailability,
      emailPaymentsFeatureName: this._emailPaymentsFeatureName,
      paymentFormsFeatureEnabled: this._paymentFormsFeatureEnabled,
      paymentFormsFeatureAvailability: this._paymentFormsFeatureAvailability,
      paymentFormsFeatureName: this._paymentFormsFeatureName,
      surchargesFeatureEnabled: this._surchargesFeatureEnabled,
      surchargesFeatureAvailability: this._surchargesFeatureAvailability,
      surchargesFeatureName: this._surchargesFeatureName,
      webhookAuthType: this._webhookAuthType,
      webhookBypassDnsCache: this._webhookBypassDnsCache,
      webhookAttemptsNumber: this._webhookAttemptsNumber,
      webhookSaleEventCheckAll: this._webhookSaleEventCheckAll,
      webhookSaleFormArray: this._webhookSaleEventControls,
      webhookPaymentEventCheckAll: this._webhookPaymentEventCheckAll,
      webhookPaymentFormArray: this._webhookPaymentEventControls,
      webhookPaymentDataCheckAll: this._webhookPaymentDataCheckAll,
      webhookPaymentDataFormArray: this._webhookPaymentDataEventControls,
      webhookCustomerCheckAll: this._webhookCustomerCheckAll,
      webhookCustomerFormArray: this._webhookCustomerEventControls,
      customFieldsEnabled: this._customFieldsEnabled,
      advancedFieldsEnabled: this._advancedFieldsEnabled
    });
  }

  addValueChangeListeners() {
    this.subscriptions.add(this.getControls().webhookAuthType.valueChanges.subscribe(webhookAuthType => {
      if (!isDefined(webhookAuthType)) {
        this.getControls().webhookBypassDnsCache.setValue(null);
        this._webhookAttemptsNumber.setValue(null);
      } else {
        this.getControls().webhookBypassDnsCache.setValue(false);
        this._webhookAttemptsNumber.setValue(1);
      }
      this.updateWebhookAuthSettings();
    }));

    this.subscriptions.add(this._trusted.valueChanges.subscribe(() => {
      this.updateWebhookAuthSettings();
    }));

    this.subscriptions.add(
      this.getControls().customerPortalFeatureEnabled.valueChanges.subscribe(value => {
        this.getControls().customerPortalFeatureAvailability.reset(this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT);
        this.updateShowTemplates();
      })
    );

    this.subscriptions.add(
      this.getControls().customerPortalFeatureAvailability.valueChanges.subscribe(value => {
        this.getControls().customerPortalFeatureName.reset();
      })
    );

    this.subscriptions.add(
      this.getControls().emailPaymentsFeatureEnabled.valueChanges.subscribe(value => {
        this.getControls().emailPaymentsFeatureAvailability.reset(this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT);
      })
    );

    this.subscriptions.add(
      this.getControls().emailPaymentsFeatureAvailability.valueChanges.subscribe(value => {
        this.getControls().emailPaymentsFeatureName.reset();
      })
    );

    this.subscriptions.add(
      this.getControls().paymentFormsFeatureEnabled.valueChanges.subscribe(value => {
        this.getControls().paymentFormsFeatureAvailability.reset(this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT);
      })
    );

    this.subscriptions.add(
      this.getControls().paymentFormsFeatureAvailability.valueChanges.subscribe(value => {
        this.getControls().paymentFormsFeatureName.reset();
      })
    );

    this.subscriptions.add(
      this.getControls().surchargesFeatureEnabled.valueChanges.subscribe(value => {
        this.getControls().surchargesFeatureAvailability.reset(this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT);
      })
    );

    this.subscriptions.add(
      this.getControls().surchargesFeatureAvailability.valueChanges.subscribe(value => {
        this.getControls().surchargesFeatureName.reset();
      })
    );

    this.subscriptions.add(
      this.getControls().epsCheckout.valueChanges.subscribe(value => {
        this.getControls().customerRegistrationOnCheckoutPageEnabled.setValue(value);
        this.getControls().vaultPaymentRequestTypesOnCheckoutPage.reset(value ? VaultPaymentRequestTypeEnum.CCSALE_CHECKREQUEST : null);
        this.updateShowTemplates();
      })
    );

    this.subscriptions.add(
      this.getControls().customFieldsEnabled.valueChanges.subscribe(value => {
        if (this.emailPaymentTemplateComponent) {
          this.emailPaymentTemplateComponent.companyInfo = this.companyInfo;
        }
      })
    );

    this.subscriptions.add(
      this.getControls().advancedFieldsEnabled.valueChanges.subscribe(value => {
        if (this.emailPaymentTemplateComponent) {
          this.emailPaymentTemplateComponent.companyInfo = this.companyInfo;
        }
      })
    );

    this.subscriptions.add(
      this._brandingId.valueChanges.subscribe(value => {
        this.updateBranding(value);
      })
    )
  }

  getForm(): FormGroup {
    return this.platformForm;
  }

  get showWebhookOAuth10Settings(): boolean {
    return this.getControls().trusted.value === true
      && this._webhookAuthType.value === WebhookAuthTypeEnum.OAUTH_1_0;
  }

  get showWebhookHmacSha256Settings(): boolean {
    return this.getControls().trusted.value === true
      && this._webhookAuthType.value === WebhookAuthTypeEnum.HMAC_SHA256;
  }

  private updateWebhookAuthSettings(): void {
    this.toggleWebhookAuthControl('webhookOAuth10Settings', this._webhookOAuth10Group, this.showWebhookOAuth10Settings);
    this.toggleWebhookAuthControl('webhookHmacSha256Settings', this._webhookHmacSha256Group, this.showWebhookHmacSha256Settings);
    this.ch.detectChanges();
  }

  private toggleWebhookAuthControl(controlName: string, group: FormGroup, show: boolean): void {
    if (show) {
      if (!this.getForm().contains(controlName)) {
        this.getForm().addControl(controlName, group);
      }
    } else if (this.getForm().contains(controlName)) {
      this.getForm().removeControl(controlName);
    }
  }

  get isTestWebhookConfigurationInProgress(): boolean {
    return this._isTestWebhookConfigurationInProgress;
  }

  get testWebhookConfigurationLocked(): boolean {
    const activeGroup = this.showWebhookHmacSha256Settings ? this._webhookHmacSha256Group : this._webhookOAuth10Group;
    return !activeGroup.valid || this._isTestWebhookConfigurationInProgress;
  }

  private get webhookTestSettings(): WebhookSettings {
    return this.showWebhookHmacSha256Settings
      ? WebhookSettings.withHmacSha256(this._webhookHmacSha256Group.getRawValue() as HmacSha256)
      : WebhookSettings.withOAuth10(this._webhookOAuth10Group.getRawValue() as OAuth10);
  }

  testWebhookConfiguration() {
    if (this.testWebhookConfigurationLocked || !isDefined(this.platform?.id)) {
      return false;
    }
    this._isTestWebhookConfigurationInProgress = true;
    this.subscriptions.add(
      this.webhookService.testWebhookConfiguration(
        new WebhookTestConfigurationRequestModel(this.platform.id, this._webhookAuthType.value, this.webhookTestSettings))
        .pipe(finalize(() => {
          this._isTestWebhookConfigurationInProgress = false;
          this.ch.detectChanges();
        }))
        .subscribe(valid => {
          valid
            ? this.errorService.alertService.showSuccess('', 'Webhook configuration is valid')
            : this.errorService.alertService.showError('', 'Webhook configuration is invalid');
        })
    );
    return false;
  }

  onSubmit(value) {
    this.saveEvent.emit(this.value);
    return false;
  }

  getWSKeyFormControlNameMap(): Map<string, string> {
    return this.wsKeyFormControlNameMap;
  }

  getWebhookEventName(EventEnum, i: number): string {
    return WebhookEventEnumValue.get(EventEnum[Object.keys(EventEnum)[i]]);
  }

  onGenerateToken() {
    this.lockSubmit();
    this.loading = true;
    this.subscriptions.add(this.platformService.generateToken(this.platform)
      .pipe(finalize(() => {
        this.loading = false;
        this.unlockSubmit();
        this.ch.detectChanges();
      }))
      .pipe(map(data => {
        this.platform.refreshToken = data.refreshToken;
        requestAnimationFrame(() => {
          DOMHelper.scrollById("refresh-token");
        })
      }))
      .subscribe());
    return false;
  }

  protected onReInit(platform: PlatformModel) {
    this.loading = true;

    this.subscriptions.add(
      this.platformService.getDictionaries().pipe(
        tap(dictionaries => {
          this._dictionaries = dictionaries;
          this.platform = platform;
        }),
        switchMap(() =>
          (this.platform.customerPortalFeature?.enabled || this.platform.epsCheckout)
            ? this.getTemplateSettings()
            : of(null)
        ),
        tap(() => {
          this.platform.emailPaymentTemplate = this.emailPaymentTemplate;
          this.platform.receiptTemplate = this.receiptTemplate;
          this.platform.customFieldsEnabled = this.getForm().controls.customFieldsEnabled.value;
          this.platform.advancedFieldsEnabled = this.getForm().controls.advancedFieldsEnabled.value;
          this.resetForm(this.platform);
        }),
        finalize(() => {
          this.loading = false;
          this.ch.detectChanges();
        })
      ).subscribe()
    );
  }

  get sendgridSettingsValues(): { id: number, name: string }[] {
    return this._dictionaries?.sendgridSettingsValues ?? [];
  }

  get brandingValues(): BrandingModel[] {
    return this._dictionaries?.brandingValues ?? [];
  }

  private getTemplateSettings(): Observable<PlatformTemplateSettings> {
    return (isDefined(this.platform.id) && (this.platform.epsCheckout || this.platform.customerPortalFeature?.enabled) ?
      this.platformService.getEmailTemplateSettings(this.platform.id) :
      this.platformService.getDefaultEmailTemplateSettings())
      .pipe(tap(templates => {
        this.emailPaymentTemplate = templates.emailPaymentTemplate;
        this.receiptTemplate = templates.receiptTemplate;
        this.defaultEmailPaymentTemplate = templates.defaultEmailPaymentTemplate;
        this.defaultReceiptTemplate = templates.defaultReceiptTemplate;
        this.getForm().controls.customFieldsEnabled.reset(templates.customFieldsEnabled, {emitEvent: false});
        this.getForm().controls.advancedFieldsEnabled.reset(templates.advancedFieldsEnabled, {emitEvent: false});
      }))
  }

  private resetForm(platform: PlatformModel) {
    this.platformForm.patchValue({
      name: platform.name,
      trusted: platform.trusted,
      epsCheckout: platform.epsCheckout,
      customerRegistrationOnCheckoutPageEnabled: platform.customerRegistrationOnCheckoutPageEnabled,
      sendgridSettingsId: this.isEditMode ? platform.sendgridSettingsId : this.sendgridSettingsValues[0]?.id ?? null,
      brandingId: this.isEditMode ? platform.brandingId : null,
      emailSale: platform.emailSale,
      emailReceipt: platform.emailReceipt,
      vaultProductId: platform.vaultProductId,
      vaultPaymentRequestTypesOnCheckoutPage: platform.vaultPaymentRequestTypesOnCheckoutPage ?? VaultPaymentRequestTypeEnum.CCSALE_CHECKREQUEST,
      customerPortalFeatureEnabled: platform.customerPortalFeature.enabled,
      customerPortalFeatureAvailability: platform.customerPortalFeature.enabled && isDefined(platform.customerPortalFeature.vaultFeatureName) ? this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME : this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
      customerPortalFeatureName: platform.customerPortalFeature.vaultFeatureName,
      emailPaymentsFeatureEnabled: platform.emailPaymentsFeature.enabled,
      emailPaymentsFeatureAvailability: platform.emailPaymentsFeature.enabled && isDefined(platform.emailPaymentsFeature.vaultFeatureName) ? this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME : this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
      emailPaymentsFeatureName: platform.emailPaymentsFeature.vaultFeatureName,
      paymentFormsFeatureEnabled: platform.paymentFormsFeature.enabled,
      paymentFormsFeatureAvailability: platform.paymentFormsFeature.enabled && isDefined(platform.paymentFormsFeature.vaultFeatureName) ? this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME : this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
      paymentFormsFeatureName: platform.paymentFormsFeature.vaultFeatureName,
      surchargesFeatureEnabled: platform.surchargesFeature.enabled,
      surchargesFeatureAvailability: platform.surchargesFeature.enabled && isDefined(platform.surchargesFeature.vaultFeatureName) ? this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME : this.VaultFeatureAvailabilityEnum.AVAILABLE_BY_DEFAULT,
      surchargesFeatureName: platform.surchargesFeature.vaultFeatureName,
      webhookAuthType: this.isEditMode ? platform.webhookAuthType : null,
      webhookBypassDnsCache: platform.webhookBypassDnsCache,
      webhookAttemptsNumber: platform.webhookAttemptsNumber,
      webhookSaleFormArray: this.WebhookSaleEvents.map(webhookEvent => isDefined(platform.webhookEvents
        .find(w => w == webhookEvent))),
      webhookPaymentFormArray: this.WebhookPaymentEvents.map(webhookEvent => isDefined(platform.webhookEvents
        .find(w => w == webhookEvent))),
      webhookPaymentDataFormArray: this.WebhookPaymentDataEvents.map(webhookEvent => isDefined(platform.webhookEvents
        .find(w => w == webhookEvent))),
      webhookCustomerFormArray: this.WebhookCustomerEvents.map(webhookEvent => isDefined(platform.webhookEvents
        .find(w => w == webhookEvent))),
    }, {emitEvent: false});

    const oAuth10 = platform.webhookSettings?.oAuth10Settings;
    this._webhookOAuth10Group.reset({
      webhookUrl: oAuth10?.webhookUrl ?? null,
      signatureMethod: oAuth10?.signatureMethod ?? null,
      consumerKey: oAuth10?.consumerKey ?? null,
      consumerSecret: oAuth10?.consumerSecret ?? null,
      accessToken: oAuth10?.accessToken ?? null,
      tokenSecret: oAuth10?.tokenSecret ?? null,
      realm: oAuth10?.realm ?? null
    }, {emitEvent: false});
    const hmacSha256 = platform.webhookSettings?.hmacSha256Settings;
    this._webhookHmacSha256Group.reset({
      webhookUrl: hmacSha256?.webhookUrl ?? null,
      secret: hmacSha256?.secret ?? null
    }, {emitEvent: false});
    this.updateWebhookAuthSettings();

    this.updateBranding(platform.brandingId);
    this._webhookSaleEventCheckAll.reset(!isDefined(this._webhookSaleEventControls.getRawValue().find(v => !v)), {emitEvent: false});
    this._webhookPaymentEventCheckAll.reset(!isDefined(this._webhookPaymentEventControls.getRawValue().find(v => !v)), {emitEvent: false});
    this._webhookPaymentDataCheckAll.reset(!isDefined(this._webhookPaymentDataEventControls.getRawValue().find(v => !v)), {emitEvent: false});
    this._webhookCustomerCheckAll.reset(!isDefined(this._webhookCustomerEventControls.getRawValue().find(v => !v)), {emitEvent: false});
    if (this.isEditMode) {
      this.platformForm.controls.trusted.disable();
    }
    this.updateShowTemplates();
  }

  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  private initWebhookEventControls() {
    this._webhookSaleEventControls = new FormArray([]);
    this.WebhookSaleEvents.forEach(webhookEvent => {
      this._webhookSaleEventControls.push(new FormControl(false));
    });

    this._webhookPaymentEventControls = new FormArray([]);
    this.WebhookPaymentEvents.forEach(webhookEvent => {
      this._webhookPaymentEventControls.push(new FormControl(false));
    });

    this._webhookPaymentDataEventControls = new FormArray([]);
    this.WebhookPaymentDataEvents.forEach(webhookEvent => {
      this._webhookPaymentDataEventControls.push(new FormControl(false));
    });

    this._webhookCustomerEventControls = new FormArray([]);
    this.WebhookCustomerEvents.forEach(webhookEvent => {
      this._webhookCustomerEventControls.push(new FormControl(false));
    });

    this.subscriptions.add(
      this._webhookSaleEventCheckAll.valueChanges.subscribe(
        checkAll => {
          if (checkAll) {
            this._webhookSaleEventControls.controls.forEach(c => c.setValue(true, {emitEvent: false}));
          } else {
            this._webhookSaleEventControls.controls.forEach(c => c.setValue(false, {emitEvent: false}))
          }
        }
      )
    );

    this._webhookSaleEventControls.controls.forEach(c =>
      this.subscriptions.add(
        c.valueChanges.subscribe(newValue => {
          if (newValue && !isDefined(this._webhookSaleEventControls.getRawValue().find(v => !v))) {
            this._webhookSaleEventCheckAll.setValue(true, {emitEvent: false});
          } else {
            this._webhookSaleEventCheckAll.setValue(false, {emitEvent: false});
          }
        })
      ));


    this.subscriptions.add(
      this._webhookPaymentEventCheckAll.valueChanges.subscribe(
        checkAll => {
          if (checkAll) {
            this._webhookPaymentEventControls.controls.forEach(c => c.setValue(true));
          } else {
            this._webhookPaymentEventControls.controls.forEach(c => c.setValue(false))
          }
        }
      )
    );

    this._webhookPaymentEventControls.controls.forEach(c =>
      this.subscriptions.add(
        c.valueChanges.subscribe(newValue => {
          if (newValue && !isDefined(this._webhookPaymentEventControls.getRawValue().find(v => !v))) {
            this._webhookPaymentEventCheckAll.setValue(true, {emitEvent: false});
          } else {
            this._webhookPaymentEventCheckAll.setValue(false, {emitEvent: false});
          }
        })
      ));

    this.subscriptions.add(
      this._webhookPaymentDataCheckAll.valueChanges.subscribe(
        checkAll => {
          if (checkAll) {
            this._webhookPaymentDataEventControls.controls.forEach(c => c.setValue(true));
          } else {
            this._webhookPaymentDataEventControls.controls.forEach(c => c.setValue(false))
          }
        }
      )
    );

    this._webhookPaymentDataEventControls.controls.forEach(c =>
      this.subscriptions.add(
        c.valueChanges.subscribe(newValue => {
          if (newValue && !isDefined(this._webhookPaymentDataEventControls.getRawValue().find(v => !v))) {
            this._webhookPaymentDataCheckAll.setValue(true, {emitEvent: false});
          } else {
            this._webhookPaymentDataCheckAll.setValue(false, {emitEvent: false});
          }
        })
      ));

    this.subscriptions.add(
      this._webhookCustomerCheckAll.valueChanges.subscribe(
        checkAll => {
          if (checkAll) {
            this._webhookCustomerEventControls.controls.forEach(c => c.setValue(true, {emitEvent: false}));
          } else {
            this._webhookCustomerEventControls.controls.forEach(c => c.setValue(false, {emitEvent: false}))
          }
        }
      )
    );

    this._webhookCustomerEventControls.controls.forEach(c =>
      this.subscriptions.add(
        c.valueChanges.subscribe(newValue => {
          if (newValue && !isDefined(this._webhookCustomerEventControls.getRawValue().find(v => !v))) {
            this._webhookCustomerCheckAll.setValue(true, {emitEvent: false});
          } else {
            this._webhookCustomerCheckAll.setValue(false, {emitEvent: false});
          }
        })
      ));
  }

  get value(): PlatformModel {
    const formValue = this.getForm().getRawValue();
    const platform: PlatformModel = ObjectHelper.cloneDeep(this.platform);
    platform.name = formValue.name;
    platform.trusted = formValue.trusted;
    platform.epsCheckout = formValue.epsCheckout;
    platform.customerRegistrationOnCheckoutPageEnabled = formValue.customerRegistrationOnCheckoutPageEnabled;
    platform.sendgridSettingsId = formValue.sendgridSettingsId;
    platform.brandingId = formValue.brandingId;
    platform.emailSale = formValue.emailSale;
    platform.emailReceipt = formValue.emailReceipt;
    platform.vaultProductId = formValue.vaultProductId;
    platform.vaultPaymentRequestTypesOnCheckoutPage = formValue.vaultPaymentRequestTypesOnCheckoutPage;
    platform.customerPortalFeature = {
      enabled: formValue.customerPortalFeatureEnabled,
      vaultFeatureName: formValue.customerPortalFeatureAvailability == this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME ? formValue.customerPortalFeatureName : null
    };
    platform.emailPaymentsFeature = {
      enabled: formValue.emailPaymentsFeatureEnabled,
      vaultFeatureName: formValue.emailPaymentsFeatureAvailability == this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME ? formValue.emailPaymentsFeatureName : null
    }
    platform.paymentFormsFeature = {
      enabled: formValue.paymentFormsFeatureEnabled,
      vaultFeatureName: formValue.paymentFormsFeatureAvailability == this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME ? formValue.paymentFormsFeatureName : null
    }
    platform.surchargesFeature = {
      enabled: formValue.surchargesFeatureEnabled,
      vaultFeatureName: formValue.surchargesFeatureAvailability == this.VaultFeatureAvailabilityEnum.REQUIRES_VAULT_FEATURE_NAME ? formValue.surchargesFeatureName : null
    }
    platform.webhookAuthType = formValue.webhookAuthType;
    platform.webhookBypassDnsCache = formValue.webhookBypassDnsCache;
    platform.webhookAttemptsNumber = formValue.webhookAttemptsNumber;
    if (!PlatformModel.usesPlatformWebhookSettings(platform)) {
      platform.webhookSettings = null;
    } else if (platform.webhookAuthType === WebhookAuthTypeEnum.HMAC_SHA256) {
      platform.webhookSettings = WebhookSettings.withHmacSha256(this._webhookHmacSha256Group.getRawValue() as HmacSha256);
    } else {
      platform.webhookSettings = WebhookSettings.withOAuth10(this._webhookOAuth10Group.getRawValue() as OAuth10);
    }
    const webhookEvents = [];
    //Order is important
    webhookEvents.push(...this._webhookSaleEventControls.getRawValue());
    webhookEvents.push(...this._webhookPaymentEventControls.getRawValue());
    webhookEvents.push(...this._webhookPaymentDataEventControls.getRawValue());
    webhookEvents.push(...this._webhookCustomerEventControls.getRawValue());
    platform.webhookEvents = webhookEvents
      .map((checked, index) => {
        return {
          checked: checked,
          webhookEvent: [...this.WebhookSaleEvents, ...this.WebhookPaymentEvents, ...this.WebhookPaymentDataEvents, ...WebhookCustomerEvents][index]
        }
      })
      .filter(v => v.checked).map(v => v.webhookEvent);

    platform.emailPaymentTemplate = this._showTemplates ? this.emailPaymentTemplateComponent.template : null;
    platform.receiptTemplate = this._showTemplates ? this.receiptTemplateEditorComponent?.template : null;
    platform.customFieldsEnabled = formValue.customFieldsEnabled;
    platform.advancedFieldsEnabled = formValue.advancedFieldsEnabled;
    return platform;
  }

  objectChanged(): boolean | Observable<boolean> {
    const valueJSON = PlatformModel.toJSON(this.value);
    const platformJSON = PlatformModel.toJSON(this.platform);
    return !deepEqual(valueJSON, platformJSON);
  }

  get companyInfo() {
    return {
      displayName: `Company Display Name`,
      address: {
        street: 'Street',
        city: 'City',
        state: 'ST',
        zip: '10101',
        country: CountryISOEnum.US
      },
      contactInfo: {
        email: 'email@email.com',
        phone: '11111111111',
        formattedPhone: '+1(111)111-1111',
        website: 'website@website.com'
      },
      logo: null,
      customFieldsEnabled: this.getForm().controls.customFieldsEnabled.value,
      advancedFieldsEnabled: this.getForm().controls.advancedFieldsEnabled.value
    }
  }

  get branding(): BrandingModel {
    return this._branding;
  }

  updateBranding(brandingId): void {
    if (ObjectHelper.isDefined(brandingId)) {
      this._branding = this.brandingValues.find(branding => branding.id == brandingId);
    } else {
      this._branding = null;
    }
  }

  protected readonly VaultPaymentRequestTypeEnum = VaultPaymentRequestTypeEnum;
  protected readonly VaultPaymentRequestTypeEnumValue = VaultPaymentRequestTypeEnumValue;
  protected readonly UserLabels = UserLabels;
}
