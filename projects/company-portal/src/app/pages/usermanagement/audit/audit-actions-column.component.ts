import {Component, Input, OnInit} from '@angular/core';
import {AuditActionEnum} from '../../../../enums/usermanagement/audit-action.enum';

@Component({
  standalone: false,
  selector: 'app-new-audit-actions-column',
  templateUrl: './audit-actions-column.component.html'
})

export class AuditActionsColumnComponent implements OnInit {

  @Input() action;
  @Input() actionData;
  actions = AuditActionEnum;

  ngOnInit(): void {
  }
}
