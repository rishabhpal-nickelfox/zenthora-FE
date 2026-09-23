import {NgModule} from "@angular/core";
import {SharedModule} from "../../../../../common/src/lib/shared.module";
import {UserComponent} from "./user.component";
import {UserTableComponent} from "./user-table.component";
import {UserEditComponent} from "./user-edit.component";
import {NgxPaginationModule} from "ngx-pagination";
import {UserPermissionsComponent} from "./user-permissions.component";

@NgModule({
  declarations: [
    UserComponent,
    UserEditComponent,
    UserTableComponent,
    UserPermissionsComponent
  ],
  imports: [
    SharedModule,
    NgxPaginationModule
  ],
  exports: []
})
export class UserModule {
}
