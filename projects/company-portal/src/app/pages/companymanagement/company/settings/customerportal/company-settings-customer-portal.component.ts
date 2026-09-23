import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";
import {ServerErrorService} from "../../../../../../../../common/src/lib/utils/server-error.service";

import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {CustomerPortalSettings, EntityModel, TemplateSettings} from "../../../../../models/companymanage/entity.model";
import {CompanySettingsLabels} from "../company-settings-labels";
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {EntityService} from "../../../../../../services/companymanagement/entity.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {catchError, finalize, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {CompanyThemeSettingsComponent} from "./theme/company-theme-settings.component";
import {TableViewSettingsService} from "../../../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../../../services/company-table-view-settings.service";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {deepEqual} from "../../../../../../../../common/src/lib/helpers/object.helper";


@Component({
  standalone: false,
  selector: 'app-company-settings-customer-portal',
  templateUrl: './company-settings-customer-portal.component.html',
  styleUrls: ['./company-settings-customer-portal.component.scss'],
  providers: [FormPageStateService, ServerErrorService, {
    provide: TableViewSettingsService,
    useClass: CompanyTableViewSettingsService,
    multi: false
  }]
})
export class CompanySettingsCustomerPortalComponent extends AutoScrollingFormPageComponent implements OnInit, ComponentCanDeactivate {
  settings: CustomerPortalSettings;
  form;

  protected readonly Labels = CompanySettingsLabels;

  @ViewChild('companyThemeSettingsComponent') companyThemeSettingsComponent: CompanyThemeSettingsComponent;

  constructor(public formPageStateService: FormPageStateService, private fieldValidationErrorService: FieldValidationErrorService, protected elementRef: ElementRef, public errorService: ErrorService, private entityService: EntityService, public ch: ChangeDetectorRef, private _fb: FormBuilder) {
    super(formPageStateService, elementRef, errorService);
  }


  getSettings(): void {
    this.subscriptions.add(
      this.entityService.getCustomerPortalSettings()
        .pipe(finalize(() => {

        }))
        .subscribe(result => {
          this.reInit(result);
        }));
  }


  ngOnInit(): void {
    this.initForm();
    this.getSettings();
    this.wsKeyFormControlNameMap = new Map([]);
  }


  initForm(): void {
    this.form = this._fb.group({
      favicon: [null, Validators.compose([])]
    });

  }

  getForm(): FormGroup {
    return this.form;
  }

  protected onReInit(newData: CustomerPortalSettings): void {
    if (!newData.theme && this.companyThemeSettingsComponent) {
      newData.theme = new Map(this.companyThemeSettingsComponent.theme);
    }
    this.settings = newData;
    this.updateFormValues();
  }

  protected onSubmit({value}: { value: any }) {
    this.subscriptions.add(this.entityService.updateCustomerPortalSettings(this.value)
      .pipe(finalize(() => this.afterSubmit())).pipe(map(result => {
        this.errorService.alertService.showSuccess('', 'Company Customer Portal Settings saved');
        this.getSettings();
      })).pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this);
        return throwError(error);
      }))
      .subscribe());
  }

  private updateFormValues() {
    this.form.patchValue({
      favicon: this.settings.favicon
    }, {emitEvent: false});

    this.getForm().markAsPristine();
    this.ch.detectChanges();
  }

  get value(): CustomerPortalSettings {
    const settings: CustomerPortalSettings = new CustomerPortalSettings();
    settings.favicon = this.getForm().getRawValue().favicon;
    settings.theme = this.companyThemeSettingsComponent.theme;
    return settings;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    if (!this.settings || !this.companyThemeSettingsComponent) {
      return false;
    }
    return !deepEqual(CustomerPortalSettings.toJSON(this.value), CustomerPortalSettings.toJSON(this.settings));
  }

}
