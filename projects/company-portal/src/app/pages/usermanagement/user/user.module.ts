import {NgModule} from '@angular/core';
import {UserComponent} from './user.component';
import {SharedModule} from '../../../../../../common/src/lib/shared.module';
import {RouterModule} from '@angular/router';
import {UserSystemModule} from './system/user-system.module';
import {UserCompanyModule} from './company/user-company.module';

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    SharedModule,
    UserSystemModule,
    UserCompanyModule
  ],
  exports: [
    UserComponent
  ]
})
export class UserModule {
}
