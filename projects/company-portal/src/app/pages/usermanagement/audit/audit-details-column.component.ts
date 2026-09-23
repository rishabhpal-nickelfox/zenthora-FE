import {Component, Input, OnInit} from '@angular/core';
import {AuditFieldEnum} from '../../../../enums/usermanagement/audit-field.enum';

@Component({
  standalone: false,
  selector: 'app-new-audit-details-column',
  templateUrl: './audit-details-column.component.html'
})

export class AuditDetailsColumnComponent implements OnInit {
  @Input() details = [];

  ngOnInit(): void {
  }

  getFieldLabel(fieldCode: string): string {
    return AuditFieldEnum[fieldCode] || fieldCode;
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }

}
