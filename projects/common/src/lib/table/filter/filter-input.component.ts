import {ChangeDetectorRef, Component} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';

@Component({
  standalone: false,
  selector: 'app-extended-filter-input',
  template: `<input class="qbo-form-control form-control filter" [placeholder]="placeholder" [ngModel]="filterValue"
                    (ngModelChange)="onSearchStringChange($event)"/>`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterInputComponent extends FilterBaseComponent {
  placeholder;

  constructor(private ch: ChangeDetectorRef) {
    super();
  }

  set params(params: any) {
    this.placeholder = params.placeholder;
  }

  onSearchStringChange(value) {
    this.filterValue = value;
  }

  reset() {
    this._filterValue = null;
  }
}
