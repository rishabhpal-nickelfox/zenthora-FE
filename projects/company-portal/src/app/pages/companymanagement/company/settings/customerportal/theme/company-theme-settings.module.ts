import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../../../../../../../../common/src/lib/shared.module";
import {CompanyThemeSettingsComponent} from "./company-theme-settings.component";

@NgModule({
  declarations: [
    CompanyThemeSettingsComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule
  ],
  exports: [
    CompanyThemeSettingsComponent
  ]
})

export class CompanyThemeSettingsModule {
}
