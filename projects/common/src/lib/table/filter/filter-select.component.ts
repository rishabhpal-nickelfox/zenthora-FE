import {Component} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';

@Component({
  standalone: false,
  selector: 'app-extended-filter-select',
  template:
    `
      <select class="form-control qbo-form-control" [ngModel]="filterValue" (ngModelChange)="onFilterChange($event)">
        <option [ngValue]="null">{{placeholder}}</option>
        <option *ngFor="let option of options" [ngValue]="optionValueFunction(option)">
          {{optionNameFunction(option)}}
        </option>
      </select>`
  ,
  styles: [
    `select.qbo-form-control {
      width: -webkit-fill-available;
    }`
  ],
  outputs: ['filterChanged']
})
export class FilterSelectComponent extends FilterBaseComponent {
  placeholder = '';
  options = [];
  optionValueFunction = (option) => {
  }
  optionNameFunction = (option) => {
  }

  set params(params: any) {
    this.placeholder = params.placeholder || this.placeholder;
    this.options = params.options;
    this.optionValueFunction = params.optionValueFunction;
    this.optionNameFunction = params.optionNameFunction;
  }

  onFilterChange(value) {
    this._filterValue = value;
    this.debouncer.next(value);
  }

  reset() {
    this._filterValue = null;
  }

  updateOptions(newOptions) {
    this.options = newOptions;
    const filterObject = this.options.find(option => this.optionValueFunction(option) == this._filterValue);
    this._filterValue = filterObject ? this.optionValueFunction(filterObject) : null;
  }
}
