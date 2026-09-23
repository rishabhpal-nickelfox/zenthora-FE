import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  OnDestroy,
  OnInit,
  Optional,
  ViewContainerRef
} from '@angular/core';
import {AbstractControl, ControlContainer, NgControl, ValidationErrors} from '@angular/forms';
import {EMPTY, merge, Observable, Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {FormSubmitDirective} from './form-submit.directive';
import {FormControlErrorContainerDirective} from './form-control-error-message-container.directive';
import {FormControlErrorComponent} from '../../components/error/form-control-error.component';
import {DecimalPipe} from "@angular/common";
import {
  FormValidatorDateValueErrorModel,
  FormValidatorErrorModel,
  FormValidatorExactLengthErrorModel,
  FormValidatorMaxAmountErrorModel,
  FormValidatorMaxLengthErrorModel,
  FormValidatorMaxValueErrorModel,
  FormValidatorMinItemsErrorModel,
  FormValidatorMinAmountErrorModel,
  FormValidatorMinLengthErrorModel,
  FormValidatorMinValueErrorModel,
  FormValidatorMustBeTheSameErrorModel, FormValidatorZipErrorModel
} from "../../models/common/form-validator-error.model";
import {isDefined} from "../../helpers/object.helper";
import {CountryISOEnum} from "../../enums/utils/country-iso.enum";

@Directive({
  standalone: false,
    selector: '[formControlErrorMessage]'
  }
)
export class FormControlErrorMessageDirective implements OnInit, OnDestroy {
  formSubmit$: Observable<Event>;
  errorComponentRefs: Map<string, ComponentRef<FormControlErrorComponent>> = new Map<string, ComponentRef<FormControlErrorComponent>>();
  viewContainerRef: ViewContainerRef;
  private controlRef: AbstractControl | null = null;

  readonly DEFAULT_ERRORS = {
    required: (error: FormValidatorErrorModel) => `${error.label} cannot be blank`,
    maxlength: (error: FormValidatorMaxLengthErrorModel) => `${error.label} must be less than ${error.maxlength} characters`,
    minlength: (error: FormValidatorMinLengthErrorModel) => `${error.label} must be at least ${error.minlength} characters`,
    minitems: (error: FormValidatorMinItemsErrorModel) => `${error.label} must contain at least ${error.minSize} item(s)`,
    exactLength: (error: FormValidatorExactLengthErrorModel) => `${error.label} must be ${error.length} characters`,
    pattern: (error: FormValidatorErrorModel) => `${error.label} must be valid`,
    noJavaScript: (error: FormValidatorErrorModel) => `${error.label} cannot contain JavaScript`,
    email: (error: FormValidatorErrorModel) => `Please enter a valid email`,
    emails: (error: FormValidatorErrorModel) => `${error.label} must be valid emails separated with commas`,
    emailRegularOrNamed: (error: FormValidatorErrorModel) => 'Please enter a valid email in format: email@example.com or Name <email@example.com>',
    phone: (error: FormValidatorErrorModel) => `Please enter a valid phone number`,
    zip: (error: FormValidatorZipErrorModel) => error.country == CountryISOEnum.CA ? `Canadian Zip/Postal Code must be like XNX NXN where X is a letter and N is a digit`: `US Zip/Postal Code must be like NNNNN or NNNNN-NNNN, where N is a digit`,
    date: (error: FormValidatorErrorModel) => `Invalid date`,
    digits: (error: FormValidatorErrorModel) => `${error.label} must contain only digits`,
    maxvalue: (error: FormValidatorMaxValueErrorModel) => `${error.label} must be less than or equal to ${error.maxvalue}`,
    maxvalueStrict: (error: FormValidatorMaxValueErrorModel) => `${error.label} must be less than ${error.maxvalue}`,
    minvalue: (error: FormValidatorMinValueErrorModel) => `${error.label} must be greater than or equal to ${error.minvalue}`,
    minvalueStrict: (error: FormValidatorMinValueErrorModel) => `${error.label} must be greater than ${error.minvalue}`,
    mustBeTheSame: (error: FormValidatorMustBeTheSameErrorModel) => `${error.label} must be the same as ${error.sameAsLabel}`,
    maxAmount: (error: FormValidatorMaxAmountErrorModel) => `${error.label} must be less than or equal to ${error.currency}${this.decimalPipe.transform(error.maxamount, '1.2-2')}`,
    minAmountStrict: (error: FormValidatorMinAmountErrorModel) => `${error.label} must be greater than ${error.currency}${this.decimalPipe.transform(error.minamount, '1.2-2')}`,
    startsWithDigit: (error: FormValidatorErrorModel) => `${error.label} must start with a digit`,
    cannotBeEarlier: (error: FormValidatorDateValueErrorModel) => `${error.label} cannot be earlier than ${error.date}`,
    alreadyExists: (error: FormValidatorErrorModel) => `${error.label} already exists`,
    selectFromList: (error: FormValidatorErrorModel) => `${error.label} must be from the list`,
    creditCardNumberBanned: (error: FormValidatorErrorModel) => `Credit Card Number is not allowed in ${error.label}`,
    weakPassword: (error: FormValidatorErrorModel) => ``,
    invalidForm: () => ``,
    server: (error: string) => `${error}`
  };

  protected subscriptions = new Subscription();

  constructor(@Optional() private ngControl: NgControl,
              @Optional() private controlContainer: ControlContainer,
              private resolver: ComponentFactoryResolver,
              @Optional() private formSubmitDirective: FormSubmitDirective,
              private _viewContainerRef: ViewContainerRef,
              @Optional() controlErrorContainer: FormControlErrorContainerDirective,
              private decimalPipe: DecimalPipe) {

    this.formSubmit$ = this.formSubmitDirective ? this.formSubmitDirective.submit$ : EMPTY;
    this.viewContainerRef = controlErrorContainer ? controlErrorContainer._viewContainerRef : _viewContainerRef;
  }

  ngOnInit() {
    this.controlRef = this.resolveControl();

    if (!this.controlRef) {
      return;
    }

    this.subscriptions.add(merge(
      this.formSubmit$.pipe(tap(() => this.controlRef.markAsDirty())),
      this.controlRef.valueChanges,
      this.controlRef.statusChanges
    ).subscribe(() => {
      if (this.controlRef.dirty) {
        const controlErrors = this.controlRef.errors;

        if (controlErrors) {
          this.addErrors(controlErrors);
          this.toggleErrorClass(true);
        } else if (this.errorComponentRefs) {
          this.removeErrors(Array.from(this.errorComponentRefs.keys()));
          this.toggleErrorClass(false);
        }
      } else if (this.errorComponentRefs?.size) {
        this.removeErrors(Array.from(this.errorComponentRefs.keys()));
        this.toggleErrorClass(false);
      }
    }));

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.removeErrors(Array.from(this.errorComponentRefs.keys()));
  }

  private addErrors(controlErrors: ValidationErrors): void {
    const errorsToRemove: string[] = [];
    const controlErrorsKeys = Object.keys(controlErrors);
    const errorComponentRefsKeys = Array.from(this.errorComponentRefs.keys());
    errorComponentRefsKeys.forEach(key => {
      if (controlErrorsKeys.indexOf(key) < 0) {
        errorsToRemove.push(key);
      }
    });

    this.removeErrors(errorsToRemove);

    controlErrorsKeys.forEach(key => {
      if (errorComponentRefsKeys.indexOf(key) < 0) {
        const error = this.DEFAULT_ERRORS[key];
        const text = isDefined(error) ? error(controlErrors[key]) : key;
        if (text) {
          this.addError(key, text);
        }
      }
    });
  }

  private removeErrors(keysToRemove: string[]): void {
    keysToRemove.forEach(key => {
      const errorComponentRef = this.errorComponentRefs.get(key);
      if (errorComponentRef) {
        errorComponentRef.destroy();
        this.errorComponentRefs.delete(key);
      }
    });
  }

  private addError(key: string, text: string): void {
    let newNode: HTMLElement = document.createElement('div');
    const factory = this.resolver.resolveComponentFactory(FormControlErrorComponent);
    const errorComponentRef = this.viewContainerRef.createComponent(factory);

    errorComponentRef.instance.text = text;
    this.errorComponentRefs.set(key, errorComponentRef);
  }

  private resolveControl(): AbstractControl | null {
    try {
      return this.ngControl?.control ?? this.controlContainer?.control ?? null;
    } catch {
      return this.controlContainer?.control ?? null;
    }
  }

  private toggleErrorClass(hasError: boolean): void {
    const hostElement = this.viewContainerRef.element.nativeElement as HTMLElement | null;

    if (!hostElement) {
      return;
    }

    hostElement.classList.toggle('has-error', hasError);
    hostElement.closest('.extended-input')?.classList.toggle('has-error', hasError);
  }
}
