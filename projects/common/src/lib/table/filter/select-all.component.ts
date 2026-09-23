import {Component, OnDestroy, OnInit} from '@angular/core';
import {FilterBaseComponent} from './filter-base.component';
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-extended-filter-select',
  template: `
      <div class="d-flex justify-content-center"><label class="checkbox-container">
          <input type="checkbox" [ngModel]="filterValue" (ngModelChange)="onSelectAllChanged($event)">
          <span class="checkmark"></span>
          <span class="checkbox-descr"></span>
      </label></div>`,
  styleUrls: ['../table.component.scss'],
  outputs: ['filterChanged']
})
export class SelectAllComponent extends FilterBaseComponent implements OnInit, OnDestroy {

  subscription;

  selectAllCallBack: (value: boolean) => {};

  set params(params: any) {
    this.selectAllCallBack = params.onSelectAll;
  }

  onSelectAllChanged(value) {
    this.filterValue = value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.filterChanged.subscribe(value => {
        if (isDefined(value)) {
          this.selectAllCallBack(value);
        }
      }
    );
  }

  reset() {
    this.filterValue = null;
  }
}
