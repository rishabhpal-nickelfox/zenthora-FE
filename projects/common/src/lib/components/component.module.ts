import {NgModule} from '@angular/core';
import {
  NbCheckboxModule,
  NbIconModule,
  NbOptionModule,
  NbPopoverModule, NbSelectModule,
  NbSpinnerModule,
  NbThemeModule
} from '@nebular/theme';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {ExtendedInputComponent} from './extendedinput/extended-input.component';
import {TextMaskModule} from '../directives/text-mask.module';
import {TrimValueAccessorModule} from '../directives/trim-value-accessor.module';
import {ExtendedNumberInputComponent} from './numberinput/extended-number-input.component';
import {FileInputComponent} from './fileinput/file-input.component';
import {ExtendedDatePickerComponent} from './datepicker/extended-date-picker.component';
import {MonthYearDatePickerComponent} from './datepicker/monthyearpicker/month-year-date-picker.component';
import {ExtendedTypeaheadInputComponent} from './typeaheadinput/extended-typeahead-input.component';
import {ExtendedTypeaheadDirective} from './typeaheadinput/extended-typeahead.directive';
import {SingleImgInputComponent} from './fileinput/single-img-input.component';
import {ExtendedTypeaheadWithLoadDirective} from './typeaheadinput/extended-typeahead-with-load.directive';
import {ExtendedTypeaheadWithLoadInputComponent} from './typeaheadinput/extended-typeahead-with-load-input.component';
import {ColorPickerComponent} from './colorpicker/color-picker.component';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {CheckboxGroupComponent} from './checkbox/checkbox-group.component';
import {FormControlErrorComponent} from './error/form-control-error.component';
import {ToTopButtonComponent} from "./navbar/to-top-button.component";
import {QuillModule} from "ngx-quill";
import {RichTextEditorComponent} from "./richtexteditor/rich-text-editor.component";
import {RichTextViewerComponent} from "./richtextviewer/rich-text-viewer.component";

@NgModule({
  declarations: [
    ExtendedInputComponent,
    ExtendedDatePickerComponent,
    MonthYearDatePickerComponent,
    ExtendedNumberInputComponent,
    FileInputComponent,
    SingleImgInputComponent,
    ExtendedTypeaheadInputComponent,
    ExtendedTypeaheadDirective,
    ExtendedTypeaheadWithLoadDirective,
    ExtendedTypeaheadWithLoadInputComponent,
    ColorPickerComponent,
    CheckboxGroupComponent,
    FormControlErrorComponent,
    ToTopButtonComponent,
    RichTextEditorComponent
  ],
  imports: [
    RichTextViewerComponent,
    CommonModule,
    FormsModule,
    TrimValueAccessorModule,
    TextMaskModule,
    NbCheckboxModule,
    NgbModule,
    NgbDatepickerModule,
    NbPopoverModule,
    NbThemeModule,
    TypeaheadModule,
    QuillModule,
    NbIconModule,
    NbSpinnerModule,
    NbOptionModule,
    NbSelectModule
  ],
  exports: [
    ExtendedInputComponent,
    ExtendedDatePickerComponent,
    MonthYearDatePickerComponent,
    ExtendedNumberInputComponent,
    FileInputComponent,
    ExtendedTypeaheadInputComponent,
    ExtendedTypeaheadDirective,
    SingleImgInputComponent,
    ExtendedTypeaheadWithLoadDirective,
    ExtendedTypeaheadWithLoadInputComponent,
    ColorPickerComponent,
    CheckboxGroupComponent,
    FormControlErrorComponent,
    ToTopButtonComponent,
    RichTextEditorComponent,
    RichTextViewerComponent,
    NbOptionModule,
    NbSelectModule
  ],
  providers: [ExtendedTypeaheadWithLoadDirective]
})
export class ComponentModule {
}
