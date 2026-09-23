import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";
import {ServerErrorService} from "../../../../../../../../common/src/lib/utils/server-error.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {AuthorizationMessagePlaceholder, PaymentSettings} from "../../../../../models/companymanage/entity.model";
import {CompanySettingsLabels} from "../company-settings-labels";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {CustomValidator} from "../../../../../../../../common/src/lib/helpers/custom.validator";
import {Observable, throwError} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";
import {CheckboxItem} from "../../../../../../../../common/src/lib/components/checkbox/checkbox-item";
import {
  PaymentMethodTypeEnum,
  PaymentMethodTypeEnumValue
} from "../../../../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {SaleEmailAuthorizationMessagePlaceholderScopeEnum} from "../../../../../../../../common/src/lib/enums/sale/sale-email-authorization-message-placeholder-scope.enum";
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {EntityService} from "../../../../../../services/companymanagement/entity.service";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {deepEqual, ObjectHelper} from "../../../../../../../../common/src/lib/helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-company-settings-payment',
  templateUrl: './company-settings-payment.component.html',
  providers: [FormPageStateService]
})
export class CompanySettingsPaymentComponent extends AutoScrollingFormPageComponent implements OnInit, ComponentCanDeactivate {

  readonly Labels = CompanySettingsLabels;

  _allowCustomersManageTheirPaymentMethodsCreatedByMerchant: FormControl;

  _allowedPaymentMethods: FormControl;

  _invoicePartialPaymentsAllowed: FormControl;
  _salesOrderPartialPaymentsAllowed: FormControl;
  _depositPartialPaymentsAllowed: FormControl;

  _ccAuthorizationMessageTemplate: FormControl;
  _ccSurchargesAuthorizationMessageTemplate: FormControl;
  _achAuthorizationMessageTemplate: FormControl;

  _creditCardPaymentAmountLimit: FormControl;

  _surchargesEnabled: FormControl;
  _surchargesPercent: FormControl;

  private readonly _form: FormGroup = new FormGroup({});

  readonly SaleCreditCardSurchargesValue = {
    MAX: 4.00,
    MIN: 0.01,
    DEFAULT: null
  };

  get allowedPaymentMethodsOnVault(): PaymentMethodTypeEnum[] {
    return this.dictionaries?.allowedPaymentMethodsOnVault
  }

  get authorizationMessagePlaceholders(): AuthorizationMessagePlaceholder[] {
    return this.dictionaries?.authorizationMessagePlaceholders;
  }

  PaymentMethodTypeEnum = PaymentMethodTypeEnum;
  protected settings: PaymentSettings;

  private dictionaries: {
    allowedPaymentMethodsOnVault: PaymentMethodTypeEnum[],
    authorizationMessagePlaceholders: AuthorizationMessagePlaceholder[]
  };

  constructor(public formPageStateService: FormPageStateService,
              private fieldValidationErrorService: FieldValidationErrorService,
              protected elementRef: ElementRef,
              public serverErrorService: ServerErrorService,
              public errorService: ErrorService,
              private entityService: EntityService,
              public ch: ChangeDetectorRef,
              private _fb: FormBuilder) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }


  getSettings(): void {
    this.subscriptions.add(
      this.entityService.getPaymentSettings()
        .pipe(finalize(() => {

        }))
        .subscribe(result => {
          this.reInit(result);
        }));
  }

  protected onInit(): void {
    this.initForm();
    this.getSettings();
    this.wsKeyFormControlNameMap = this.getWsKeys();
  }

  getForm(): FormGroup {
    return this._form;
  }

  getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['allowCustomersManageTheirPaymentMethodsCreatedByMerchant', this._allowCustomersManageTheirPaymentMethodsCreatedByMerchant],
      ['allowedPaymentMethods', this._allowedPaymentMethods],
      ['invoicePartialPaymentsAllowed', this._invoicePartialPaymentsAllowed],
      ['salesOrderPartialPaymentsAllowed', this._salesOrderPartialPaymentsAllowed],
      ['depositPartialPaymentsAllowed', this._depositPartialPaymentsAllowed],
      ['achAuthorizationMessageTemplate', this._achAuthorizationMessageTemplate],
      ['ccAuthorizationMessageTemplate', this._ccAuthorizationMessageTemplate],
      ['ccSurchargesAuthorizationMessageTemplate', this._ccSurchargesAuthorizationMessageTemplate],
      ['creditCardPaymentAmountLimit', this._creditCardPaymentAmountLimit],
      ['surchargesEnabled', this._surchargesEnabled],
      ['surchargesPercent', this._surchargesPercent]
    ]);
  }

  private initForm(): void {
    this._allowCustomersManageTheirPaymentMethodsCreatedByMerchant = new FormControl(false, Validators.compose([]));
    this._invoicePartialPaymentsAllowed = new FormControl(true, Validators.compose([]));
    this._salesOrderPartialPaymentsAllowed = new FormControl(true, Validators.compose([]));
    this._depositPartialPaymentsAllowed = new FormControl(true, Validators.compose([]));
    this._allowedPaymentMethods = new FormControl(null, Validators.compose([c => CustomValidator.checkboxGroupRequiredValidation(this.Labels.PaymentMethods)(c)]));
    this._ccAuthorizationMessageTemplate = new FormControl(null, Validators.compose([
      c => CustomValidator.required(this.Labels.CCAuthorizationMessage)(c),
      c => CustomValidator.noJavascriptValidation(this.Labels.CCAuthorizationMessage)(c)
    ]));
    this._ccSurchargesAuthorizationMessageTemplate = new FormControl(null, Validators.compose([
      c => CustomValidator.required(this.Labels.CCSurchargesAuthorizationMessage)(c),
      c => CustomValidator.noJavascriptValidation(this.Labels.CCSurchargesAuthorizationMessage)(c)
    ]));
    this._achAuthorizationMessageTemplate = new FormControl(null, Validators.compose([
      c => CustomValidator.required(this.Labels.ACHAuthorizationMessage)(c),
      c => CustomValidator.noJavascriptValidation(this.Labels.ACHAuthorizationMessage)(c)
    ]));
    this._creditCardPaymentAmountLimit = new FormControl(null, Validators.compose([c => CustomValidator.minValueStrict(this.Labels.CCPaymentAmountMaxValue, 0)(c)]));
    this._surchargesEnabled = new FormControl(false);
    this._surchargesPercent = new FormControl<number>(null, c => CustomValidator.addIf(c1 => Validators.compose([c2 => CustomValidator.required(this.Labels.SurchargePercent)(c2), c2 => CustomValidator.minValue(this.Labels.SurchargePercent, this.SaleCreditCardSurchargesValue.MIN)(c2), c2 => CustomValidator.max(this.Labels.SurchargePercent, this.SaleCreditCardSurchargesValue.MAX)(c2)])(c1), this._surchargesEnabled.value)(c))
    this._form.addControl('allowCustomersManageTheirPaymentMethodsCreatedByMerchant', this._allowCustomersManageTheirPaymentMethodsCreatedByMerchant);
    this._form.addControl('invoicePartialPaymentsAllowed', this._invoicePartialPaymentsAllowed);
    this._form.addControl('salesOrderPartialPaymentsAllowed', this._salesOrderPartialPaymentsAllowed);
    this._form.addControl('depositPartialPaymentsAllowed', this._depositPartialPaymentsAllowed);
    this._form.addControl('allowedPaymentMethods', this._allowedPaymentMethods);
    this._form.addControl('ccAuthorizationMessageTemplate', this._ccAuthorizationMessageTemplate);
    this._form.addControl('ccSurchargesAuthorizationMessageTemplate', this._ccSurchargesAuthorizationMessageTemplate);
    this._form.addControl('achAuthorizationMessageTemplate', this._achAuthorizationMessageTemplate);
    this._form.addControl('creditCardPaymentAmountLimit', this._creditCardPaymentAmountLimit);
    this._form.addControl('surchargesEnabled', this._surchargesEnabled);
    this._form.addControl('surchargesPercent', this._surchargesPercent);

    this._allowedPaymentMethods.valueChanges.subscribe(
      value => {
        if (this.allowedPaymentMethods.indexOf(PaymentMethodTypeEnum.CREDIT_CARD) >= 0) {
          this._surchargesEnabled.enable();
          this._ccAuthorizationMessageTemplate.enable();
          if (!this._ccAuthorizationMessageTemplate.value) {
            this._ccAuthorizationMessageTemplate.setValue(this.settings?.defaultCcAuthorizationMessageTemplate);
          }
        } else {
          this._surchargesEnabled.reset({value: false, disabled: true});
          this._ccAuthorizationMessageTemplate.disable();
        }

        if (this.allowedPaymentMethods.indexOf(PaymentMethodTypeEnum.ACH) >= 0) {
          this._achAuthorizationMessageTemplate.enable();
          if (!this._achAuthorizationMessageTemplate.value) {
            this._achAuthorizationMessageTemplate.setValue(this.settings?.defaultAchAuthorizationMessageTemplate);
          }
        } else {
          this._achAuthorizationMessageTemplate.disable();
        }
      }
    );
    this._surchargesEnabled.valueChanges.subscribe(
      value => {
        if (value == true) {
          if (!ObjectHelper.isDefined(this._surchargesPercent.value)) {
            this._surchargesPercent.reset({
              value: this.SaleCreditCardSurchargesValue.DEFAULT,
              disabled: false
            });
          } else {
            this._surchargesPercent.enable();
          }
          this._ccSurchargesAuthorizationMessageTemplate.enable();
          if (!this._ccSurchargesAuthorizationMessageTemplate.value) {
            this._ccSurchargesAuthorizationMessageTemplate.setValue(this.settings?.defaultCcSurchargesAuthorizationMessageTemplate);
          }
        } else {
          this._surchargesPercent.disable();
          this._ccSurchargesAuthorizationMessageTemplate.disable();
        }
      }
    );
  }

  protected onReInit(newData: { settings: PaymentSettings, dictionaries: any }) {
    this.settings = newData.settings;
    this.dictionaries = newData.dictionaries;

    this._allowCustomersManageTheirPaymentMethodsCreatedByMerchant.reset(this.settings.allowCustomersManageTheirPaymentMethodsCreatedByMerchant);

    const availablePaymentMethodOptions: CheckboxItem[] = this.allowedPaymentMethodsOnVault?.map(entry => {
      const checked = this.settings.allowedPaymentMethods?.indexOf(PaymentMethodTypeEnum[entry]) >= 0;
      return new CheckboxItem(entry, PaymentMethodTypeEnumValue.get(entry), checked);
    });

    this._allowedPaymentMethods.reset(availablePaymentMethodOptions, {emitEvent: false});
    this._invoicePartialPaymentsAllowed.reset(this.settings.invoicePartialPaymentsAllowed);
    this._salesOrderPartialPaymentsAllowed.reset(this.settings.salesOrderPartialPaymentsAllowed);
    this._depositPartialPaymentsAllowed.reset(this.settings.depositPartialPaymentsAllowed);
    this._ccAuthorizationMessageTemplate.reset({
      value: this.settings.ccAuthorizationMessageTemplate,
      disabled: this.settings.allowedPaymentMethods?.indexOf(PaymentMethodTypeEnum.CREDIT_CARD) < 0
    });
    this._ccSurchargesAuthorizationMessageTemplate.reset({
      value: this.settings.ccSurchargesAuthorizationMessageTemplate,
      disabled: !this._surchargesEnabled.value
    });
    this._achAuthorizationMessageTemplate.reset({
      value: this.settings.achAuthorizationMessageTemplate,
      disabled: this.settings.allowedPaymentMethods?.indexOf(PaymentMethodTypeEnum.ACH) < 0
    });
    this._creditCardPaymentAmountLimit.reset(this.settings.creditCardPaymentAmountLimit);
    this._surchargesEnabled.reset(this.settings.surchargesFeature?.enabled ?? false);
    this._surchargesPercent.reset({
      value: this.settings.surchargesFeature?.percent,
      disabled: !this._surchargesEnabled.value
    });
    this._form.markAsPristine();
    this.ch.detectChanges();
  }

  get ccAuthorizationMessagePlaceholders(): AuthorizationMessagePlaceholder[] {
    return this.authorizationMessagePlaceholders?.filter(aum => aum.scope.find(s => s == SaleEmailAuthorizationMessagePlaceholderScopeEnum.CC_AUTHORIZATION_MESSAGE)) || [];
  }

  get ccSurchargesAuthorizationMessagePlaceholders(): AuthorizationMessagePlaceholder[] {
    return this.authorizationMessagePlaceholders?.filter(aum => aum.scope.find(s => s == SaleEmailAuthorizationMessagePlaceholderScopeEnum.CC_SURCHARGES_AUTHORIZATION_MESSAGE)) || [];
  }

  get achAuthorizationMessagePlaceholders(): AuthorizationMessagePlaceholder[] {
    return this.authorizationMessagePlaceholders?.filter(aum => aum.scope.find(s => s == SaleEmailAuthorizationMessagePlaceholderScopeEnum.ACH_AUTHORIZATION_MESSAGE)) || [];
  }

  get allowedPaymentMethods() {
    return this._allowedPaymentMethods.value?.filter(checkBoxItem => checkBoxItem.checked).map(checkBoxItem => checkBoxItem.value) || []
  }

  protected onSubmit(value) {
    this.subscriptions.add(this.entityService.updatePaymentSettings(this.value)
      .pipe(finalize(() => this.afterSubmit())).pipe(map(result => {
        this.errorService.alertService.showSuccess('', 'Payment Settings saved');
        this.getSettings();
      })).pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this);
        return throwError(error);
      }))
      .subscribe());
  }

  get value(): PaymentSettings {
    const settings = ObjectHelper.cloneDeep(this.settings);
    settings.allowCustomersManageTheirPaymentMethodsCreatedByMerchant = this._allowCustomersManageTheirPaymentMethodsCreatedByMerchant.value;
    settings.invoicePartialPaymentsAllowed = this._invoicePartialPaymentsAllowed.value;
    settings.salesOrderPartialPaymentsAllowed = this._salesOrderPartialPaymentsAllowed.value;
    settings.depositPartialPaymentsAllowed = this._depositPartialPaymentsAllowed.value;
    settings.allowedPaymentMethods = this.allowedPaymentMethods;
    settings.ccAuthorizationMessageTemplate = this._ccAuthorizationMessageTemplate.value;
    settings.ccSurchargesAuthorizationMessageTemplate = this._ccSurchargesAuthorizationMessageTemplate.value;
    settings.achAuthorizationMessageTemplate = this._achAuthorizationMessageTemplate.value;
    settings.creditCardPaymentAmountLimit = this._creditCardPaymentAmountLimit.value;
    settings.surchargesFeature = {
      enabled: this._surchargesEnabled.value,
      percent: this._surchargesPercent.value
    }
    return settings;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(PaymentSettings.toJSON(this.value), PaymentSettings.toJSON(this.settings));
  }

}
