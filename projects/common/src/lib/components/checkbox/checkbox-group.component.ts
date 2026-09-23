import {CheckboxItem} from './checkbox-item';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import cloneDeep from 'lodash/cloneDeep';
import {AchGroupLabels} from "../../payment/ach/ach-group-labels";

@Component({
  standalone: false,
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxGroupComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CheckboxGroupComponent implements OnInit, ControlValueAccessor {


  options: CheckboxItem[] = [];
  isDisabled = false;

  constructor(private ch: ChangeDetectorRef) {
  }

  onChange;
  onTouched: (value: any) => void = (value) => {
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: CheckboxItem[]): void {
    this.options = cloneDeep(obj);
    this.ch.detectChanges();
  }

  checkedChanged(i) {
    this.options[i].checked = !this.options[i].checked;
    this.onChange(this.value);
    this.ch.detectChanges();

  }

  get value() {
    return cloneDeep(this.options);
  }

  protected readonly AchGroupLabels = AchGroupLabels;
}
