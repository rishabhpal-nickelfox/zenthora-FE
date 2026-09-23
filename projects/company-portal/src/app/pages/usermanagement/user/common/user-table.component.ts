import {TableComponent} from '../../../../../../../common/src/lib/table/table.component';
import {Component} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-user-table',
  templateUrl: '../../../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../../../common/src/lib/table/table.component.scss']
})
export class UserTableComponent extends TableComponent {

  maxUsersInCompany = 0;

  protected onResult(res) {
    super.onResult(res);
    this.maxUsersInCompany = res.maxUsersInCompany;
  }

}
