import {NgModule} from '@angular/core';
import {VaultErrorsTableComponent} from './vault-errors-table.component';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {NbSelectModule} from '@nebular/theme';

@NgModule({
  declarations: [
    VaultErrorsTableComponent
  ],
  imports: [
    SharedModule,
    NbSelectModule
  ],
  exports: [
    VaultErrorsTableComponent
  ],
  providers: []
})

export class VaultErrorsModule {
}
