import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TextLabels} from './text-labels';
import {TextViewService} from './text-view.service';
import {FormPageStateService} from "../../../../utils/form-page-state.service";
import {FormPageComponent} from "../../../../pages/form-page.component";
import {CustomValidator} from "../../../../helpers/custom.validator";
import {ErrorService} from "../../../../utils/errorhandler/error.service";
import {NbDialogRef} from "@nebular/theme";
import {InvoiceEmailPaymentTemplateComponentsEnum,
    InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";
import {ExtendedCompanySettingsTextTemplatePlaceholderEnumValue
} from "../../../../enums/sale/company-settings-text-template-placeholder.enum";

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text.component.scss', '../../../../modals/external-modal.scss'],
  providers: [FormPageStateService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextEditComponent extends FormPageComponent implements OnInit {

  readonly Labels = TextLabels;
  styles: SafeStyle;
  readonly MAX_LENGTH = {
    text: 4000
  };

  defaultFontSize = 14;
  defaultColor = '#000000';

  protected _content = new FormControl<string>(null, Validators.compose([
    c => CustomValidator.required(this.Labels.Text)(c),
    c => CustomValidator.maxLength(this.Labels.Text, this.MAX_LENGTH.text)(c),
    c => CustomValidator.noJavascriptValidation(this.Labels.Text)(c)
  ]));
  private _form: FormGroup = new FormGroup({
      content: this._content
    }
  );
  private textId: string;

  afterInit = () => {
  };

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, protected ch: ChangeDetectorRef, protected dialogRef: NbDialogRef<TextEditComponent>) {
    super(formPageStateService, elementRef, errorService);
  }


  private _viewService: TextViewService;

  public get viewService(): TextViewService {
    return this._viewService;
  }

  public set viewService(value: TextViewService) {
    this._viewService = value;
  }

  ngOnInit() {
    this.afterInit();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  protected onReInit(textId: string) {
    this.textId = textId;
    const template = this.viewService.getTemplate(this.textId);
    this._content.reset(template.content);
    this.ch.detectChanges();
  }

  close() {
    this.dialogRef.close();
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.updateTemplate(this.textId, this._content.value);
    this.dialogRef.close();
  }


    protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
    protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
    protected readonly CompanySettingsTextTemplatePlaceholderEnumValue = ExtendedCompanySettingsTextTemplatePlaceholderEnumValue;
}
