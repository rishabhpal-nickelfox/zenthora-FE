import {Component, ElementRef, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {deepEqual, ObjectHelper} from '../../../../../../../common/src/lib/helpers/object.helper';
import {CustomValidator} from '../../../../../../../common/src/lib/helpers/custom.validator';
import {FormPageComponent} from '../../../../../../../common/src/lib/pages/form-page.component';
import {FormPageStateService} from '../../../../../../../common/src/lib/utils/form-page-state.service';
import {ErrorService} from '../../../../../../../common/src/lib/utils/errorhandler/error.service';
import {PaymentFormModel} from '../../../../models/companymanage/payment-form.model';
import {CompanyPaymentFormsLabels} from './company-payment-forms-labels';

export interface PaymentFormCreateEditData {
  paymentForm: PaymentFormModel;
  paymentFormsCompanyId: string;
  paymentFormsUrl: string;
  paymentFormsCompanyLogo?: string;
  paymentFormsCompanyLogoContentType?: string;
}

@Component({
  standalone: false,
  selector: 'app-company-payment-form-create-edit',
  templateUrl: './company-payment-form-create-edit.component.html',
  styleUrls: ['./company-payment-form-create-edit.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class CompanyPaymentFormCreateEditComponent extends FormPageComponent implements OnInit {
  readonly Labels = CompanyPaymentFormsLabels;
  readonly MAX_LENGTH = 100;
  private readonly PAYMENT_FORM_PATTERN = '^[A-Za-z0-9-]+$';

  paymentForm = new PaymentFormModel();
  paymentFormsCompanyId: string;
  paymentFormsUrl: string;
  paymentFormsCompanyLogo: string;
  paymentFormsCompanyLogoContentType: string;
  paymentFormTemplate: string;
  private form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected _fb: FormBuilder,
              public errorService: ErrorService,
              private zone: NgZone) {
    super(formPageStateService, elementRef, errorService);
  }

  ngOnInit(): void {
    this.initForm();
    this.wsKeyFormControlNameMap = new Map([
      ['name', 'name'],
      ['paymentFormCode', 'paymentFormCode']
    ]);
  }

  initForm() {
    this.form = this._fb.group({
      name: [null, [
        c => CustomValidator.required(this.Labels.Name)(c),
        c => CustomValidator.maxLength(this.Labels.Name, this.MAX_LENGTH)(c)
      ]],
      paymentFormCode: [null, [
        c => CustomValidator.required(this.Labels.PaymentFormCode)(c),
        c => CustomValidator.maxLength(this.Labels.PaymentFormCode, this.MAX_LENGTH)(c),
        c => CustomValidator.pattern(this.Labels.PaymentFormCode, this.PAYMENT_FORM_PATTERN)(c)
      ]]
    });
  }

  protected onReInit(data: PaymentFormCreateEditData) {
    this.paymentForm = ObjectHelper.cloneDeep(data.paymentForm);
    this.paymentFormsCompanyId = data.paymentFormsCompanyId;
    this.paymentFormsUrl = data.paymentFormsUrl;
    this.paymentFormsCompanyLogo = data.paymentFormsCompanyLogo;
    this.paymentFormsCompanyLogoContentType = data.paymentFormsCompanyLogoContentType;
    this.paymentFormTemplate = this.paymentForm.paymentFormTemplate;
    this.getForm().patchValue({
      name: this.paymentForm.name,
      paymentFormCode: this.paymentForm.paymentFormCode
    }, {emitEvent: false});
    this.getForm().markAsPristine();
  }

  getForm(): FormGroup {
    return this.form;
  }

  onPaymentFormTemplateChange(template: string) {
    this.paymentFormTemplate = template;
  }

  get paymentFormUrl(): string {
    const paymentFormCodeControl = this.getForm()?.controls.paymentFormCode;
    const paymentFormCode = paymentFormCodeControl?.value;
    if (!this.paymentFormsUrl || !this.paymentFormsCompanyId || !paymentFormCode) {
      return null;
    }
    if (paymentFormCodeControl.invalid) {
      return null;
    }
    return `${this.paymentFormsUrl.replace(/\/$/, '')}/forms/${this.paymentFormsCompanyId}/${paymentFormCode}`;
  }

  copyPaymentFormUrl() {
    const url = this.paymentFormUrl;
    if (!url) {
      return;
    }
    const clipboard = navigator?.clipboard;
    const copied = clipboard?.writeText
      ? clipboard.writeText(url)
      : this.copyTextFallback(url);
    Promise.resolve(copied)
      .then(() => this.errorService.alertService.showSuccess('', this.Labels.PaymentFormUrlCopied))
      .catch(() => {
        if (this.copyTextFallback(url)) {
          this.errorService.alertService.showSuccess('', this.Labels.PaymentFormUrlCopied);
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

  onSubmit(value) {
    this.zone.run(() => this.saveEvent.emit(this.value));
    return false;
  }

  protected onCancel() {
    this.zone.run(() => this.cancelEvent.emit());
    return false;
  }

  get value(): PaymentFormModel {
    const paymentForm = ObjectHelper.cloneDeep(this.paymentForm);
    paymentForm.name = this.getForm().controls.name.value;
    paymentForm.paymentFormCode = this.getForm().controls.paymentFormCode.value;
    paymentForm.paymentFormTemplate = this.paymentFormTemplate;
    return paymentForm;
  }

  get isCreateMode(): boolean {
    return !this.paymentForm.id;
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(PaymentFormModel.toJSON(this.value), PaymentFormModel.toJSON(this.paymentForm));
  }
}
