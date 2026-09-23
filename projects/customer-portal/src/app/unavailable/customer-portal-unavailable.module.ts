import {NgModule} from '@angular/core';
import {SharedModule} from "../../../../common/src/lib/shared.module";
import {CustomerPortalUnavailableComponent} from "./customer-portal-unavailable.component";

@NgModule({
  declarations: [
    CustomerPortalUnavailableComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CustomerPortalUnavailableComponent
  ]
})
export class CustomerPortalUnavailableModule {
}
