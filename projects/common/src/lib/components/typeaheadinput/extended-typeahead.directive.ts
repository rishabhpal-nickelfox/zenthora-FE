import {Directive, HostListener, Input} from '@angular/core';
import {TypeaheadDirective} from 'ngx-bootstrap/typeahead';

@Directive({
  standalone: false,
  selector: '[extendedTypeahead]'
})
export class ExtendedTypeaheadDirective extends TypeaheadDirective {
  onFocus(): void {
  }

  @HostListener('openSearch', ['$event'])
  private openSearchHandler(e: KeyboardEvent) {
    if (!this._container) {
      this.typeaheadLoading.emit(true);
      this.keyUpEventEmitter.emit();
    }
  }

  @Input()
  set extendedTypeahead(val) {
    this.typeahead = val;
  }
}
