import {NgModule} from '@angular/core';
import {UserEditRolesComponent} from './roles/user-edit-roles.component';

import {UserAlreadyExistsModalComponent} from './modal/user-already-exists-modal.component';
import {NbAlertModule} from '@nebular/theme';
import {SharedModule} from '../../../../../../../common/src/lib/shared.module';
import {UserTableComponent} from './user-table.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    declarations: [
        UserEditRolesComponent,
        UserAlreadyExistsModalComponent,
        UserTableComponent
    ],
    imports: [
        SharedModule,
        NbAlertModule,
        NgxPaginationModule
    ],
    exports: [
        UserAlreadyExistsModalComponent,
        UserEditRolesComponent,
        UserTableComponent
    ]
})
export class UserCommonModule {
}
