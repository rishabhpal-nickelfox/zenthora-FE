import {NgModule} from '@angular/core';
import {CreateArrayFromStartAndEndPipe} from './ng-for.pipe';
import {MapToIterable} from "./map-to-iterable.pipe";
import {SafePipe} from "./safe-pipe";

@NgModule({
  declarations: [
    CreateArrayFromStartAndEndPipe,
    MapToIterable,
    SafePipe
  ],
  exports: [
    CreateArrayFromStartAndEndPipe,
    MapToIterable,
    SafePipe
  ]
})
export class PipeModule {
}
