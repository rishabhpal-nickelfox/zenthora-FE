import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {SafeHtml} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {catchError, finalize, tap} from 'rxjs/operators';
import {EMPTY, throwError} from 'rxjs';
import {AutoScrollingFormPageComponent} from '../../../../common/src/lib/pages/auto-scrolling-form-page.component';
import {FormPageStateService} from '../../../../common/src/lib/utils/form-page-state.service';
import {ErrorService} from '../../../../common/src/lib/utils/errorhandler/error.service';
import {ServerErrorService} from '../../../../common/src/lib/utils/server-error.service';
import {CustomValidator} from '../../../../common/src/lib/helpers/custom.validator';
import {CreditCardViewModel} from '../../../../common/src/lib/payment/creditcard/credit-card-info-group.component';
import {CreditCardViewService} from '../../../../common/src/lib/payment/creditcard/credit-card-view.service';
import {PaymentMethodViewModeEnum} from '../../../../common/src/lib/enums/sale/payment-method-view-mode.enum';
import {PaymentMethodTypeEnum} from '../../../../common/src/lib/enums/sale/payment-method-type.enum';
import {PaymentFormControlType} from '../../../../common/src/lib/enums/payment-form-control-type.enum';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {ROUTING_SERVICE_TOKEN} from '../../../../common/src/lib/utils/base-routing.service';
import {CustomerRoutingService} from '../../services/customer-routing.service';
import {PaymentFormPaymentLabels} from './payment-form-payment-labels';
import {AuthorizationMessageViewService} from '../../services/authorization-message-view.service';
import {SalePaymentViewService} from '../../services/sale-payment-view.service';
import {ObjectHelper} from '../../../../common/src/lib/helpers/object.helper';
import {HtmlSanitizerService} from '../../../../common/src/lib/utils/html-sanitizer.service';
import {MoneyHelper} from '../../../../common/src/lib/helpers/money.helper';
import {RecaptchaService} from '../../../../common/src/lib/utils/recaptcha.service';
import {RecaptchaActionEnum} from '../../../../common/src/lib/enums/utils/recaptcha-action.enum';
import {PaymentFormPaymentService} from "./payment-form-payment.service";
import {PaymentFormResponse} from "../../models/payment-form-payment.model";
import {PaymentFormTemplateItem} from "../../../../common/src/lib/models/paymentform/payment-form-template.model";
import {CountryISOEnum} from "../../../../common/src/lib/enums/utils/country-iso.enum";
import {BillingAddress} from "../../../../common/src/lib/models/common/address.model";

@Component({
  standalone: false,
  selector: 'app-payment-form-payment',
  templateUrl: './payment-form-payment.component.html',
  styleUrls: [
    '../../../../common/src/assets/payment-form.scss',
    'payment-form-payment.component.scss'
  ],
  providers: [FormPageStateService, ServerErrorService, CreditCardViewService]
})
export class PaymentFormPaymentComponent extends AutoScrollingFormPageComponent implements OnInit {
  readonly MAX_LENGTH = {
    INPUT: 1024
  };
  readonly Labels = PaymentFormPaymentLabels;
  readonly PaymentFormControlType = PaymentFormControlType;
  readonly ObjectHelper = ObjectHelper;
  currency;

  paymentFormsCompanyId: string;
  paymentFormCode: string;
  template: PaymentFormTemplateItem[] = [];
  paymentForm: PaymentFormResponse;
  loading = false;
  surchargeAmount: number;
  totalIncludingSurcharge: number;
  sanitizedAuthorizationMessage: SafeHtml;
  paymentResult: {
    paymentAmount: number;
    surchargeAmount: number;
    totalIncludingSurcharge: number;
    authorizationId: string;
    approvalId: string;
  };

  _paymentAmount = new FormControl<number>(null);
  _creditCard = new FormControl<CreditCardViewModel>(new CreditCardViewModel());
  _paymentFormTemplateControls = new FormGroup({});

  private form = this._fb.group<PaymentFormPaymentFormGroupModel>({
    paymentFormTemplateControls: this._paymentFormTemplateControls,
    paymentAmount: this._paymentAmount,
    creditCard: this._creditCard
  });

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              public errorService: ErrorService,
              public serverErrorService: ServerErrorService,
              private route: ActivatedRoute,
              private paymentFormPaymentService: PaymentFormPaymentService,
              private creditCardViewService: CreditCardViewService,
              @Inject(SETTINGS_PROVIDER_TOKEN) public settingsProvider: BaseSettingsProvider,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: CustomerRoutingService,
              private authorizationMessageViewService: AuthorizationMessageViewService,
              private htmlSanitizer: HtmlSanitizerService,
              private recaptchaService: RecaptchaService,
              private _fb: FormBuilder) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  protected onInit(): void {
    this.paymentFormsCompanyId = this.route.snapshot.paramMap.get('companyCode');
    this.paymentFormCode = this.route.snapshot.paramMap.get('paymentFormId');
    this.initCreditCardView();
    this.initValidators();
    this.loadPaymentForm();
  }

  getForm(): FormGroup<PaymentFormPaymentFormGroupModel> {
    return this.form;
  }

  getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['paymentAmount', this._paymentAmount],
      ['creditCardData', this._creditCard]
    ]);
  }

  protected onSubmit(value) {
    if (!this.creditCardAvailable) {
      return false;
    }
    const submitPayment = (recaptchaToken?: string) => this.submitPayment(recaptchaToken);
    if (this.settingsProvider.isRecaptchaEnabled()) {
      this.recaptchaService.recaptchaAndContinue(this, RecaptchaActionEnum.EMAIL_PAYMENT, submitPayment);
    } else {
      submitPayment();
    }
    return false;
  }

  private submitPayment(recaptchaToken?: string) {
    const paymentAmount = Number(this._paymentAmount.value);
    this.subscriptions.add(
      this.paymentFormPaymentService.processPayment(this.paymentFormsCompanyId, this.paymentFormCode, paymentAmount, this.surchargeAmount, this.authorizationMessage, this.getTemplateValues(), this._creditCard.value, recaptchaToken)
        .pipe(
          finalize(() => this.afterSubmit()),
          tap(result => {
            this.paymentResult = {
              paymentAmount,
              surchargeAmount: this.surchargeAmount,
              totalIncludingSurcharge: this.totalIncludingSurcharge,
              authorizationId: result.authorizationId,
              approvalId: result.approvalId
            };
            this.resetFormAfterSuccessfulPayment();
          })
        )
        .subscribe()
    );
  }

  protected onReInit(data?: any) {
  }

  getTemplateControl(id: string): FormControl {
    return this._paymentFormTemplateControls.get(id) as FormControl;
  }

  getGridColumn(item: PaymentFormTemplateItem): string {
    return `${item.x + 1} / span ${item.cols}`;
  }

  getGridRow(item: PaymentFormTemplateItem): string {
    return `${item.y + 1} / span ${item.rows}`;
  }

  isAtOriginalSize(item: PaymentFormTemplateItem): boolean {
    return ObjectHelper.isDefined(item.originalCols) && ObjectHelper.isDefined(item.originalRows)
      && item.cols === item.originalCols && item.rows === item.originalRows;
  }

  get creditCardAvailable(): boolean {
    const allowedPaymentMethods = this.paymentForm?.companyInfo?.allowedPaymentMethods;
    return !!allowedPaymentMethods?.includes(PaymentMethodTypeEnum.CREDIT_CARD);
  }

  get legalName(): string {
    return this.paymentForm?.companyInfo?.legalName ?? '';
  }

  get logoPreview() {
    const info = this.paymentForm?.companyInfo;
    return info?.logo ? `data:${info.logoContentType};base64,${info.logo}` : null;
  }


  private initCreditCardView() {
    this.creditCardViewService.globalPaymentsEnabled = true;
    this.creditCardViewService.showCvv = true;
    this.creditCardViewService.mode = PaymentMethodViewModeEnum.CREATE;
  }

  private initValidators() {
    this._paymentAmount.setValidators(Validators.compose([
      c => CustomValidator.required(this.Labels.PaymentAmount)(c),
      c => CustomValidator.minValueStrict(this.Labels.PaymentAmount, 0)(c)
    ]));

    this.subscriptions.add(this._paymentAmount.valueChanges.subscribe(() => this.onPaymentFormValueChanges()));
    this.subscriptions.add(this._creditCard.valueChanges.subscribe(() => this.onPaymentFormValueChanges()));
  }

  private loadPaymentForm() {
    this.loading = true;
    this.subscriptions.add(
      this.paymentFormPaymentService.getPaymentForm(this.paymentFormsCompanyId, this.paymentFormCode)
        .pipe(tap(response => this.initPaymentForm(response)))
        .pipe(catchError((error: HttpErrorResponse) => this.redirectToPortalOnNotFound(error)))
        .pipe(finalize(() => this.loading = false))
        .subscribe()
    );
  }

  private initPaymentForm(response: PaymentFormResponse) {
    this.paymentForm = response;
    this.currency = MoneyHelper.getCurrencyPrefix(response.currency) ?? this.currency;
    this.creditCardViewService.globalPaymentsEnabled = response.companyInfo?.globalPaymentsEnabled ?? false;
    this.initDefaultCountry(response.companyInfo?.country);
    this._paymentAmount.updateValueAndValidity();
    this.initTemplate(response.template);
    this.onPaymentFormValueChanges();
  }

  private initDefaultCountry(country: CountryISOEnum) {
    this.creditCardViewService.defaultAddress = {country} as BillingAddress;
    const creditCard = new CreditCardViewModel();
    creditCard.country = this.creditCardViewService.defaultCountry;
    this._creditCard.setValue(creditCard);
  }

  private initTemplate(template: string) {
    this.template = PaymentFormTemplateItem.parseTemplate(template).sort((a, b) => a.y - b.y || a.x - b.x);
    Object.keys(this._paymentFormTemplateControls.controls).forEach(key => this._paymentFormTemplateControls.removeControl(key));
    this.template
      .filter(item => item.type !== PaymentFormControlType.TEXT && item.type !== PaymentFormControlType.LOGO && item.type !== PaymentFormControlType.IMAGE && item.id)
      .forEach(item => {
        const validators = [];
        if (item.type == PaymentFormControlType.INPUT || item.type == PaymentFormControlType.TEXTAREA) {
          validators.push(CustomValidator.maxLength(item.label, this.MAX_LENGTH.INPUT));
        }
        if (item.requirement) {
          validators.push(CustomValidator.required(item.label));
        }
        this._paymentFormTemplateControls.addControl(item.id, new FormControl(null, validators))
      });
  }

  private redirectToPortalOnNotFound(error: HttpErrorResponse) {
    if (this.errorService.is404NotFound(error)) {
      this.routingService.navigateFirstUrl();
      return EMPTY;
    }
    return throwError(error);
  }

  private onPaymentFormValueChanges() {
    if (!this.creditCardAvailable) {
      this.surchargeAmount = null;
      this.totalIncludingSurcharge = null;
      this.sanitizedAuthorizationMessage = null;
      return;
    }
    this.surchargeAmount = SalePaymentViewService.calculateSurchargeByPercent(
      this._paymentAmount.value,
      PaymentMethodTypeEnum.CREDIT_CARD,
      this._creditCard.value,
      this.paymentForm?.companyInfo?.surchargePercent,
      this.paymentForm?.companyInfo?.surchargeProhibitedStates ?? []
    );
    this.totalIncludingSurcharge = SalePaymentViewService.calculateTotal(this._paymentAmount.value, this.surchargeAmount);
    this.sanitizedAuthorizationMessage = this.htmlSanitizer.sanitizeToSafeHtml(this.authorizationMessage);
  }

  private get authorizationMessage(): string {
    const creditCardAuthorizationMessage = ObjectHelper.isDefined(this.surchargeAmount)
      ? this.paymentForm?.companyInfo?.creditCardSurchargesAuthorizationMessage
      : this.paymentForm?.companyInfo?.creditCardAuthorizationMessage;
    return this.authorizationMessageViewService.getAuthorizationMessage(
      this._paymentAmount.value,
      this.surchargeAmount,
      this.totalIncludingSurcharge,
      PaymentMethodTypeEnum.CREDIT_CARD,
      this._creditCard.value,
      creditCardAuthorizationMessage,
      null,
      this.Labels.ProcessPayment,
      '',
      ''
    );
  }

  private getTemplateValues(): PaymentFormTemplateItem[] {
    return this.template
      .filter(item => item.type !== PaymentFormControlType.TEXT && item.type !== PaymentFormControlType.LOGO && item.type !== PaymentFormControlType.IMAGE)
      .map(item => ({
        ...item,
        value: this._paymentFormTemplateControls.get(item.id)?.value
      }));
  }

  private resetFormAfterSuccessfulPayment() {
    const creditCard = new CreditCardViewModel();
    creditCard.country = this.creditCardViewService.defaultCountry;
    this.getForm().reset({
      paymentFormTemplateControls: {},
      paymentAmount: null,
      creditCard
    });
    this.formPageStateService.setSubmittedState(false);
    this.getForm().markAsPristine();
    this.getForm().markAsUntouched();
    this.getForm().updateValueAndValidity();
    this.scroll();
  }


}

interface PaymentFormPaymentFormGroupModel {
  paymentFormTemplateControls: FormGroup;
  paymentAmount: FormControl<number>;
  creditCard: FormControl<CreditCardViewModel>;
}
