import {Component} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';

@Component({
  standalone: false,
  selector: 'app-extended-filter-select-multiple',
  template:
    `
      <nb-select [placeholder]="placeholder" multiple
                 [ngModel]="filterValue"
                 style="width:250px"
                 (ngModelChange)="onFilterChange($event)"
                 (selectedChange)="onFilterChange($event)" class="qbo-form-control-select">
        <nb-option [value]="null">{{placeholder}}</nb-option>
        <nb-option *ngFor="let option of options" [value]="optionValueFunction(option)">
          {{optionNameFunction(option)}}
        </nb-option>
      </nb-select>`
  ,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterSelectMultipleComponent extends FilterBaseComponent {

  set params(params: any) {
    this.placeholder = params.placeholder || this.placeholder;
    this.options = params.options;

    this.optionValueFunction = params.optionValueFunction;
    this.optionNameFunction = params.optionNameFunction;
  }
  placeholder = '';
  options = [];

  protected _filterValue = [null];
  optionValueFunction = (option) => {
  }
  optionNameFunction = (option) => {
  }

  onFilterChange(value) {
    this.filterValue = value;
  }

  reset() {
    this._filterValue = [];
  }
}
