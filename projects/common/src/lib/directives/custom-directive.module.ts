import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe, LowerCasePipe} from '@angular/common';
import {FormControlErrorMessageDirective} from './utils/form-control-error-message.directive';
import {FormSubmitDirective} from './utils/form-submit.directive';
import {FormControlErrorContainerDirective} from './utils/form-control-error-message-container.directive';
import {ReactiveFormsModule} from '@angular/forms';
import {FormControlLowercaseDirective} from "./lowercase/form-control-lowercase.directive";

@NgModule({
    declarations: [
        FormControlErrorMessageDirective,
        FormSubmitDirective,
        FormControlErrorContainerDirective,
        FormControlLowercaseDirective
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    exports: [
        FormControlErrorMessageDirective,
        FormSubmitDirective,
        FormControlErrorContainerDirective,
        FormControlLowercaseDirective
    ],
    providers: [FormControlErrorMessageDirective, FormControlErrorMessageDirective, FormSubmitDirective, FormControlLowercaseDirective, LowerCasePipe, DecimalPipe]
})

export class CustomDirectiveModule {

}
