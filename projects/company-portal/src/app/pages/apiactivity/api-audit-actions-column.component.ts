import {Component, Input, OnInit} from '@angular/core';
import {
  ApiAuditActionEnum,
  ApiAuditActionEnumValue
} from "../../../../../common/src/lib/enums/apiaudit/api-audit-action.enum";

@Component({
  standalone: false,
  selector: 'app-api-audit-actions-column',
  templateUrl: './api-audit-actions-column.component.html'
})

export class ApiAuditActionsColumnComponent implements OnInit {

  @Input() action;
  protected readonly ApiAuditActionEnum = ApiAuditActionEnum;
  protected readonly ApiAuditActionEnumValue = ApiAuditActionEnumValue;

  ngOnInit(): void {
   }
}
