import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Input,
  NgModule,
  OnChanges,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {COMPOSITION_BUFFER_MODE, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {createTextMaskInputElement} from 'text-mask-core/dist/textMaskCore';

export interface TextMaskConfig {
  mask: Array<string | RegExp> | ((raw: string) => Array<string | RegExp>) | false;
  guide?: boolean;
  placeholderChar?: string;
  pipe?: (conformedValue: string, config: TextMaskConfig) => false | string | object;
  keepCharPositions?: boolean;
  showMask?: boolean;
}

const MASKEDINPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MaskedInputDirective),
  multi: true
};

@Directive({
  standalone: false,
  selector: '[textMask]',
  exportAs: 'textMask',
  providers: [MASKEDINPUT_VALUE_ACCESSOR]
})
export class MaskedInputDirective implements ControlValueAccessor, OnChanges {
  @Input('textMask') textMaskConfig: TextMaskConfig = {
    mask: [],
    guide: true,
    placeholderChar: '_',
    keepCharPositions: false
  };

  private textMaskInputElement;
  private inputElement: HTMLInputElement;
  private composing = false;
  private onChange: (_: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private renderer: Renderer2,
              private elementRef: ElementRef,
              @Optional() @Inject(COMPOSITION_BUFFER_MODE) private compositionMode: boolean | null) {
    this.compositionMode = this.compositionMode ?? true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setupMask(true);
    if (this.textMaskInputElement) {
      this.textMaskInputElement.update(this.inputElement.value);
    }
  }

  writeValue(value: any): void {
    this.setupMask();
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.inputElement, 'value', normalizedValue);
    if (this.textMaskInputElement) {
      this.textMaskInputElement.update(value);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('input', ['$event.target.value'])
  handleInput(value: any): void {
    if (!this.compositionMode || !this.composing) {
      this.setupMask();
      if (this.textMaskInputElement) {
        this.textMaskInputElement.update(value);
        this.onChange(this.inputElement.value);
      }
    }
  }

  @HostListener('blur')
  handleBlur(): void {
    this.onTouched();
  }

  @HostListener('compositionstart')
  compositionStart(): void {
    this.composing = true;
  }

  @HostListener('compositionend', ['$event.target.value'])
  compositionEnd(value: any): void {
    this.composing = false;
    if (this.compositionMode) {
      this.handleInput(value);
    }
  }

  private setupMask(create = false): void {
    if (!this.inputElement) {
      this.inputElement = this.elementRef.nativeElement.tagName.toUpperCase() === 'INPUT'
        ? this.elementRef.nativeElement
        : this.elementRef.nativeElement.getElementsByTagName('INPUT')[0];
    }

    if (this.inputElement && create) {
      this.textMaskInputElement = createTextMaskInputElement({
        inputElement: this.inputElement,
        ...this.textMaskConfig
      });
    }
  }
}

@NgModule({
  declarations: [MaskedInputDirective],
  exports: [MaskedInputDirective]
})
export class TextMaskModule {}
