import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Injector} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from "@angular/forms";
import {HmacSha256, OAuth10, WebhookSettings} from "../../../../models/companymanage/entity.model";
import {ErrorService} from "../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {ServerErrorService} from "../../../../../../../common/src/lib/utils/server-error.service";
import {Observable} from "rxjs";
import {finalize, map} from "rxjs/operators";
import {
  WebhookAuthTypeEnum
} from "../../../../../../../common/src/lib/enums/companymanagement/platform/webhook-auth-type.enum";
import {CompanyLabels} from "../company-labels";
import {
  OAuth10SignatureMethodEnum,
  OAuth10SignatureMethodEnumValue
} from "../../../../../../../common/src/lib/enums/companymanagement/company/oauth-1.0-signature-method.enum";
import {WebhookService} from "../../../../../services/webhook/webhook.service";
import {WebhookTestConfigurationRequestModel} from "../../../../models/webhook/webhook-test-configuration.model";
import {
  FormGroupAsFormControlComponent
} from "../../../../../../../common/src/lib/components/formgroup/form-group-as-form-control.component";
import {CustomValidator} from "../../../../../../../common/src/lib/helpers/custom.validator";
import {
  WebhookCustomerEvents,
  WebhookEventEnum,
  WebhookEventEnumValue,
  WebhookPaymentDataEvents,
  WebhookPaymentEvents,
  WebhookSaleEvents
} from "../../../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {WebhookUiKeyService} from "../../../../../services/webhook/webhook-ui-key.service";
import {ObjectHelper} from "../../../../../../../common/src/lib/helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-company-webhook',
  templateUrl: './company-webhook-component.html',
  styleUrls: ['company-webhook-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanyWebhookComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CompanyWebhookComponent,
      multi: true
    }
  ]
})
export class CompanyWebhookComponent extends FormGroupAsFormControlComponent {

  readonly Labels = CompanyLabels;
  readonly MAX_LENGTH = {
    OAUTH_10_WEBHOOK_URL: 1000,
    OAUTH_10_CONSUMER_KEY: 255,
    OAUTH_10_CONSUMER_SECRET: 255,
    OAUTH_10_ACCESS_TOKEN: 255,
    OAUTH_10_TOKEN_SECRET: 1000,
    OAUTH_10_REALM: 255,
    HMAC_SHA256_WEBHOOK_URL: 1000,
    HMAC_SHA256_SECRET: 255
  };
  private readonly _form: FormGroup = new FormGroup({});
  _oauth10Group: FormGroup;
  _hmacSha256Group: FormGroup;

  readonly WebhookAuthTypeEnum = WebhookAuthTypeEnum;

  readonly OAuth10SignatureMethodEnum = OAuth10SignatureMethodEnum;
  readonly OAuth10SignatureMethodEnumValue = OAuth10SignatureMethodEnumValue;

  private platformWebhookAuthType: WebhookAuthTypeEnum = null;
  private _platformWebhookEvents: WebhookEventEnum[];
  private platformId: number;
  private _isTestWebhookConfigurationInProgress = false;

  _suppressedWebhookSaleEventControls: FormArray;
  _suppressedWebhookPaymentEventControls: FormArray;
  _suppressedWebhookPaymentDataEventControls: FormArray;
  _suppressedWebhookCustomerEventControls: FormArray;

  constructor(protected elementRef: ElementRef,
              public errorService: ErrorService,
              protected ch: ChangeDetectorRef,
              public serverErrorService: ServerErrorService,
              private webhookService: WebhookService,
              private webhookUiKeyService: WebhookUiKeyService,
              private injector: Injector) {
    super(elementRef, errorService, ch, serverErrorService);
  }

  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }


  get value(): { settings: WebhookSettings, suppressedWebhookEvents: WebhookEventEnum[] } {
    let webhookEvents = null;
    if (ObjectHelper.isDefined(this._platformWebhookEvents) && this._platformWebhookEvents.length > 0) {
      webhookEvents = [this._suppressedWebhookSaleEventControls, this._suppressedWebhookPaymentEventControls, this._suppressedWebhookPaymentDataEventControls, this._suppressedWebhookCustomerEventControls]
        .filter(formArray => ObjectHelper.isDefined(formArray))
        .map(formArray => formArray.controls.filter(control => control.value == true)
          .map(control => WebhookEventEnum[this._webhookEventControlMap.get(control as FormControl)]))
        .reduce((elem1, elem2) => elem1.concat(elem2));
    }
    return {
      settings: {
        oAuth10Settings: this.platformWebhookAuthType === WebhookAuthTypeEnum.OAUTH_1_0 ? this._oauth10Group.value : null,
        hmacSha256Settings: this.platformWebhookAuthType === WebhookAuthTypeEnum.HMAC_SHA256 ? this._hmacSha256Group.value : null
      },
      suppressedWebhookEvents: webhookEvents
    };
  }

  protected formValueChanges(): Observable< { settings: WebhookSettings, suppressedWebhookEvents: WebhookEventEnum[] }> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }

  getForm(): FormGroup {
    return this._form;
  }

  getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['oAuth10Settings.webhookUrl', this._oauth10WebhookUrl],
      ['oAuth10Settings.signatureMethod', this._oauth10SignatureMethod],
      ['oAuth10Settings.consumerKey', this._oauth10ConsumerKey],
      ['oAuth10Settings.consumerSecret', this._oauth10ConsumerSecret],
      ['oAuth10Settings.accessToken', this._oauth10AccessToken],
      ['oAuth10Settings.tokenSecret', this._oauth10TokenSecret],
      ['oAuth10Settings.realm', this._oauth10Realm],
      ['hmacSha256Settings.webhookUrl', this._hmacSha256WebhookUrl],
      ['hmacSha256Settings.secret', this._hmacSha256Secret]
    ]);
  }

  _oauth10WebhookUrl: FormControl;
  _oauth10SignatureMethod: FormControl;
  _oauth10ConsumerKey: FormControl;
  _oauth10ConsumerSecret: FormControl;
  _oauth10AccessToken: FormControl;
  _oauth10TokenSecret: FormControl;
  _oauth10Realm: FormControl;
  _hmacSha256WebhookUrl: FormControl;
  _hmacSha256Secret: FormControl;

  protected onInit(): void {
    this._oauth10WebhookUrl = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OAuth10WebhookUrl)(c), c => CustomValidator.maxLength(this.Labels.OAuth10WebhookUrl, this.MAX_LENGTH.OAUTH_10_WEBHOOK_URL)(c)]));
    this._oauth10SignatureMethod = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OAuth10SignatureMethod)(c)]));
    this._oauth10ConsumerKey = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OAuth10ConsumerKey)(c), c => CustomValidator.maxLength(this.Labels.OAuth10ConsumerKey, this.MAX_LENGTH.OAUTH_10_CONSUMER_KEY)(c)]));
    this._oauth10ConsumerSecret = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OAuth10ConsumerSecret)(c), c => CustomValidator.maxLength(this.Labels.OAuth10ConsumerSecret, this.MAX_LENGTH.OAUTH_10_CONSUMER_SECRET)(c)]));
    this._oauth10AccessToken = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OAuth10AccessToken)(c), c => CustomValidator.maxLength(this.Labels.OAuth10AccessToken, this.MAX_LENGTH.OAUTH_10_ACCESS_TOKEN)(c)]));
    this._oauth10TokenSecret = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.OAuth10TokenSecret)(c), c => CustomValidator.maxLength(this.Labels.OAuth10TokenSecret, this.MAX_LENGTH.OAUTH_10_TOKEN_SECRET)(c)]));
    this._oauth10Realm = new FormControl(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.OAuth10Realm, this.MAX_LENGTH.OAUTH_10_REALM)(c)]));

    this._oauth10Group = new FormGroup({
      webhookUrl: this._oauth10WebhookUrl,
      signatureMethod: this._oauth10SignatureMethod,
      consumerKey: this._oauth10ConsumerKey,
      consumerSecret: this._oauth10ConsumerSecret,
      accessToken: this._oauth10AccessToken,
      tokenSecret: this._oauth10TokenSecret,
      realm: this._oauth10Realm,
    });

    this._hmacSha256WebhookUrl = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.HmacSha256WebhookUrl)(c), c => CustomValidator.maxLength(this.Labels.HmacSha256WebhookUrl, this.MAX_LENGTH.HMAC_SHA256_WEBHOOK_URL)(c)]));
    this._hmacSha256Secret = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.HmacSha256Secret)(c), c => CustomValidator.maxLength(this.Labels.HmacSha256Secret, this.MAX_LENGTH.HMAC_SHA256_SECRET)(c)]));

    this._hmacSha256Group = new FormGroup({
      webhookUrl: this._hmacSha256WebhookUrl,
      secret: this._hmacSha256Secret,
    });
  }

  protected onReInit(model: WebhookSettingsViewModel) {
    this.platformWebhookAuthType = model.platformWebhookAuthType;
    this.platformId = model.platformId;
    this._platformWebhookEvents = model.platformWebhookEvents;
    const auth10Settings: OAuth10 = model.webhookSettings?.oAuth10Settings;
    const hmacSha256Settings: HmacSha256 = model.webhookSettings?.hmacSha256Settings;

    this._oauth10Group.reset(auth10Settings ? {
      webhookUrl: auth10Settings.webhookUrl,
      signatureMethod: auth10Settings.signatureMethod,
      consumerKey: auth10Settings.consumerKey,
      consumerSecret: auth10Settings.consumerSecret,
      accessToken: auth10Settings.accessToken,
      tokenSecret: auth10Settings.tokenSecret,
      realm: auth10Settings.realm,
    } : {
      webhookUrl: null,
      signatureMethod: null,
      consumerKey: null,
      consumerSecret: null,
      accessToken: null,
      tokenSecret: null,
      realm: null,
    });

    this._hmacSha256Group.reset(hmacSha256Settings ? {
      webhookUrl: hmacSha256Settings.webhookUrl,
      secret: hmacSha256Settings.secret,
    } : {
      webhookUrl: null,
      secret: null,
    });

    switch (model.platformWebhookAuthType) {
      case WebhookAuthTypeEnum.OAUTH_1_0:
        this.getForm().addControl('oAuth10Settings', this._oauth10Group);
        if (this.getForm().contains('hmacSha256Settings')) {
          this.getForm().removeControl('hmacSha256Settings');
        }
        break;
      case WebhookAuthTypeEnum.HMAC_SHA256:
        this.getForm().addControl('hmacSha256Settings', this._hmacSha256Group);
        if (this.getForm().contains('oAuth10Settings')) {
          this.getForm().removeControl('oAuth10Settings');
        }
        break;
      default:
        if (this.getForm().contains('oAuth10Settings')) {
          this.getForm().removeControl('oAuth10Settings');
        }
        if (this.getForm().contains('hmacSha256Settings')) {
          this.getForm().removeControl('hmacSha256Settings');
        }
    }

    if (this.webhookUiKeyService.canSuppressWebhookEvents() && this._platformWebhookEvents.length > 0) {
      this._suppressedWebhookSaleEventControls = this.addWebhookSuppressedEventGroupControl('suppressedWebhookSaleEventControls', WebhookSaleEvents, model.suppressedWebhookEvents);
      this._suppressedWebhookPaymentEventControls = this.addWebhookSuppressedEventGroupControl('suppressedWebhookPaymentEventControls', WebhookPaymentEvents, model.suppressedWebhookEvents);
      this._suppressedWebhookPaymentDataEventControls = this.addWebhookSuppressedEventGroupControl('suppressedWebhookPaymentDataEventControls', WebhookPaymentDataEvents, model.suppressedWebhookEvents);
      this._suppressedWebhookCustomerEventControls = this.addWebhookSuppressedEventGroupControl('suppressedWebhookCustomerEventControls', WebhookCustomerEvents, model.suppressedWebhookEvents);
    } else {
      ['suppressedWebhookSaleEventControls', 'suppressedWebhookPaymentEventControls', 'suppressedWebhookPaymentDataEventControls', 'suppressedWebhookCustomerEventControls'].forEach(
        controlName => {
          this.getForm().removeControl(controlName);
        }
      );
      this._suppressedWebhookSaleEventControls = null;
      this._suppressedWebhookPaymentEventControls = null;
      this._suppressedWebhookPaymentDataEventControls = null;
      this._suppressedWebhookCustomerEventControls = null;
    }

    this.ch.detectChanges();
  }
  private _webhookEventControlMap: Map<FormControl, string> = new Map();
  private addWebhookSuppressedEventGroupControl(controlName, webhookEvents: WebhookEventEnum[], suppressedEvents: WebhookEventEnum[]) {
    const _webhookEventControls = new FormArray([]);
    webhookEvents
      .filter(webhookEvent => this._platformWebhookEvents.indexOf(webhookEvent) >= 0)
      .forEach(webhookEvent => {
        const control = new FormControl(suppressedEvents.indexOf(webhookEvent) >= 0);
        this._webhookEventControlMap.set(control, webhookEvent);
        _webhookEventControls.push(control);
      });
    if (_webhookEventControls.length > 0) {
      this.getForm().addControl(controlName, _webhookEventControls);
      return _webhookEventControls;
    }
    return null;
  }

  get testWebhookConfigurationLocked(): boolean {
    return !this.getForm().valid || this.isTestWebhookConfigurationInProgress;
  }

  get isTestWebhookConfigurationInProgress(): boolean {
    return this._isTestWebhookConfigurationInProgress;
  }

  testWebhookConfiguration() {
    if (!this.testWebhookConfigurationLocked) {
      this._isTestWebhookConfigurationInProgress = true;
      this.subscriptions.add(
        this.webhookService.testWebhookConfiguration(new WebhookTestConfigurationRequestModel(this.platformId, this.platformWebhookAuthType, this.value.settings))
          .pipe(finalize(() => {
            this._isTestWebhookConfigurationInProgress = false;
            this.ch.detectChanges();
          }))
          .subscribe(
            o => {
              o == true ? this.errorService.alertService.showSuccess('', 'Webhook configuration is valid')
                : this.errorService.alertService.showError('', 'Webhook configuration is invalid');
            }
          )
      );
    }

    return false;
  }

  get showSuppressWebhookEvents() {
    return this._platformWebhookEvents.length > 0 && this.webhookUiKeyService.canSuppressWebhookEvents();
  }


  getWebhookEventName(control: FormControl): string {
    return WebhookEventEnumValue.get(WebhookEventEnum[this._webhookEventControlMap.get(control)]);
  }

  protected readonly WebhookSaleEvents = WebhookSaleEvents;
  protected readonly WebhookPaymentEvents = WebhookPaymentEvents;
  protected readonly WebhookPaymentDataEvents = WebhookPaymentDataEvents;
  protected readonly WebhookCustomerEvents = WebhookCustomerEvents;
}

export interface WebhookSettingsViewModel {
  webhookSettings: WebhookSettings;
  platformWebhookAuthType: WebhookAuthTypeEnum;
  platformId: number;
  platformWebhookEvents: WebhookEventEnum[];
  suppressedWebhookEvents: WebhookEventEnum[];
}
