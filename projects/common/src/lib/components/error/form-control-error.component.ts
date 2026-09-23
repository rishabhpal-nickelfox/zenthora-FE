import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
  standalone: false,
    template: `<div class="val-message" [class.hide]="_hide">{{_text}}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormControlErrorComponent {
    _text: string;
    _hide = true;

    @Input() set text(value) {
        if (value !== this._text) {
            this._text = value;
            this._hide = !value;
            this.cdr.detectChanges();
        }
    };

    constructor(private cdr: ChangeDetectorRef) { }

}
