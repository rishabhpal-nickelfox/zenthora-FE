import {NgModule} from '@angular/core';
import {EmailTableComponent} from './email-table.component';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';

@NgModule({
  declarations: [
    EmailTableComponent
  ],
  imports: [
    SharedModule,
    NbSelectModule
  ],
  exports: [
    EmailTableComponent
  ],
  providers: []
})

export class EmailModule {
}
