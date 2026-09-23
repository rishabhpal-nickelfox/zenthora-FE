import {ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {TableComponent} from "../../../../../common/src/lib/table/table.component";
import {FilterSelectComponent} from "../../../../../common/src/lib/table/filter/filter-select.component";
import {Router} from "@angular/router";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {ObjectOperatingService} from "../../../../../common/src/lib/utils/object-operating.service";
import {CustomerTransactionService} from "../../../services/customer-transaction.service";
import {finalize} from "rxjs/operators";
import {FileService} from "../../../../../common/src/lib/utils/file.service";

@Component({
  standalone: false,
  selector: 'app-customer-transaction-table',
  templateUrl: '../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss']
})
export class CustomerTransactionTableComponent extends TableComponent {

  static readonly USER_ID_CODE = 'userId';
  userIds: number[] = [];

  @Input() objectOperatingService: CustomerTransactionService;

  constructor(protected elementRef: ElementRef,
              protected router: Router,
              protected tableViewSettingsService: TableViewSettingsService,
              protected cd: ChangeDetectorRef,
              protected fileService: FileService) {
    super(elementRef, router, tableViewSettingsService, cd, fileService);
  }

  protected onResult(res) {
    super.onResult(res);
    this.userIds = res.userIds ?? [];
    const userIdsFilter =
      this.filterComponents.find(filter => filter.filterProperty === CustomerTransactionTableComponent.USER_ID_CODE);
    (<FilterSelectComponent>userIdsFilter.instance).updateOptions(this.userIds);
  }
}
