import {NgModule} from '@angular/core';
import {AuditComponent} from './audit.component';
import {AuditDetailsColumnComponent} from './audit-details-column.component';
import {AuditActionsColumnComponent} from './audit-actions-column.component';
import {SharedModule} from '../../../../../../common/src/lib/shared.module';

@NgModule({
  declarations: [
    AuditComponent,
    AuditDetailsColumnComponent,
    AuditActionsColumnComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    AuditComponent
  ]
})
export class AuditModule {
}
