import {Directive, ElementRef, forwardRef, HostListener, Inject, NgModule, Optional, Renderer2} from '@angular/core';
import {COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const TRIM_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TrimValueAccessorDirective),
  multi: true
};

@Directive({
  standalone: false,
  selector: `
    input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControlName],
    input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControl],
    input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[ngModel],
    textarea:not([readonly]):not(.ng-trim-ignore)[formControlName],
    textarea:not([readonly]):not(.ng-trim-ignore)[formControl],
    textarea:not([readonly]):not(.ng-trim-ignore)[ngModel],
    :not([readonly]):not(.ng-trim-ignore)[ngDefaultControl]
  `,
  providers: [TRIM_VALUE_ACCESSOR]
})
export class TrimValueAccessorDirective extends DefaultValueAccessor {
  constructor(
    renderer: Renderer2,
    elementRef: ElementRef,
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) compositionMode: boolean | null
  ) {
    super(renderer, elementRef, compositionMode);
  }

  @HostListener('input', ['$event.target.value'])
  onTrimInput(value: string): void {
    this.onChange(typeof value === 'string' ? value.trim() : value);
  }

  @HostListener('blur', ['$event.target.value'])
  onTrimBlur(value: string): void {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    this.writeValue(trimmed);
    this.onTouched();
  }

  override writeValue(value: unknown): void {
    const normalized = typeof value === 'string' ? value.trim() : value;
    super.writeValue(normalized);
  }
}

@NgModule({
  declarations: [TrimValueAccessorDirective],
  exports: [TrimValueAccessorDirective]
})
export class TrimValueAccessorModule {}
