import {NgModule} from '@angular/core';
import {SendgridSyncTableComponent} from './sendgrid-sync-table.component';
import {SharedModule} from '../../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';

@NgModule({
  declarations: [
    SendgridSyncTableComponent
  ],
  imports: [
    SharedModule,
    NbSelectModule
  ],
  exports: [
    SendgridSyncTableComponent
  ],
  providers: []
})

export class SendgridSyncModule {
}
