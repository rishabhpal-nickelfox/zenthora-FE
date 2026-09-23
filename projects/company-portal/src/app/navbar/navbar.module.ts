import {NgModule} from '@angular/core';
import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule, NbSpinnerModule,
  NbThemeModule
} from '@nebular/theme';
import {NavbarComponent} from './navbar.component';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    NbThemeModule,
    NbLayoutModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbActionsModule,
    NbCardModule,
    NbCheckboxModule,
    NbSpinnerModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule {
}
