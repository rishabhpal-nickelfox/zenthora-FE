import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  standalone: false,
    selector: '[formControlErrorContainer]'
})
export class FormControlErrorContainerDirective {
    constructor(public _viewContainerRef: ViewContainerRef) { }
}
