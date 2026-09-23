import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";
import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {TemplateSettings} from "../../../../../models/companymanage/entity.model";
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {EntityService} from "../../../../../../services/companymanagement/entity.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {catchError, finalize, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {deepEqual} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {InvoiceEmailPaymentTemplateComponent, ReceiptTemplateEditorComponent} from "@eps/common";

@Component({
  standalone: false,
  selector: 'app-company-settings-template',
  templateUrl: './company-settings-template.component.html',
  styleUrls: ['company-settings-template.component.scss'],
  providers: [FormPageStateService]
})
export class CompanySettingsTemplateComponent extends AutoScrollingFormPageComponent implements OnInit, ComponentCanDeactivate {
  settings: TemplateSettings;
  form;

  emailPaymentTemplateComponent: InvoiceEmailPaymentTemplateComponent;
  receiptTemplateEditorComponent: ReceiptTemplateEditorComponent;

  constructor(public formPageStateService: FormPageStateService, private fieldValidationErrorService: FieldValidationErrorService, protected elementRef: ElementRef, public errorService: ErrorService, private entityService: EntityService, public ch: ChangeDetectorRef, private _fb: FormBuilder) {
    super(formPageStateService, elementRef, errorService);
  }


  getSettings(): void {
    this.subscriptions.add(
      this.entityService.getTemplateSettings()
        .pipe(finalize(() => {
        }))
        .subscribe(result => {
          this.reInit(result);
        }));
  }

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.getSettings();
    this.wsKeyFormControlNameMap = new Map([]);
  }

  getForm(): FormGroup {
    return this.form;
  }


  @ViewChild('emailPaymentTemplate') set emailPaymentTemplateContent(content: InvoiceEmailPaymentTemplateComponent) {
    this.emailPaymentTemplateComponent = content;
  }

  @ViewChild('receiptTemplateEditor') set receiptTemplateEditorContent(content: ReceiptTemplateEditorComponent) {
    this.receiptTemplateEditorComponent = content;
    if (this.receiptTemplateEditorComponent && this.settings) {
      this.receiptTemplateEditorComponent.reInit(this.settings.receiptTemplate ?? this.settings.defaultReceiptTemplate);
    }
  }

  protected onReInit(newData: TemplateSettings) {
    this.settings = newData;
    if (this.emailPaymentTemplateComponent) {
      this.emailPaymentTemplateComponent.reInit({
        emailPaymentTemplate: this.settings.emailPaymentTemplate,
        defaultEmailPaymentTemplate: this.settings.defaultEmailPaymentTemplate,
        companyInfo: {
          displayName: this.settings.displayName,
          address: this.settings.address,
          contactInfo: this.settings.contactInfo,
          logo: this.settings.logo,
          customFieldsEnabled: this.settings.customFieldsEnabled,
          advancedFieldsEnabled: this.settings.advancedFieldsEnabled
        }
      });
    }
    if (this.receiptTemplateEditorComponent) {
      this.receiptTemplateEditorComponent.reInit(this.settings.receiptTemplate ?? this.settings.defaultReceiptTemplate);
    }
  }

  protected onSubmit(value) {
    this.subscriptions.add(this.entityService.updateTemplateSettings(this.value)
      .pipe(finalize(() => this.afterSubmit())).pipe(map(result => {
        this.errorService.alertService.showSuccess('', 'Templates Settings saved');
        this.getSettings();
      })).pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this);
        return throwError(error);
      }))
      .subscribe());
  }

  get companyInfo() {
    if (!this.settings) {
      return null;
    }

    return {
      displayName: this.settings.displayName,
      address: this.settings.address,
      contactInfo: this.settings.contactInfo,
      logo: this.settings.logo,
      customFieldsEnabled: this.settings.customFieldsEnabled
    }
  }

  get value(): TemplateSettings {
    const settings = new TemplateSettings();
    settings.emailPaymentTemplate = this.emailPaymentTemplateComponent.template;
    settings.receiptTemplate = this.receiptTemplateEditorComponent?.template;
    return settings;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(TemplateSettings.toJSON(this.value), TemplateSettings.toJSON(this.settings));
  }

}
