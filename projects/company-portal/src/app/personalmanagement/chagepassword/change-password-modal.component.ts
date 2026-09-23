import {Component, ElementRef, OnInit} from '@angular/core';
import {ChangePasswordComponent} from './change-password.component';
import {CompanyCurrentDataService} from '../../../services/company-current-data.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormPageStateService} from '../../../../../common/src/lib/utils/form-page-state.service';
import {FieldValidationErrorService} from "../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";

@Component({
  standalone: false,
  selector: 'app-company-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['../../../../../common/src/lib/modals/external-modal.scss'],
  providers: [FormPageStateService]
})
export class ChangePasswordModalComponent extends ChangePasswordComponent implements OnInit {
  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected currentDataService: CompanyCurrentDataService,
              protected fieldValidationErrorService: FieldValidationErrorService,
              protected _fb: FormBuilder, public errorService: ErrorService,
              protected _activeModal: NgbActiveModal) {
    super(formPageStateService, elementRef,
      currentDataService,
      fieldValidationErrorService,
      _fb,
      errorService);
  }

  get activeModal() {
    return this._activeModal;
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.passwordChanged.subscribe(() => {
        this.activeModal.close();
      })
    );
  }
}
