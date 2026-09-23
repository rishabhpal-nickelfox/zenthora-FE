import {Component, ElementRef, HostListener, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY, Observable} from "rxjs";
import {catchError, finalize, switchMap, tap} from "rxjs/operators";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import {ComponentCanDeactivate} from "../../../../../common/src/lib/pages/can-deactivate.component";
import {ServerErrorService} from "../../../../../common/src/lib/utils/server-error.service";
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {CustomerUserPersonalInfoLabels} from "./customer-user-personal-info-labels";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {
  CustomerUserPersonalInfoChangePasswordModalComponent
} from "./customer-user-personal-info-change-password-modal.component";
import {CustomValidator} from "../../../../../common/src/lib/helpers/custom.validator";
import {CurrentCustomerAdditionalInfoModel} from "../../../../../common/src/lib/models/payer/current-customer.model";
import {deepEqual, ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {ConfirmModalComponent} from "../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {CustomerRoutingService} from "../../../services/customer-routing.service";
import {ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-customer-user-personal-info-component',
  templateUrl: './customer-user-personal-info.component.html',
  providers: [FormPageStateService, ServerErrorService]
})
export class CustomerUserPersonalInfoComponent extends AutoScrollingFormPageComponent implements ComponentCanDeactivate {

  user: CurrentCustomerAdditionalInfoModel = new CurrentCustomerAdditionalInfoModel();
  readonly Labels = CustomerUserPersonalInfoLabels;

  protected _firstName = new FormControl(null, [
    c => CustomValidator.required(this.Labels.FirstName)(c),
    c => CustomValidator.maxLength(this.Labels.FirstName, this.NAME_MAX_LENGTH)(c)
  ]);
  protected _middleName = new FormControl(null, [
    c => CustomValidator.maxLength(this.Labels.MiddleName, this.NAME_MAX_LENGTH)(c)
  ]);
  protected _lastName = new FormControl(null, [
    c => CustomValidator.required(this.Labels.LastName)(c),
    c => CustomValidator.maxLength(this.Labels.LastName, this.NAME_MAX_LENGTH)(c)
  ]);



  readonly NAME_MAX_LENGTH = 100;

  private _form = this._fb.group({
    firstName: this._firstName,
    middleName: this._middleName,
    lastName: this._lastName
  });

  constructor(public formPageStateService: FormPageStateService,
              public serverErrorService: ServerErrorService,
              protected elementRef: ElementRef,
              private currentDataService: CustomerCurrentDataService,
              private fieldValidationErrorService: FieldValidationErrorService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: CustomerRoutingService,
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
      ['lastName', this._lastName]
    ]);
  }

  protected openChangePasswordComponent() {
    this.modalService.open(CustomerUserPersonalInfoChangePasswordModalComponent, {backdrop: 'static'});
    return false;
  }

  protected onUnregister(): void {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = this.Labels.UnregisterHeader;
    console.log(this.currentDataService.companyRole);
    modalRef.componentInstance.body = this.Labels.UnregisterBody(this.currentDataService.companyRole.name);
    modalRef.componentInstance.okButtonText = this.Labels.Yes;
    modalRef.componentInstance.cancelButtonText = this.Labels.No;
    modalRef.result
      .then(() => this.unregister())
      .catch(() => {
      });

  }

  private unregister(): void {
    this.subscriptions.add(this.currentDataService.unregister().pipe(tap(() => {
      this.errorService.showSuccess('', this.Labels.Unregistered(this.currentDataService.companyRole.name));
      this.routingService.navigateLoginPageAndBroadcast();
    })).subscribe());
  }

  protected onInit(): void {
    this.reInit();
  }

  protected onReInit() {
    this.currentDataService.getAdditionalInfo().pipe(
      tap(result => {
        this.user = result;
        this.resetForm(result);
      }),
      finalize(() => this.unlockSubmit())
    ).subscribe();
  }

  protected resetForm(user: CurrentCustomerAdditionalInfoModel) {
    this._form.reset({
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName
    });
  }

  protected onSubmit(value) {
    this.lockSubmit();
    this.subscriptions.add(
      this.currentDataService.updateAdditionalInfo(this.value).pipe(
        tap(() => {
          this.errorService.alertService.showSuccess('Success', 'Personal Info Updated');
        }),
        switchMap(() => this.currentDataService.getAdditionalInfo()),
        tap(result => {
          this.user = result;
          this.resetForm(result);
          this.afterSubmit();
        }),
        catchError(error => {
          this.fieldValidationErrorService.error(error, this);
          return EMPTY;
        }),
        finalize(() => this.unlockSubmit())
      ).subscribe()
    );
  }


  get value(): CurrentCustomerAdditionalInfoModel {
    return Object.assign(ObjectHelper.cloneDeep(this.user), this.getForm().getRawValue());
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(this.value, this.user);
  }
}
