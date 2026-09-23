import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NbDialogRef} from '@nebular/theme';
import {FormPageComponent} from '../../../../../../../../common/src/lib/pages/form-page.component';
import {FormPageStateService} from '../../../../../../../../common/src/lib/utils/form-page-state.service';
import {ErrorService} from '../../../../../../../../common/src/lib/utils/errorhandler/error.service';
import {CustomValidator} from '../../../../../../../../common/src/lib/helpers/custom.validator';
import {
  PaymentFormControlType,
  PaymentFormControlTypeValue
} from '../../../../../../../../common/src/lib/enums/payment-form-control-type.enum';
import {PaymentFormTemplateItem} from "../../../../../../../../common/src/lib/models/paymentform/payment-form-template.model";
import {ObjectHelper} from "../../../../../../../../common/src/lib/helpers/object.helper";


@Component({
  standalone: false,
  selector: 'app-payment-form-template-item-edit',
  templateUrl: './payment-form-template-item-edit.component.html',
  styleUrls: ['./payment-form-template-item-edit.component.scss', '../../../../../../../../common/src/lib/modals/external-modal.scss'],
  providers: [FormPageStateService]
})
export class PaymentFormTemplateItemEditComponent extends FormPageComponent implements OnInit {
  @Input() item: PaymentFormTemplateItem;

  readonly PaymentFormControlType = PaymentFormControlType;
  readonly PaymentFormControlTypeLabel = PaymentFormControlTypeValue;
  readonly MAX_LENGTH = {
    LABEL: 100,
    CONTENT: 4000
  };
  readonly richTextEditorOptions = {
    selectFontSize: true,
    selectFontColor: true,
    selectBackgroundColor: true,
    selectFontStyle: true,
    selectListStyle: false,
    selectAlignment: true
  };
  readonly optionPlaceholder = 'Option';
  private form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected _fb: FormBuilder,
              public errorService: ErrorService,
              private sanitizer: DomSanitizer,
              private dialogRef: NbDialogRef<PaymentFormTemplateItemEditComponent>) {
    super(formPageStateService, elementRef, errorService);
  }

  ngOnInit(): void {
    const isText = this.item.type === PaymentFormControlType.TEXT;
    const isSelect = this.item.type === PaymentFormControlType.SELECT;
    this.form = this._fb.group({
      label: [this.item.label, [
        c => CustomValidator.addIf(() => CustomValidator.required('Label')(c), !isText),
        c => CustomValidator.maxLength('Label', this.MAX_LENGTH.LABEL)(c)
      ]],
      requirement: [this.item.requirement ?? false],
      value: [this.item.value, [
        c => CustomValidator.addIf(() => CustomValidator.required('Text')(c), isText),
        c => CustomValidator.maxLength('Text', this.MAX_LENGTH.CONTENT)(c),
        c => CustomValidator.noJavascriptValidation('Text')(c)
      ]],
      options: this._fb.array(
        isSelect && this.item.options?.length
          ? this.item.options.map(option => this.createOptionControl(option))
          : isSelect ? [this.createOptionControl('')] : [],
        isSelect ? [c => CustomValidator.minItems('option', 1)(c)] : []
      )
    });
  }

  getForm(): FormGroup {
    return this.form;
  }

  close() {
    this.dialogRef.close();
  }

  protected onReInit() {
  }

  protected onSubmit(value: any) {
    const item = ObjectHelper.cloneDeep(this.item);
    if (item.type === PaymentFormControlType.TEXT) {
      item.value = value.value;
      item.label = null;
      item.requirement = false;
      item.options = [];
    } else if (item.type === PaymentFormControlType.LOGO) {
      item.label = null;
      item.requirement = false;
      item.value = null;
      item.options = [];
    } else {
      item.label = value.label;
      item.requirement = value.requirement;
      item.value = null;
      item.options = item.type === PaymentFormControlType.SELECT
        ? value.options.map(option => option.trim())
        : [];
    }
    this.dialogRef.close(item);
  }

  get optionsControl(): FormArray<FormControl<string>> {
    return this.form.get('options') as FormArray<FormControl<string>>;
  }

  addOption() {
    this.optionsControl.push(this.createOptionControl(''));
    this.optionsControl.updateValueAndValidity();
    this.optionsControl.markAsDirty();
    this.optionsControl.markAsTouched();
  }

  removeOption(index: number) {
    this.optionsControl.removeAt(index);
    this.optionsControl.updateValueAndValidity();
    this.optionsControl.markAsDirty();
    this.optionsControl.markAsTouched();
  }

  isSelect(): boolean {
    return this.item.type === PaymentFormControlType.SELECT;
  }

  isTextarea(): boolean {
    return this.item.type === PaymentFormControlType.TEXTAREA;
  }

  private createOptionControl(value: string): FormControl<string> {
    return this._fb.control(value, [
      c => CustomValidator.required('Option')(c),
      c => CustomValidator.maxLength('Option', this.MAX_LENGTH.LABEL)(c)
    ]);
  }

}
