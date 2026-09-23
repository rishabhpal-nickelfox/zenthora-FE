import {NgModule} from '@angular/core';
import {UserCompanyComponent} from './table/user-company.component';
import {SharedModule} from '../../../../../../../common/src/lib/shared.module';
import {NbAlertModule} from '@nebular/theme';
import {NgxPaginationModule} from 'ngx-pagination';
import {UserCompanyCreateComponent} from './edit/user-company-create.component';

import {UserCommonModule} from '../common/user-common.module';
import {UserCompanyEditComponent} from './edit/user-company-edit.component';

@NgModule({
  declarations: [
    UserCompanyCreateComponent,
    UserCompanyEditComponent,
    UserCompanyComponent
  ],
  imports: [
    SharedModule,
    NbAlertModule,
    NgxPaginationModule,
    UserCommonModule
  ],
  exports: [
    UserCompanyComponent
  ]
})
export class UserCompanyModule {
}
