import {Component, Input, OnInit} from '@angular/core';
import {ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-api-audit-details-column',
  templateUrl: './api-audit-details-column.component.html',
  styleUrls: ['api-audit-details-column.component.scss']
})

export class ApiAuditDetailsColumnComponent implements OnInit {
  @Input() details = [];

  ngOnInit(): void {
  }

  protected readonly ObjectHelper = ObjectHelper;
}
