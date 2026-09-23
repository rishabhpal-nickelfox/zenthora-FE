import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbCollapseModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MenuComponent} from './menu.component';
import {NbIconModule} from "@nebular/theme";

@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NbIconModule,
    NgbCollapseModule
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule {
}
