import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NbCheckboxModule, NbIconModule, NbThemeModule} from '@nebular/theme';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TrimValueAccessorModule} from '../../directives/trim-value-accessor.module';
import {TextMaskModule} from '../../directives/text-mask.module';
import {AchGroupComponent} from './ach-group.component';
import {SharedModule} from "../../shared.module";
import {ComponentModule} from "../../components/component.module";

@NgModule({
    declarations: [
        AchGroupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TrimValueAccessorModule,
        TextMaskModule,
        NbCheckboxModule,
        NgbModule,
        NbThemeModule,
        ComponentModule,
        NbIconModule,
        SharedModule
    ],
    exports: [
        AchGroupComponent
    ]
})
export class ACHModule {
}
