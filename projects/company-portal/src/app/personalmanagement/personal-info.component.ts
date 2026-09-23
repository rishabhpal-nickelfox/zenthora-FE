import {Component, ElementRef, HostListener} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorService} from '../../../../common/src/lib/utils/errorhandler/error.service';
import {CompanyCurrentDataService} from '../../services/company-current-data.service';
import {FormPageStateService} from "../../../../common/src/lib/utils/form-page-state.service";
import {
  FieldValidationErrorService
} from "../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ServerErrorService} from "../../../../common/src/lib/utils/server-error.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserModel} from "../models/usermanagement/user.model";
import {ChangePasswordModalComponent} from "./chagepassword/change-password-modal.component";
import {PersonalInfoLabels} from "./personal-info-labels";
import {AutoScrollingFormPageComponent} from "../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {CustomValidator} from "../../../../common/src/lib/helpers/custom.validator";
import {ComponentCanDeactivate} from "../../../../common/src/lib/pages/can-deactivate.component";
import {Observable, throwError} from "rxjs";
import {deepEqual, ObjectHelper} from "../../../../common/src/lib/helpers/object.helper";
import {CurrentUserUpdateRequest} from "../models/usermanagement/user-request.model";
import {catchError, finalize, map} from "rxjs/operators";

@Component({
  standalone: false,
  selector: 'app-personal-info-component',
  templateUrl: './personal-info.component.html',
  providers: [FormPageStateService, ServerErrorService]
})
export class PersonalInfoComponent extends AutoScrollingFormPageComponent implements ComponentCanDeactivate {

  user: UserModel;

  _firstName: FormControl;
  _middleName: FormControl;
  _lastName: FormControl;
  _username: FormControl;
  _contactInfo: FormGroup;
  _mainPhone: FormControl;
  _workPhone: FormControl;
  _mobile: FormControl;
  _fax: FormControl;
  _ccEmail: FormControl;

  readonly Labels = PersonalInfoLabels;

  readonly NAME_MAX_LENGTH = 100;
  readonly EMAIL_MAX_LENGTH = 100;

  private _form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              private currentDataService: CompanyCurrentDataService,
              private fieldValidationErrorService: FieldValidationErrorService,
              private modalService: NgbModal,
              private _fb: FormBuilder,
              public errorService: ErrorService) {
    super(formPageStateService, elementRef, errorService, serverErrorService);
  }

  getForm(): FormGroup {
    return this._form;
  }

  public getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['firstName', this._firstName],
      ['middleName', this._middleName],
      ['lastName', this._lastName],
      ['email', this._username],
      ['login', this._username],
      ['contactInfo.mainPhone', this._mainPhone],
      ['contactInfo.workPhone', this._workPhone],
      ['contactInfo.mobile', this._mobile],
      ['contactInfo.fax', this._fax],
      ['contactInfo.ccEmail', this._ccEmail]
    ]);
  }

  openChangePasswordComponent() {
    this.modalService.open(ChangePasswordModalComponent, {backdrop: 'static'});
    return false;
  }

  protected onInit(): void {
    this._firstName = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.FirstName)(c), c => CustomValidator.maxLength(this.Labels.FirstName, this.NAME_MAX_LENGTH)(c)]));
    this._middleName = new FormControl(null, Validators.compose([c => CustomValidator.maxLength(this.Labels.MiddleName, this.NAME_MAX_LENGTH)(c)]));
    this._lastName = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.LastName)(c), c => CustomValidator.maxLength(this.Labels.LastName, this.NAME_MAX_LENGTH)(c)]));
    this._username = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.Email)(c), c => CustomValidator.emailValidation(this.Labels.Email)(c), c => CustomValidator.maxLength(this.Labels.Email, this.EMAIL_MAX_LENGTH)(c)]));
    this._mainPhone = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.MainPhone)(c), c => CustomValidator.phoneValidation(this.Labels.MainPhone)(c)]));
    this._workPhone = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.WorkPhone)(c)]));
    this._mobile = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.Mobile)(c)]));
    this._fax = new FormControl(null, Validators.compose([c => CustomValidator.phoneValidation(this.Labels.Fax)(c)]));
    this._ccEmail = new FormControl(null, Validators.compose([c => CustomValidator.emailValidation(this.Labels.CCEmail)(c), c => CustomValidator.maxLength(this.Labels.CCEmail, this.EMAIL_MAX_LENGTH)(c)]));

    this._contactInfo = this._fb.group({
      mainPhone: this._mainPhone,
      workPhone: this._workPhone,
      mobile: this._mobile,
      fax: this._fax,
      ccEmail: this._ccEmail
    });
    this._form = this._fb.group({
      firstName: this._firstName,
      middleName: this._middleName,
      lastName: this._lastName,
      username: this._username,
      contactInfo: this._contactInfo
    });

    this.reInit();

  }

  protected onReInit() {
    this.subscriptions.add(
      this.currentDataService.getAdditionalInfoForCurrentUser().subscribe(result => {
        this.unlockSubmit();
        this.user = result;
        this.resetForm(this.user);
      }, error => {
        this.fieldValidationErrorService.error(error, this);
      })
    );
  }

  protected resetForm(user: UserModel) {
    this._firstName.reset(user.firstName, {emitEvent: false});
    this._middleName.reset(user.middleName, {emitEvent: false});
    this._lastName.reset(user.lastName, {emitEvent: false});
    this._username.reset(user.username, {emitEvent: false});
    this._mainPhone.reset(user.contactInfo.mainPhone, {emitEvent: false});
    this._workPhone.reset(user.contactInfo.workPhone, {emitEvent: false});
    this._mobile.reset(user.contactInfo.mobile, {emitEvent: false});
    this._fax.reset(user.contactInfo.fax, {emitEvent: false});
    this._ccEmail.reset(user.contactInfo.ccEmail, {emitEvent: false});
    this._form.markAsPristine();
  }

  protected onSubmit(value) {
    this.currentDataService.updateCurrentUser(this.value).pipe(
      map(success => {
        this.errorService.alertService.showSuccess('Success', 'Personal Info Updated');
        this.onReInit();
      }),
      catchError(error => {
        this.fieldValidationErrorService.error(error, this);
        return throwError(error);
      }),
      finalize(() => this.afterSubmit())
    ).subscribe();
  }


  get value(): UserModel {
    return Object.assign(ObjectHelper.cloneDeep(this.user), this.getForm().getRawValue());
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(CurrentUserUpdateRequest.toJSON(this.value), CurrentUserUpdateRequest.toJSON(this.user));
  }
}
