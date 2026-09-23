import { EventEmitter, Output, Directive } from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Directive()
export abstract class FilterBaseComponent {
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();


  protected debouncer: Subject<any> = new Subject();

  constructor() {
    this.debouncer
      .pipe(debounceTime(500))
      .subscribe((val) => this.filterChanged.emit(val));
  }

  protected _filterValue = null;

  get filterValue() {
    return this._filterValue;
  }

  set filterValue(value) {
    this._filterValue = value;
    this.debouncer.next(value);
  }

  abstract set params(params: any);

  abstract reset();
}
