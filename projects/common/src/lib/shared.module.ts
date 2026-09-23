import {NgModule} from '@angular/core';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {
  NbAccordionModule,
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule
} from '@nebular/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TrimValueAccessorModule} from './directives/trim-value-accessor.module';
import {DpDatePickerModule} from 'ng2-date-picker';
import {TextMaskModule} from './directives/text-mask.module';
import {PipeModule} from './pipes/pipe.module';
import {TableModule} from './table/table.module';
import {UiSwitchModule} from 'ngx-ui-switch';
import {ExternalModalModule} from './modals/external-modal.module';
import {ZenthoraIconsModule} from './icons/zenthora-icons.module';
import {CommonModule, DecimalPipe} from '@angular/common';
import {ComponentModule} from "./components/component.module";
import {CustomDirectiveModule} from "./directives/custom-directive.module";

@NgModule({
  declarations: [],
  imports: [
    NgbModule,
    NbThemeModule,
    NbMenuModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    CommonModule,
    ExternalModalModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbToastrModule,
    NbCheckboxModule,
    TrimValueAccessorModule,
    ComponentModule,
    DpDatePickerModule,
    TextMaskModule,
    NgbModalModule,
    TableModule,
    NbTabsetModule,
    UiSwitchModule,
    NbAccordionModule,
    NbSpinnerModule,
    ZenthoraIconsModule,
    CustomDirectiveModule
  ],
  exports: [
    NgbModule,
    NbThemeModule,
    NbMenuModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    NbToastrModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbCheckboxModule,
    TrimValueAccessorModule,
    ComponentModule,
    DpDatePickerModule,
    TextMaskModule,
    NgbModalModule,
    ExternalModalModule,
    PipeModule,
    TableModule,
    NbTabsetModule,
    UiSwitchModule,
    NbAccordionModule,
    NbSpinnerModule,
    ZenthoraIconsModule,
    CustomDirectiveModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class SharedModule {
}
