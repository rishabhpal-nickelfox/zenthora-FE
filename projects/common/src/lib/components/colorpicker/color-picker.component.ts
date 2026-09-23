import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]

})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {

  @Input() label: string;
  @Input() includeNone: boolean;
  color;
  colors: string[];
  private readonly defaultColors: string[] = [
    '#ffffff',
    '#000000',
    '#3e6158',
    '#3f7a89',
    '#96c582',
    '#b7d5c4',
    '#bcd6e7',
    '#7c90c1',
    '#9d8594',
    '#dad0d8',
    '#4b4fce',
    '#4e0a77',
    '#a367b5',
    '#ee3e6d',
    '#d63d62',
    '#c6a670',
    '#f46600',
    '#cf0500',
    '#efabbd',
    '#8e0622',
    '#f0b89a',
    '#f0ca68',
    '#62382f'
  ];

  private static readonly NONE = 'none';
  onChange: (value: any) => void = (value) => {
  }
  onTouched: (value: any) => void = (value) => {
  }

  ngOnInit(): void {
    this.colors = this.includeNone ? ['none', ...this.defaultColors] : [...this.defaultColors];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.color = obj;
    if (obj) {
      if (this.colors.indexOf(this.color) >= 0) {
        this.colors = this.colors.filter(c => c != this.color);
      }
      this.colors.unshift(this.color);
    }
  }

  get value() {
    return this.color;
  }

  public changeColor(color: string): void {
    this.writeValue(color);
    this.onChange(this.color);
  }

  public changeColorManual(color: string): void {
    const isValid = this.includeNone && color == ColorPickerComponent.NONE || /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);

    if (isValid) {
      this.changeColor(color);
    }
  }

  isNone(color: string): boolean {
    return color == ColorPickerComponent.NONE;
  }
}
