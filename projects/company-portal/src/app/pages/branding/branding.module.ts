import {NgModule} from '@angular/core';
import {BrandingCreateEditComponent} from "./branding-create-edit.component";
import {BrandingComponent} from "./branding.component";
import {SharedModule} from "../../../../../common/src/lib/shared.module";

@NgModule({
  declarations: [
    BrandingComponent,
    BrandingCreateEditComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    BrandingComponent
  ],
  providers: []
})

export class BrandingModule {
}
