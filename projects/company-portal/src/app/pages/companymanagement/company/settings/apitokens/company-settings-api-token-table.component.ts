import {Component} from '@angular/core';
import {TableComponent} from '../../../../../../../../common/src/lib/table/table.component';

@Component({
  standalone: false,
  selector: 'app-company-settings-api-token-table',
  templateUrl: '../../../../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../../../../common/src/lib/table/table.component.scss', './company-settings-api-tokens.component.scss']
})
export class CompanySettingsApiTokenTableComponent extends TableComponent {

  tokenLimit = 0
  activeTokensCount = 0;

  protected onResult(res) {
    super.onResult(res);
    this.activeTokensCount = res.activeTokensCount;
    this.tokenLimit = res.tokenLimit;
  }

}
