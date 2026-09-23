import {ChangeDetectorRef, ElementRef, OnDestroy, OnInit, Directive, AfterViewInit} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NgControl, ValidationErrors, Validator} from '@angular/forms';
import {Observable} from 'rxjs';
import {FormComponent} from "../../pages/form.component";
import {ErrorService} from "../../utils/errorhandler/error.service";
import {ServerErrorService} from "../../utils/server-error.service";
import {FormHelper} from "../../helpers/form.helper";

@Directive()
export abstract class FormGroupAsFormControlComponent extends FormComponent implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  constructor(protected elementRef: ElementRef, public errorService: ErrorService,
              protected ch: ChangeDetectorRef, public serverErrorService: ServerErrorService) {
    super(elementRef, errorService, serverErrorService);

  }

  registerOnChange(fn: any): void {
    this.subscriptions.add(
      this.formValueChanges().subscribe(fn));
  }

  protected formValueChanges(): Observable<any>{
    return this.getForm().valueChanges;
  }

  onTouched: () => void = () => {
  };


  writeValue(obj): void {
    this.reInit(obj);
  }


  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.getForm().disable();
    } else {
      this.getForm().enable();
    }
    this.ch.detectChanges();
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (c.errors?.server) {
      const serverError = c.errors.server;
      this.addErrorMessageToField(serverError.template, serverError.wsFn, serverError.defaultHeader);
    }

    return FormHelper.isFormGroupValid(this.getForm())
      ? null
      : {
        invalidForm: {
          value: this.getForm(),
          message: 'Nested Form is invalid'
        }
      };
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.ch.detach();
  }

  protected getWsPrefixes(): string[] {
    return this.serverErrorService.getWsPrefixes(this.ngControl.control);
  }


  abstract get ngControl(): NgControl;

  abstract getWsKeys(): Map<string, FormControl>;

  protected abstract onInit(): void;

  ngAfterViewInit(): void {
    this.getForm().updateValueAndValidity({
      onlySelf: true,
      emitEvent: true
    });
  }
}
