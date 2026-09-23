import {NgModule} from '@angular/core';
import {RoleComponent} from './role.component';
import {RoleCreateEditComponent} from './role-create-edit.component';
import {SharedModule} from '../../../../../../common/src/lib/shared.module';

@NgModule({
  declarations: [
    RoleComponent,
    RoleCreateEditComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    RoleComponent
  ]
})
export class RoleModule {
}
