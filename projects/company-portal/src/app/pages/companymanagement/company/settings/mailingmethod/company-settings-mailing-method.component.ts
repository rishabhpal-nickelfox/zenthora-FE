import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {MailingMethodSettings} from "../../../../../models/companymanage/entity.model";
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {EntityService} from "../../../../../../services/companymanagement/entity.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, finalize, map} from "rxjs/operators";
import {CustomValidator} from "../../../../../../../../common/src/lib/helpers/custom.validator";
import {Observable, throwError} from "rxjs";
import {
  MailingMethodEnum,
  MailingMethodEnumValue
} from "../../../../../../../../common/src/lib/enums/companymanagement/companysettings/mailing-method.enum";
import {CompanySettingsLabels} from "../company-settings-labels";
import {deepEqual, ObjectHelper} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {
  PrivateSmtpSecurityMode, PrivateSmtpSecurityModeDefaultPort,
  PrivateSmtpSecurityModeValue
} from "../../../../../../enums/companymanagement/private-smtp-security-mode.enum";

@Component({
  standalone: false,
  selector: 'app-company-settings-mailing-method',
  templateUrl: './company-settings-mailing-method.component.html',
  providers: [FormPageStateService]
})
export class CompanySettingsMailingMethodComponent extends AutoScrollingFormPageComponent implements OnInit, ComponentCanDeactivate {
  settings: MailingMethodSettings;
  form;

  protected readonly Labels = CompanySettingsLabels;

  protected readonly MailingMethodEnum = MailingMethodEnum;
  protected readonly MailingMethodEnumValue = MailingMethodEnumValue;
  protected readonly PrivateSmtpSecurityMode = PrivateSmtpSecurityMode;
  protected readonly PrivateSmtpSecurityModeValue = PrivateSmtpSecurityModeValue;

  private previousSecurityMode: PrivateSmtpSecurityMode;

  readonly MAX_LENGTH = {
    NOTIFICATION_EMAIL: 500,
    FROM: 100,
    SERVER: 100,
    PORT: 100,
    USER: 100,
    PASSWORD: 100
  };

  constructor(public formPageStateService: FormPageStateService, private fieldValidationErrorService: FieldValidationErrorService, protected elementRef: ElementRef, public errorService: ErrorService, private entityService: EntityService, public ch: ChangeDetectorRef, private _fb: FormBuilder) {
    super(formPageStateService, elementRef, errorService);
  }

  getSettings(): void {
    this.subscriptions.add(
      this.entityService.getMailingMethodSettings()
        .pipe(finalize(() => {

        }))
        .subscribe(result => {
          this.reInit(result);
        }));
  }


  ngOnInit(): void {
    this.initForm();
    this.getSettings();
    this.wsKeyFormControlNameMap = new Map([['mailingMethod', 'mailingMethod'], ['privateSmtp.from', 'privateSmtp.from'], ['privateSmtp.server', 'privateSmtp.server'], ['privateSmtp.port', 'privateSmtp.port'], ['privateSmtp.user', 'privateSmtp.user'], ['privateSmtp.password', 'privateSmtp.password'],
      ['emailPaymentNotification', 'emailPaymentNotification'], ['paymentNotificationEmail', 'paymentNotificationEmail'], ['paymentFormSubmissionNotification', 'paymentFormSubmissionNotification'],
      ['paymentFormSubmissionNotificationEmail', 'paymentFormSubmissionNotificationEmail'], ['emailSaleHeaderEnabled', 'emailSaleHeaderEnabled']]);
  }


  initForm(): void {
    this.form = this._fb.group({
      emailPaymentNotification: [null],
      paymentNotificationEmail: [null, Validators.compose([c => CustomValidator.maxLength(this.Labels.NotificationOfCustomerPayment, this.MAX_LENGTH.NOTIFICATION_EMAIL)(c), c => CustomValidator.addIf(c1 => CustomValidator.required(this.Labels.NotificationOfCustomerPayment)(c1), this.emailPaymentNotification)(c),
        c => CustomValidator.addIf(c1 => CustomValidator.multipleEmailValidation(this.Labels.NotificationEmail)(c1), this.emailPaymentNotification)(c)])],
      paymentFormSubmissionNotification: [null],
      paymentFormSubmissionNotificationEmail: [null, Validators.compose([c => CustomValidator.maxLength(this.Labels.PaymentFormSubmissionNotification, this.MAX_LENGTH.NOTIFICATION_EMAIL)(c), c => CustomValidator.addIf(c1 => CustomValidator.required(this.Labels.PaymentFormSubmissionNotification)(c1), this.paymentFormSubmissionNotification)(c),
        c => CustomValidator.addIf(c1 => CustomValidator.multipleEmailValidation(this.Labels.NotificationEmail)(c1), this.paymentFormSubmissionNotification)(c)])],
      emailSale: [{value: null, disabled: true}],
      emailSaleHeaderEnabled: [true],
      emailReceipt: [null],
      mailingMethod: [MailingMethodEnum.SENDGRID, Validators.compose([c => CustomValidator.required(this.Labels.MailingMethod)(c)])],
      privateSmtp: this._fb.group({
        from: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.FromAddress)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.FromAddress, this.MAX_LENGTH.FROM)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.emailRegularOrNamedValidation(this.Labels.FromAddress)(c), this.showSmtpFields)(c)])],
        server: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.SMTPServer)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.SMTPServer, this.MAX_LENGTH.SERVER)(c), this.showSmtpFields)(c)])],
        securityMode: [PrivateSmtpSecurityMode.STARTTLS, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.SecurityMode)(c), this.showSmtpFields)(c)])],
        port: [PrivateSmtpSecurityModeDefaultPort.get(PrivateSmtpSecurityMode.STARTTLS), Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.Port)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.Port, this.MAX_LENGTH.PORT)(c), this.showSmtpFields)(c)])],
        user: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.User)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.User, this.MAX_LENGTH.USER)(c), this.showSmtpFields)(c)])],
        password: [null, Validators.compose([c => CustomValidator.addIf(c => CustomValidator.required(this.Labels.Password)(c), this.showSmtpFields)(c), c => CustomValidator.addIf(c => CustomValidator.maxLength(this.Labels.Password, this.MAX_LENGTH.PASSWORD)(c), this.showSmtpFields)(c)])]
      }),
    });

    this.subscriptions.add(this.getForm().controls.mailingMethod.valueChanges.subscribe(result => {
      if (result === MailingMethodEnum.PRIVATE_SMTP) {
        this.getForm().controls.privateSmtp.reset({
          from: null,
          server: null,
          securityMode: PrivateSmtpSecurityMode.STARTTLS,
          port: PrivateSmtpSecurityModeDefaultPort.get(PrivateSmtpSecurityMode.STARTTLS),
          user: null,
          password: null
        });
      }

      const privateSmtpGroup: FormGroup = this.getForm().controls.privateSmtp as FormGroup;
      Object.keys(privateSmtpGroup.controls).forEach(fieldName => {
        const privateSmtpControl = privateSmtpGroup.get(fieldName);
        if (privateSmtpControl instanceof FormControl) {
          privateSmtpControl.updateValueAndValidity();
        }
      });
    }));

    this.subscriptions.add(this.getForm().controls.emailReceipt.valueChanges
      .subscribe(value => {
        this.getForm().controls.mailingMethod.updateValueAndValidity();
      }));

    this.subscriptions.add(this.getForm().controls.emailPaymentNotification.valueChanges.subscribe(value => {
      if (!value) {
        this.getForm().controls.paymentNotificationEmail.reset();
      }
      this.getForm().controls.paymentNotificationEmail.updateValueAndValidity();
    }));

    this.subscriptions.add(this.getForm().controls.paymentFormSubmissionNotification.valueChanges.subscribe(value => {
      if (!value) {
        this.getForm().controls.paymentFormSubmissionNotificationEmail.reset();
      }
      this.getForm().controls.paymentFormSubmissionNotificationEmail.updateValueAndValidity();
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
          this.getForm().get('privateSmtp.port').setValue(PrivateSmtpSecurityModeDefaultPort.get(newMode), {emitEvent: false});
        }
        this.previousSecurityMode = newMode;
      })
    );
  }

  getForm(): FormGroup {
    return this.form;
  }


  protected onReInit(settings: MailingMethodSettings): void {
    this.settings = settings;
    this.updateFormValues();
  }

  protected onSubmit(value) {
    this.subscriptions.add(this.entityService.updateMailingMethodSettings(this.value)
      .pipe(finalize(() => this.afterSubmit())).pipe(map(result => {
        this.errorService.alertService.showSuccess('', 'Mailing Options saved');
        this.getSettings();
      })).pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this);
        return throwError(error);
      }))
      .subscribe());
  }

  private updateFormValues() {
    this.form.patchValue({
      emailPaymentNotification: this.settings.emailPaymentNotification,
      paymentNotificationEmail: this.settings.paymentNotificationEmail,
      paymentFormSubmissionNotification: this.settings.paymentFormSubmissionNotification,
      paymentFormSubmissionNotificationEmail: this.settings.paymentFormSubmissionNotificationEmail,
      emailSale: this.settings.emailSale,
      emailSaleHeaderEnabled: this.settings.emailSaleHeaderEnabled,
      emailReceipt: this.settings.emailReceipt,
      mailingMethod: this.settings.mailingMethod ? this.settings.mailingMethod : MailingMethodEnum.SENDGRID,
      privateSmtp: {
        from: this.settings.privateSmtp.from,
        server: this.settings.privateSmtp.server,
        securityMode: this.settings.privateSmtp.securityMode,
        port: this.settings.privateSmtp.port,
        user: this.settings.privateSmtp.user,
        password: this.settings.privateSmtp.password
      }
    }, {emitEvent: false});
    this.previousSecurityMode = this.getForm().get('privateSmtp.securityMode').value;
    this.getForm().markAsPristine();
    this.ch.detectChanges();
  }

  get showSmtpFields() {
    return this.getForm()?.controls.mailingMethod.value == MailingMethodEnum.PRIVATE_SMTP || false;
  }

  get hasEmailOptions(): boolean {
    return this.getForm()?.controls.emailSale.getRawValue() || this.getForm()?.controls.emailReceipt.getRawValue();
  }

  get isEmailReceiptEditable(): boolean {
    return this.settings?.isEmailReceiptEditable;
  }

  get emailPaymentNotification(): boolean {
    return this.getForm()?.controls.emailPaymentNotification.value || false;
  }

  get paymentFormSubmissionNotification(): boolean {
    return this.getForm()?.controls.paymentFormSubmissionNotification.value || false;
  }

  get value(): MailingMethodSettings {
    const newSettings = ObjectHelper.cloneDeep(this.settings);
    return Object.assign(newSettings, this.getForm().value);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(MailingMethodSettings.toJSON(this.value), MailingMethodSettings.toJSON(this.settings));
  }

}
