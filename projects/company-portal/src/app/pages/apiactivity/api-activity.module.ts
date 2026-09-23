import {ModuleWithProviders, NgModule} from '@angular/core';
import {ApiAuditComponent} from './api-audit.component';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';
import {ApiAuditDetailsColumnComponent} from "./api-audit-details-column.component";
import {ApiAuditActionsColumnComponent} from "./api-audit-actions-column.component";
import {ApiAuditUiKeyService} from "./api-audit-ui-key.service";
import {ApiAuditService} from "./api-audit.service";

@NgModule({
  declarations: [
    ApiAuditComponent,
    ApiAuditDetailsColumnComponent,
    ApiAuditActionsColumnComponent
  ],
  imports: [
    SharedModule,
    NbSelectModule
  ],
  exports: [
    ApiAuditComponent
  ]
})

export class ApiActivityModule {
  static forRoot(): ModuleWithProviders<ApiActivityModule> {
    return {
      ngModule: ApiActivityModule,
      providers: [
        ApiAuditUiKeyService,
        ApiAuditService
      ]
    };
  }
}
