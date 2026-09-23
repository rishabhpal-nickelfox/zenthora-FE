import {FormComponent} from './form.component';
import { AfterViewInit, ElementRef, EventEmitter, OnInit, Directive } from '@angular/core';
import {Observable} from 'rxjs';
import {FormPageStateService} from "../utils/form-page-state.service";
import {FormHelper} from "../helpers/form.helper";
import {findFirstFocusableIn} from "../helpers/dom.helper";
import {ErrorService} from "../utils/errorhandler/error.service";
import {ServerErrorService} from "../utils/server-error.service";

@Directive()
export abstract class FormPageComponent extends FormComponent {

    saveEvent: EventEmitter<any> = new EventEmitter();
    saveAndNewEvent: EventEmitter<any> = new EventEmitter();
    protected closeAfterSubmit = false;

    constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, public serverErrorService?: ServerErrorService) {
        super(elementRef, errorService, serverErrorService);
    }

    private _submitLocked = false;

    get submitLocked() {
        return this._submitLocked;
    }

    override isSubmitEnabled(): boolean {
        return !this._submitLocked;
    }

    submit() {
        this.clearServerErrors();
        this.formPageStateService.setSubmittedState(true);
        FormHelper.validateAllFormFields(this.getForm());
        if (this.isFormValid()) {
            this._submitLocked = true;
            return this.onSubmit(this.getForm().getRawValue());
        } else {
            this.getFormValidationErrors();
            this.scrollToFirstElementWithError();
        }
    }

    clearServerErrors() {
        Object.values(this.getForm().controls).forEach(control => {
            if (control.errors?.server) {
                const {server, ...rest} = control.errors;
                control.setErrors(Object.keys(rest).length ? rest : null);
            }
        });
    }

    afterSubmit() {
        this._submitLocked = false;
    }

    lockSubmit() {
        this._submitLocked = true;
    }

    unlockSubmit() {
        this._submitLocked = false;
    }

    cancel() {
        this._submitLocked = false;
        return super.onCancel();
    }

    saveAndClose() {
        this.closeAfterSubmit = true;
        this.submit();
    }

    saveAndNew() {
        this.closeAfterSubmit = false;
        this.submit();
    }

    reInit(newData?: any) {
        new Promise((resolve) => {
            this.formPageStateService.setSubmittedState(false);
            this.onReInit(newData);
            resolve(resolve);
        }).then(() => {
            this.focusFirst();
        });
    }


    focusFirst() {
        const firstFocusable = findFirstFocusableIn(this.elementRef.nativeElement);
        if (firstFocusable) {
            firstFocusable.focus({ preventScroll: true });
        }
    }

    objectChanged(): boolean | Observable<boolean> {
        return false;
    }

    protected abstract onSubmit({value});

}
