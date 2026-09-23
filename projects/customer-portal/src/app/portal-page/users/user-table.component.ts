import {Component} from '@angular/core';
import {TableComponent} from "../../../../../common/src/lib/table/table.component";
import {PermissionModel} from "../../../models/permission.model";

@Component({
  standalone: false,
  selector: 'app-user-table',
  templateUrl: '../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss']
})
export class UserTableComponent extends TableComponent {

  permissions: PermissionModel[] = [];
  maxCustomerUsersInCustomer = 0;

  protected onResult(res) {
    super.onResult(res);
    this.permissions = res.permissions;
    this.maxCustomerUsersInCustomer = res.maxCustomerUsersInCustomer;
  }

}
