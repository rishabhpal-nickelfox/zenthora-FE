import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {UserService} from '../../../../../../services/usermanagement/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorService} from '../../../../../../../../common/src/lib/utils/errorhandler/error.service';
import {ApiTokenModel} from '../../../../../models/apitoken/api-token.model';
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";
import {FormPageComponent} from "../../../../../../../../common/src/lib/pages/form-page.component";
import {deepEqual, isDefined, ObjectHelper} from '../../../../../../../../common/src/lib/helpers/object.helper';
import {Observable} from "rxjs";

@Component({
  standalone: false,
  selector: 'app-company-settings-api-token-create-edit',
  templateUrl: './company-settings-api-token-create-edit.component.html',
  styleUrls: ['./company-settings-api-token-create-edit.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService]
})
export class CompanySettingsApiTokenCreateEditComponent extends FormPageComponent implements OnInit {
  apiToken: ApiTokenModel;

  wsKeyFormControlNameMap;

  private form: FormGroup;

  constructor(public formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              protected userService: UserService,
              protected _fb: FormBuilder,
              public errorService: ErrorService) {
    super(formPageStateService, elementRef, errorService);
  }

  ngOnInit(): void {
    this.apiToken = new ApiTokenModel();
    this.initForm();

    this.wsKeyFormControlNameMap = new Map([
      ['name', 'name']
    ]);
  }

  initForm() {
    this.form = this._fb.group({
      name: [null, Validators.compose([Validators.required, Validators.maxLength(100)])]
    });
  }

  protected onReInit(apiToken) {
    this.apiToken = apiToken;
    this.updateFormValues();
    this.getForm().markAsPristine();
  }

  private updateFormValues() {
    this.form.patchValue({
      name: this.apiToken.name
    }, {emitEvent: false});
  }

  protected onCancel() {
    this.cancelEvent.emit();
    return false;
  }

  getForm(): FormGroup {
    return this.form;
  }

  onSubmit(value) {
    this.saveEvent.emit(this.value);
    return false;
  }

  getWSKeyFormControlNameMap(): Map<string, string> {
    return this.wsKeyFormControlNameMap;
  }

  get showToken() {
    return isDefined(this.apiToken) && isDefined(this.apiToken.refreshToken);
  }

  copyRefreshToken() {
    const token = this.apiToken?.refreshToken;
    if (!token) {
      return;
    }
    const clipboard = navigator?.clipboard;
    const copied = clipboard?.writeText
      ? clipboard.writeText(token)
      : this.copyTextFallback(token);
    Promise.resolve(copied)
      .then(() => this.errorService.alertService.showSuccess('', 'Refresh Token copied'))
      .catch(() => {
        if (this.copyTextFallback(token)) {
          this.errorService.alertService.showSuccess('', 'Refresh Token copied');
        }
      });
  }

  private copyTextFallback(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  }


  get isCreateMode(): boolean{
    return !isDefined(this.apiToken.id)
  }

  get value(): ApiTokenModel {
    const apiToken = ObjectHelper.cloneDeep(this.apiToken);
    apiToken.name = this.getForm().controls.name.value;
    return apiToken;
  }

  objectChanged(): boolean | Observable<boolean> {
    return !deepEqual(ApiTokenModel.toJSON(this.value), ApiTokenModel.toJSON(this.apiToken));
  }
}
