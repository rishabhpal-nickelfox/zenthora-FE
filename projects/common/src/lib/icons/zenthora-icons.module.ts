import {NgModule} from '@angular/core';
import {CCIconComponent} from './cc-icon.component';
import {AchIconComponent} from './ach-icon.component';
import {NbIconModule} from "@nebular/theme";

@NgModule({
  declarations: [
    CCIconComponent,
    AchIconComponent
  ],
  imports: [
    NbIconModule
  ],
  exports: [
    CCIconComponent,
    AchIconComponent,
    NbIconModule
  ]
})

export class ZenthoraIconsModule {
}
