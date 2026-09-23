import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {CustomerCompanyRoleModel} from "../../../../../common/src/lib/models/payer/customer-company-role.model";
import {CustomerCompanySelectLabels} from "./customer-company-select-labels";
import {AccountTypeEnum, AccountTypeEnumValue} from "../../../../../common/src/lib/enums/sale/account-type.enum";
import {FormPageComponent} from "../../../../../common/src/lib/pages/form-page.component";

@Component({
  standalone: false,
  selector: 'app-customer-company-select',
  templateUrl: './customer-company-select.component.html',
  styleUrls: ['../../../../../common/src/lib/auth/common-auth.component.scss'],
  outputs: ['cancelEvent']
})
export class CustomerCompanySelectComponent extends FormPageComponent implements OnInit {
  @Output() selectCompany: EventEmitter<CustomerCompanySelectModel> = new EventEmitter();
  companyRolesWithCustomerPortalEnabled: CustomerCompanyRoleModel[];
  _companyId = new FormControl<number>(null);
  protected readonly Labels = CustomerCompanySelectLabels;
  protected readonly AccountTypeEnum = AccountTypeEnum;
  protected readonly AccountTypeEnumValue = AccountTypeEnumValue;
  private form = this._fb.group<CustomerCompanySelectFormGroupModel>({
    companyId: this._companyId
  });

  constructor(public formPageStateService: FormPageStateService,
              protected element: ElementRef, protected _fb: FormBuilder,
              public errorService: ErrorService) {
    super(formPageStateService, element, errorService);
  }

  private _email: string;

  get email(): string {
    return this._email;
  }

  getForm(): FormGroup {
    return this.form;
  }

  protected onReInit(data: { email: string, companies: CustomerCompanyRoleModel[] }) {
    this.companyRolesWithCustomerPortalEnabled = data.companies.filter(company => company.customerPortalEnabled);
    this._email = data.email;
    this._companyId.reset();
  }

  protected onSubmit({value}: { value: CustomerCompanySelectModel }) {
    this.selectCompany.emit({companyId: this._companyId.value});
  }
}

interface CustomerCompanySelectFormGroupModel {
  companyId: FormControl<number>;
}

export interface CustomerCompanySelectModel {
  companyId: number;
}
