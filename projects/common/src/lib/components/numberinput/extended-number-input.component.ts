import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {createNumberMask} from 'text-mask-addons/dist/textMaskAddons';
import {Mask} from "../../helpers/mask";

@Component({
  standalone: false,
  selector: 'app-extended-number-input',
  templateUrl: './extended-number-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExtendedNumberInputComponent),
      multi: true
    }
  ]

})
export class ExtendedNumberInputComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder = '';
  @Input() integerLimit = 6;
  @Input() decimalMax = 3;
  @Input() decimalMin = null;
  @Input() suffix = '';
  @Input() negative = false;
  @Input() tabindex = 0;
  disabled;
  numberMask;
  stringValue;
  value;
  @ViewChild('instance', {static: true}) instance: ElementRef;
  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  constructor(private ch: ChangeDetectorRef) {
  }

  private _prefix = '';

  get prefix(): string {
    return this._prefix;
  }

  @Input() set prefix(prefix: string) {
    this._prefix = prefix;
    if (this.numberMask) {
      this.numberMask = createNumberMask({
        prefix: this.prefix ? this.prefix : '',
        suffix: this.suffix ? this.suffix : '',
        includeThousandsSeparator: true,
        allowDecimal: true,
        requireDecimal: false,
        allowLeadingZeroes: false,
        decimalLimit: this.decimalMax,
        integerLimit: this.integerLimit,
        allowNegative: this.negative
      });
    }
    this.ch.detectChanges();
  }

  onChange: (value: any) => void = (value) => {
  };

  onTouched: (value: any) => void = (value) => {
  };

  ngOnInit(): void {
    this.numberMask = createNumberMask({
      prefix: this.prefix ? this.prefix : '',
      suffix: this.suffix ? this.suffix : '',
      includeThousandsSeparator: true,
      allowDecimal: true,
      requireDecimal: false,
      allowLeadingZeroes: false,
      decimalLimit: this.decimalMax,
      integerLimit: this.integerLimit,
      allowNegative: this.negative
    });
  }

  writeValue(value: any) {
    if (this.value !== Mask.unmaskNumber(value)) {
      this.value = value;
      if (Mask.unmaskNumber(this.stringValue) != this.value) {
        this.stringValue = this.transformValue(this.value);
      }
      this.ch.detectChanges();
    }
  }

  updateValue(value: any) {
    this.writeValue(value);
    this.ch.detectChanges();
    this.onChange(value);
  }


  transformValue(value) {
    return Mask.transformValueToMaskedFloat(value, this.numberMask, this.decimalMax, this.decimalMin);
  }


  registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: any) => void) {
    this.onTouched = fn;
  }

  keyup(e) {
    this.stringValue = e.target.value;
    this.updateValue(Mask.unmaskNumber(this.stringValue));
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.ch.detectChanges();
  }

  onBlur(event) {
    this.stringValue = this.transformValue(this.value);
    this.blur.emit(event);
    this.ch.detectChanges();
  }


}

