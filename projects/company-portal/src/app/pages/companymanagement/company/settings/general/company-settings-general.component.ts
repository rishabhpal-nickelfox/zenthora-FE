import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";

import {
  AutoScrollingFormPageComponent
} from "../../../../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {GeneralSettings} from "../../../../../models/companymanage/entity.model";
import {CompanySettingsLabels} from "../company-settings-labels";
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {EntityService} from "../../../../../../services/companymanagement/entity.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  CountryISO,
  CountryISOEnum,
  CountryISOShort
} from "../../../../../../../../common/src/lib/enums/utils/country-iso.enum";
import {USStateEnum, USStateEnumValue} from "../../../../../../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum, CAStateEnumValue} from "../../../../../../../../common/src/lib/enums/utils/ca-state.enum";
import {CustomValidator} from "../../../../../../../../common/src/lib/helpers/custom.validator";
import {catchError, finalize, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {deepEqual, isDefined, ObjectHelper} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {CountryEnum} from "../../../../../../../../common/src/lib/enums/utils/county.enum";


@Component({
  standalone: false,
  selector: 'app-company-settings-general',
  templateUrl: './company-settings-general.component.html',
  providers: [FormPageStateService]
})

export class CompanySettingsGeneralComponent extends AutoScrollingFormPageComponent implements OnInit {
  settings: GeneralSettings;
  form;
  readonly MAX_LENGTH = {
    LEGAL_NAME: 100,
    DISPLAY_NAME: 100,
    STREET: 100,
    CITY: 100,
    EMAIL: 100,
    WEBSITE: 1000,
    FROM: 100,
    SERVER: 100,
    PORT: 100,
    USER: 100,
    PASSWORD: 100,
    VAULT_AUTH_KEY: 100,
    ZIP: 20
  };
  zipMask = {
    mask: rawValue => this.MASK.COUNTRY_ZIP(rawValue, this.getForm().get('address.country').value), guide: false
  };
  protected readonly CountryISOShort = CountryISOShort;
  protected readonly CountryISOEnum = CountryISOEnum;
  protected readonly CountryISO = CountryISO;
  protected readonly USStateEnum = USStateEnum;
  protected readonly CAStateEnumValue = CAStateEnumValue;
  protected readonly USStateEnumValue = USStateEnumValue;
  protected readonly CAStateEnum = CAStateEnum;
  protected readonly Labels = CompanySettingsLabels;

  constructor(public formPageStateService: FormPageStateService, private fieldValidationErrorService: FieldValidationErrorService, protected elementRef: ElementRef, public errorService: ErrorService, private entityService: EntityService, public ch: ChangeDetectorRef, private _fb: FormBuilder) {
    super(formPageStateService, elementRef, errorService);
  }


  getSettings(): void {
    this.subscriptions.add(
      this.entityService.getGeneralSettings()
        .pipe(finalize(() => {
        }))
        .subscribe(result => {
          this.reInit(result);
        }));
  }


  ngOnInit(): void {
    this.initForm();
    this.getSettings();
    this.wsKeyFormControlNameMap = new Map([['displayName', 'displayName'], ['logo', 'logo'], ['contactInfo.phone', 'contactInfo.phone'], ['contactInfo.email', 'contactInfo.email'], ['contactInfo.website', 'contactInfo.website'], ['address.street', 'address.street'], ['address.city', 'address.city'], ['address.state', 'address.state'], ['address.country', 'address.country'], ['address.zip', 'address.zip']]);
  }


  initForm(): void {
    this.form = this._fb.group({
      legalName: [null, Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH.LEGAL_NAME)])],
      displayName: [null, Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH.DISPLAY_NAME)])],
      logo: [null, Validators.compose([])],
      contactInfo: this._fb.group({
        phone: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.required, CustomValidator.email, Validators.maxLength(this.MAX_LENGTH.EMAIL)])],
        website: [null, Validators.compose([Validators.required, CustomValidator.url, Validators.maxLength(this.MAX_LENGTH.WEBSITE)])]
      }),
      address: this._fb.group({
        street: [null, Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH.STREET)])],
        city: [null, Validators.compose([Validators.required, Validators.maxLength(this.MAX_LENGTH.CITY)])],
        country: [null, Validators.compose([Validators.required])],
        state: [null, Validators.compose([Validators.required])],
        zip: [null, Validators.compose([Validators.required, c => CustomValidator.countryZip(this.getForm()?.get('address.country').value)(c)])]
      })
    });

    this.subscriptions.add(this.getForm().get('address.country').valueChanges.subscribe(() => {
      this.getForm().get('address.zip').markAsDirty();
      this.getForm().get('address.zip').updateValueAndValidity();
    }));

  }

  getForm(): FormGroup {
    return this.form;
  }

  protected onReInit(newData: GeneralSettings): void {
    this.settings = newData;
    this.updateFormValues();
  }

  protected onSubmit(value) {
    const company: GeneralSettings = Object.assign({...this.settings}, value);
    this.subscriptions.add(this.entityService.updateGeneralSettings(company)
      .pipe(finalize(() => this.afterSubmit())).pipe(map(result => {
        this.errorService.alertService.showSuccess('', 'General Settings saved');
        this.getSettings();
      })).pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this);
        return throwError(error);
      }))
      .subscribe());
  }

  private updateFormValues() {
    const companyCountry = isDefined(this.settings.address.country) && this.enumKeys(CountryEnum).find(key => key === this.settings.address.country) ? this.settings.address.country : CountryISOEnum.US;
    const companyZIP = isDefined(this.settings.address.zip) ? this.MASK.transformValueToMaskedValue(this.settings.address.zip, this.MASK.COUNTRY_ZIP(this.settings.address.zip, companyCountry)) : null;
    this.form.patchValue({
      legalName: this.settings.legalName,
      displayName: this.settings.displayName,
      logo: this.settings.logo,
      address: {
        street: this.settings.address.street,
        city: this.settings.address.city,
        country: companyCountry,
        state: this.settings.address.state,
        zip: companyZIP
      },
      contactInfo: {
        phone: this.settings.contactInfo.phone,
        email: this.settings.contactInfo.email,
        website: this.settings.contactInfo.website
      }
    }, {emitEvent: false});

    this.getForm().markAsPristine();
    this.ch.detectChanges();
  }


  get value(): GeneralSettings {
    const newSettings = ObjectHelper.cloneDeep(this.settings);
    return Object.assign(newSettings, this.getForm().value);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(GeneralSettings.toJSON(this.value), GeneralSettings.toJSON(this.settings));
  }
}
