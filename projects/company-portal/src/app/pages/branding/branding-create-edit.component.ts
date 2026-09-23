import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {BrandingLabels} from "./branding-labels";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";
import {deepEqual, ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {Observable} from "rxjs";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {BrandingModel} from "../../models/branding/branding.model";

@Component({
  standalone: false,
  selector: 'app-branding-createedit',
  templateUrl: './branding-create-edit.component.html',
  styleUrls: ['./branding-create-edit.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class BrandingCreateEditComponent extends AutoScrollingFormPageComponent implements OnInit {
  branding: BrandingModel;
  wsKeyFormControlNameMap;
  readonly Labels = BrandingLabels;
  readonly MAX_LENGTH = {
    NAME: 100,
    PORTAL_URL: 255,
    SALE_FROM: 255,
    RECEIPT_FROM: 255,
    EMAIL_FROM: 255,
    PRODUCT_NAME: 255,
    SIGNATURE_FORMATTED: 1000,
    SUPPORT_EMAIL: 255,
    SUPPORT_PHONE: 20
  };

  private _form: FormGroup;
  private _isCreateMode = true;

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, protected _fb: FormBuilder, public errorService: ErrorService, private ch: ChangeDetectorRef) {
    super(formPageStateService, elementRef, errorService);
  }


  ngOnInit(): void {
    this.branding = new BrandingModel();
    this.initForm();
    this.addValueChangeListeners();
  }

  _name = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.Name)(c),
      c => CustomValidator.maxLength(this.Labels.Name, this.MAX_LENGTH.NAME)(c)
    ])
  );

  _companyPortalUrl = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.CompanyPortalUrl)(c),
      c => CustomValidator.maxLength(this.Labels.CompanyPortalUrl, this.MAX_LENGTH.PORTAL_URL)(c),
      c => CustomValidator.urlValidation(this.Labels.CompanyPortalUrl)(c)
    ])
  );

  _customerPortalUrl = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.CustomerPortalUrl)(c),
      c => CustomValidator.maxLength(this.Labels.CustomerPortalUrl, this.MAX_LENGTH.PORTAL_URL)(c),
      c => CustomValidator.urlValidation(this.Labels.CustomerPortalUrl)(c)
    ])
  );

  _paymentFormsUrl = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.PaymentFormsUrl)(c),
      c => CustomValidator.maxLength(this.Labels.PaymentFormsUrl, this.MAX_LENGTH.PORTAL_URL)(c),
      c => CustomValidator.urlValidation(this.Labels.PaymentFormsUrl)(c)
    ])
  );

  _saleFrom = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.SaleFrom)(c),
      c => CustomValidator.maxLength(this.Labels.SaleFrom, this.MAX_LENGTH.SALE_FROM)(c),
      c => CustomValidator.emailValidation(this.Labels.SaleFrom)(c)
    ])
  );

  _receiptFrom = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.ReceiptFrom)(c),
      c => CustomValidator.maxLength(this.Labels.ReceiptFrom, this.MAX_LENGTH.RECEIPT_FROM)(c),
      c => CustomValidator.emailValidation(this.Labels.ReceiptFrom)(c)
    ])
  );

  _emailFrom = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.EmailFrom)(c),
      c => CustomValidator.maxLength(this.Labels.EmailFrom, this.MAX_LENGTH.EMAIL_FROM)(c),
      c => CustomValidator.emailValidation(this.Labels.EmailFrom)(c)
    ])
  );
  _productName = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.ProductName)(c),
      c => CustomValidator.maxLength(this.Labels.ProductName, this.MAX_LENGTH.PRODUCT_NAME)(c)
    ])
  );

  _signatureFormatted = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.SignatureFormatted)(c),
      c => CustomValidator.maxLength(this.Labels.SignatureFormatted, this.MAX_LENGTH.SIGNATURE_FORMATTED)(c)
    ])
  );

  _supportPhone = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.required(this.Labels.SupportPhone)(c),
      c => CustomValidator.maxLength(this.Labels.SupportPhone, this.MAX_LENGTH.SUPPORT_PHONE)(c)
    ])
  );

  _supportEmail = new FormControl(
    null,
    Validators.compose([
      c => CustomValidator.maxLength(this.Labels.SupportEmail, this.MAX_LENGTH.SUPPORT_EMAIL)(c),
      c => CustomValidator.required(this.Labels.SupportEmail)(c),
      c => CustomValidator.emailValidation(this.Labels.SupportEmail)(c)
    ])
  );


  _isDefault = new FormControl(null)

  getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl<any>>([
      ['name', this._name],
      ['companyPortalUrl', this._companyPortalUrl],
      ['customerPortalUrl', this._customerPortalUrl],
      ['paymentFormsUrl', this._paymentFormsUrl],
      ['saleFrom', this._saleFrom],
      ['receiptFrom', this._receiptFrom],
      ['emailFrom', this._emailFrom],
      ['productName', this._productName],
      ['signatureFormatted', this._signatureFormatted],
      ['supportPhone', this._supportPhone],
      ['supportEmail', this._supportEmail],
      ['isDefault', this._isDefault]
    ]);
  }

  initForm() {
    this._form = this._fb.group({
      name: this._name,
      companyPortalUrl: this._companyPortalUrl,
      customerPortalUrl: this._customerPortalUrl,
      paymentFormsUrl: this._paymentFormsUrl,
      saleFrom: this._saleFrom,
      receiptFrom: this._receiptFrom,
      emailFrom: this._emailFrom,
      productName: this._productName,
      signatureFormatted: this._signatureFormatted,
      supportPhone: this._supportPhone,
      supportEmail: this._supportEmail,
      isDefault: this._isDefault
    });

  }

  addValueChangeListeners() {
  }

  getForm(): FormGroup {
    return this._form;
  }

  onSubmit(value) {
    this.saveEvent.emit(this.value);
    return false;
  }


  protected onReInit(branding: BrandingModel) {
    this.branding = branding;

    this._isCreateMode = !ObjectHelper.isDefined(this.branding.id)
    this._form.patchValue({
      name: branding.name,
      companyPortalUrl: branding.companyPortalUrl,
      customerPortalUrl: branding.customerPortalUrl,
      paymentFormsUrl: branding.paymentFormsUrl,
      saleFrom: branding.saleFrom,
      receiptFrom: branding.receiptFrom,
      emailFrom: branding.emailFrom,
      productName: branding.productName,
      signatureFormatted: branding.signatureFormatted,
      supportPhone: branding.supportPhone,
      supportEmail: branding.supportEmail,
      isDefault: branding.isDefault
    });
    this._isDefault.disable({emitEvent: false});
    this.ch.detectChanges();
  }


  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }


  get value(): BrandingModel {
    const formValue = this.getForm().getRawValue();
    const settings: BrandingModel = ObjectHelper.cloneDeep(this.branding);

    settings.name = formValue.name;
    settings.companyPortalUrl = formValue.companyPortalUrl;
    settings.customerPortalUrl = formValue.customerPortalUrl;
    settings.paymentFormsUrl = formValue.paymentFormsUrl;
    settings.saleFrom = formValue.saleFrom;
    settings.receiptFrom = formValue.receiptFrom;
    settings.emailFrom = formValue.emailFrom;
    settings.productName = formValue.productName;
    settings.signatureFormatted = formValue.signatureFormatted;
    settings.supportPhone = formValue.supportPhone;
    settings.supportEmail = formValue.supportEmail;
    settings.isDefault = formValue.isDefault;
    return settings;
  }


  objectChanged(): boolean | Observable<boolean> {
    const valueJSON = BrandingModel.toJSON(this.value);
    const platformJSON = BrandingModel.toJSON(this.branding);
    return !deepEqual(valueJSON, platformJSON);
  }

  get isCreateMode() {
    return this._isCreateMode;
  }

}
