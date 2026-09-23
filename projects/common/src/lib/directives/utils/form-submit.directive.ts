import { Directive, ElementRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Directive({
  standalone: false,
    selector: 'form'
})
export class FormSubmitDirective {
    submit$ = fromEvent(this.element, 'submit')
        .pipe(tap(() => {
            if (this.element.classList.contains('submitted') === false) {
                this.element.classList.add('submitted');
            }
        }), shareReplay({bufferSize: 1, refCount: true}));

    constructor(private host: ElementRef<HTMLFormElement>) { }

    get element() {
        return this.host.nativeElement;
    }
}
