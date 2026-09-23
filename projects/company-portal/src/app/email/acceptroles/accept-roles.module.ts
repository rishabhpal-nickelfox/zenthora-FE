import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../common/src/lib/shared.module';
import {AcceptRolesComponent} from './accept-roles.component';

@NgModule({
  declarations: [
    AcceptRolesComponent
  ],
  imports: [
    SharedModule
  ]
})
export class AcceptRolesModule {
}
