import {NgModule} from '@angular/core';
import {UserSystemComponent} from './table/user-system.component';
import {NbAlertModule} from '@nebular/theme';
import {NgxPaginationModule} from 'ngx-pagination';
import {UserSystemCreateEditComponent} from './edit/user-system-create-edit.component';
import {SharedModule} from '../../../../../../../common/src/lib/shared.module';
import {UserCommonModule} from '../common/user-common.module';

@NgModule({
  declarations: [
    UserSystemComponent,
    UserSystemCreateEditComponent
  ],
  imports: [
    SharedModule,
    NbAlertModule,
    NgxPaginationModule,
    UserCommonModule
  ],
  exports: [
    UserSystemComponent
  ]
})
export class UserSystemModule {
}
