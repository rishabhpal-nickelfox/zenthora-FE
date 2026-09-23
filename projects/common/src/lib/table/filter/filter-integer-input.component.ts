import {Component} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {Mask} from "../../helpers/mask";

@Component({
  standalone: false,
  selector: 'app-extended-filter-integer-input',
  template: `
    <input type="text" class="qbo-form-control form-control ng-trim-ignore"
           [ngModel]="filterValue"
           (ngModelChange)="onFilterChange($event)"
           [textMask]="{mask: MASK.INTEGER()}"
           [placeholder]="placeholder">`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterIntegerInputComponent extends FilterBaseComponent {
  placeholder;
  MASK = new Mask();

  set params(params: any) {
    this.placeholder = params.placeholder;
  }

  onFilterChange(value) {
    this.filterValue = value;
  }

  reset() {
    this._filterValue = null;
  }
}
