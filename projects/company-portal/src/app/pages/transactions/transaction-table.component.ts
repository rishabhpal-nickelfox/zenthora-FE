import {ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {TableComponent} from "../../../../../common/src/lib/table/table.component";
import {Router} from "@angular/router";
import {TableViewSettingsService} from "../../../../../common/src/lib/utils/table-view-settings.service";
import {finalize} from "rxjs/operators";
import {FileService} from "../../../../../common/src/lib/utils/file.service";
import {TransactionService} from "../../../services/transaction/transaction.service";

@Component({
  standalone: false,
  selector: 'app-transaction-table',
  templateUrl: '../../../../../common/src/lib/table/table.component.html',
  styleUrls: ['../../../../../common/src/lib/table/table.component.scss']
})
export class TransactionTableComponent extends TableComponent {

  userIds: number[] = [];

  @Input() objectOperatingService: TransactionService;

  constructor(protected elementRef: ElementRef,
              protected router: Router,
              protected tableViewSettingsService: TableViewSettingsService,
              protected cd: ChangeDetectorRef,
              protected fileService: FileService) {
    super(elementRef, router, tableViewSettingsService, cd, fileService);
  }
}
