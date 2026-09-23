import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormPageStateService} from '../../../../../common/src/lib/utils/form-page-state.service';
import {
  FieldValidationErrorService
} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {FormPageComponent} from "../../../../../common/src/lib/pages/form-page.component";
import {CompanyCurrentDataService} from "../../../../../company-portal/src/services/company-current-data.service";
import {finalize, map} from "rxjs/operators";
import {CustomerUserPersonalInfoLabels} from "./customer-user-personal-info-labels";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";

@Component({
  standalone: false,
  selector: 'app-customer-user-change-password-modal',
  templateUrl: './customer-user-personal-info-change-password-modal.component.html',
  styleUrls: ['../../../../../common/src/lib/modals/external-modal.scss'],
  providers: [FormPageStateService]
})
export class CustomerUserPersonalInfoChangePasswordModalComponent extends FormPageComponent {

  _changePassword: FormControl = new FormControl(null, Validators.required);
  private _form = this._fb.group({
    changePassword: this._changePassword
  });
  Labels = CustomerUserPersonalInfoLabels;
  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected currentDataService: CustomerCurrentDataService,
              protected fieldValidationErrorService: FieldValidationErrorService,
              protected _fb: FormBuilder, public errorService: ErrorService,
              protected _activeModal: NgbActiveModal) {
    super(formPageStateService, elementRef,
      errorService);
  }

  get activeModal() {
    return this._activeModal;
  }

  protected onSubmit() {
    this.subscriptions.add(
      this.currentDataService.changePassword(this._changePassword.value.oldPassword, this._changePassword.value.newPassword)
        .pipe(finalize(() => {
          this.afterSubmit();
        }))
        .pipe(map(() => {
          this.errorService.showSuccess(this.Labels.PasswordChangedMessage, null);

          this._activeModal.close();

        })).subscribe()
    )
  }

  getForm(): FormGroup {
    return this._form;
  }


  protected onReInit() {
  }

  protected onInit() {
    this.reInit();
  }
}
