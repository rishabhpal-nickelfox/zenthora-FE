import {Component} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {Mask} from "../../helpers/mask";

@Component({
  standalone: false,
  selector: 'app-extended-filter-float-input',
  template: '<app-extended-number-input [ngModel]="filterValue"\n' +
    '                                     (ngModelChange)="onFilterChange($event)"\n' +
    '                                     [placeholder]="placeholder"\n' +
    '                                     [integerLimit]="integerLimit" [decimalMax]="decimalMax"\n' +
    '                                     [prefix]="prefix" [suffix]="suffix"></app-extended-number-input>',
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class FilterFloatInputComponent extends FilterBaseComponent {
  placeholder;
  integerLimit;
  decimalMax;
  suffix;
  prefix;

  set params(params: any) {
    this.placeholder = params.placeholder;
    this.integerLimit = params.integerLimit;
    this.decimalMax = params.decimalMax;
    this.suffix = params.suffix;
    this.prefix = params.prefix;
  }

  onFilterChange(value) {
    this.debouncer.next(Mask.unmaskNumber(value));
  }

  reset() {
    this._filterValue = '';
  }
}
