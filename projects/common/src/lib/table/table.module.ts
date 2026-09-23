import {NgModule} from '@angular/core';
import {
  NbCardModule,
  NbIconModule,
  NbSelectModule,
  NbSpinnerModule,
  NbThemeModule
} from '@nebular/theme';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {TableComponent} from './table.component';
import {FilterInputComponent} from './filter/filter-input.component';
import {FilterComponent} from './filter/filter.component';
import {PaginationComponent} from './pagination/pagination.component';
import {FilterDateComponent} from './filter/filter-date.component';
import {FilterSelectComponent} from './filter/filter-select.component';
import {FilterFloatInputComponent} from './filter/filter-float-input.component';
import {FilterIntegerInputComponent} from './filter/filter-integer-input.component';
import {TrimValueAccessorModule} from '../directives/trim-value-accessor.module';
import {TextMaskModule} from '../directives/text-mask.module';
import {FilterTimestampRangeOpenBoundariesComponent} from './filter/filter-timestamp-range-open-boundaries.component';
import {FilterDateRangeOpenBoundariesComponent} from "./filter/filter-date-range-open-boundaries.component";
import {FilterSelectMultipleComponent} from './filter/filter-select-multiple.component';
import {SelectAllComponent} from "./filter/select-all.component";
import {FilterWithSearchTypeComponent} from './filter/filter-with-search-type.component';
import {ComponentModule} from "../components/component.module";

@NgModule({
  declarations: [
    TableComponent,
    FilterInputComponent,
    FilterDateComponent,
    FilterTimestampRangeOpenBoundariesComponent,
    FilterDateRangeOpenBoundariesComponent,
    FilterSelectComponent,
    FilterIntegerInputComponent,
    FilterFloatInputComponent,
    FilterComponent,
    PaginationComponent,
    FilterSelectMultipleComponent,
    SelectAllComponent,
    FilterWithSearchTypeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NbThemeModule,
    NgxPaginationModule,
    TrimValueAccessorModule,
    TextMaskModule,
    ComponentModule,
    NbSpinnerModule,
    NbCardModule,
    NbSelectModule,
    NbIconModule
  ],
  exports: [
    TableComponent,
    FilterDateComponent,
    FilterComponent,
    PaginationComponent
  ]
})
export class TableModule {
}
