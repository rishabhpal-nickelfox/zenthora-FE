import {AuditModule} from './audit/audit.module';
import {NgModule} from '@angular/core';
import {UserModule} from './user/user.module';
import {RoleModule} from './role/role.module';

@NgModule({
  imports: [
    UserModule,
    RoleModule,
    AuditModule
  ],
})
export class UserManagementModule {
}
