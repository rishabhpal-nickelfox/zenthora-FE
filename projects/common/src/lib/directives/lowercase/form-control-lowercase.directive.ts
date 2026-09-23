import {Directive, ElementRef, OnInit} from "@angular/core";
import {NgControl} from "@angular/forms";
import {LowerCasePipe} from "@angular/common";
import {ComponentWithSubscriptions} from "../../components/component-with-subscriptions";

@Directive({
  standalone: false,
    selector: '[formControlLowerCase]'
  }
)
export class FormControlLowercaseDirective extends ComponentWithSubscriptions implements OnInit {
  constructor(private ngControl: NgControl,
              private el: ElementRef,
              private lowerCasePipe: LowerCasePipe) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.ngControl.control.valueChanges.subscribe(value => {
          this.ngControl.control.setValue(this.lowerCasePipe.transform(value), {emitEvent: false});
      }));
  }
}
