import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import { AfterViewInit, ElementRef, OnDestroy, OnInit, Directive } from '@angular/core';
import {DetailViewComponent} from './detail-view.component';
import {ErrorService} from "../utils/errorhandler/error.service";
import {ServerErrorService} from "../utils/server-error.service";
import {getArrayIndex, getArrayName, getMessage} from "../helpers/string.helper";
import {Mask} from "../helpers/mask";
import {FormHelper} from "../helpers/form.helper";
import {getScrollBehavior} from '../helpers/dom.helper';

@Directive()
export abstract class FormComponent extends DetailViewComponent implements OnInit {

    wsKeyFormControlNameMap = new Map();

    constructor(protected elementRef: ElementRef, public errorService: ErrorService,
                public serverErrorService?: ServerErrorService) {
        super(elementRef);
    }

    abstract getForm(): FormGroup;

    getControls(): {
        [key: string]: AbstractControl;
    } {
        return this.getForm() ? this.getForm().controls : {};
    }

    isSubmitEnabled(): boolean {
        return true;
    }

    isFormValid(): boolean {
        return FormHelper.isFormGroupValid(this.getForm());
    }

    getWSKeyFormControlNameMap(): Map<string, string> {
        return this.wsKeyFormControlNameMap;
    }

    isFieldNotValid(fieldName): boolean {
        return FormHelper.isFieldNotValid(this.getForm(), fieldName);
    }

    isAbstractControlNotValid(formControl: AbstractControl): boolean {
        return formControl && !formControl.disabled && !formControl.valid && formControl.dirty;
    }

    getFormValidationErrors() {
        Object.keys(this.getForm().controls).forEach(key => {

            const controlErrors: ValidationErrors = this.getForm().get(key).errors;
            if (controlErrors != null) {
                Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                });
            }
        });
    }

    addErrorMessageToField(template: string, wsFN: string, defaultHeader: string) {
        if (this.serverErrorService) {
            this.addNewErrorMessageToField(template, wsFN, defaultHeader);
            return;
        }

        let wsFieldName = wsFN;
        let indx: number;
        if (wsFieldName.match(Mask.ARRAY_FIELD_NAME)) {
            wsFieldName = getArrayName(wsFN);
            indx = getArrayIndex(wsFN);
        }
        let fieldCode = this.getWSKeyFormControlNameMap().get(wsFieldName);

        if (fieldCode && this.getForm().get(fieldCode)) {
            if (this.getForm().get(fieldCode) instanceof FormArray) {
                this.errorService.validationService.addServerError(this.getForm(), `${fieldCode}.${indx}`, getMessage(template, fieldCode));
            } else {
                this.errorService.validationService.addServerError(this.getForm(), fieldCode, getMessage(template, fieldCode));
            }
        } else if (this.getForm().get(wsFieldName)) {
            this.errorService.validationService.addServerError(this.getForm(), wsFieldName, getMessage(template, wsFieldName));
        } else {
            this.errorService.alertService.showError(defaultHeader, `${wsFN}: ${getMessage(template, wsFN)}`);
        }
    }

    clear() {
        this.getForm().reset();
    }

    scrollToFirstElementWithError() {
        window.requestAnimationFrame(() => {
            const el = document.querySelector('.val-message');
            if (el) {
                el.scrollIntoView({behavior: getScrollBehavior(), block: 'center', inline: 'nearest'});
            }
        });
    }

    onBlur(control: AbstractControl) {
        control.markAsDirty();
        control.updateValueAndValidity();
    }

    getControlName(control: AbstractControl) {
        return Object.keys(this.getControls()).find(name => this.getForm().get(name) === control);
    }

    getWsKeys(): Map<string, FormControl> {
        return new Map<string, FormControl>();
    };

    public ngOnInit(): void {
        this.onInit();
        this.initWsKeys();
    }


    protected onInit(): void {

    }

    protected getWsPrefixes(): string[] {
        return [];
    }

    private getWsKeysWithPrefix(): Map<string, FormControl> {
        const formControlMap = this.getWsKeys();
        const prefixes = this.getWsPrefixes();
        const wsKeyFormControlEntry = [];
        Array.from(formControlMap.entries()).forEach(entry => {
            if (prefixes.length > 0) {
                prefixes.forEach(prefix => {
                    wsKeyFormControlEntry.push([`${prefix}.${entry[0]}`, entry[1]]);
                });
            } else {
                wsKeyFormControlEntry.push([entry[0], entry[1]]);
            }
        });
        return new Map<string, FormControl>(wsKeyFormControlEntry);
    }

    private initWsKeys() {
        if (this.serverErrorService) {
            this.serverErrorService.addWsKeyFormControls(this.getWsKeysWithPrefix());
        }
    }

    private addNewErrorMessageToField(template: string, fieldName: string, defaultHeader: string) {
        const formControl = this.serverErrorService.getFormControl(fieldName);
        if (formControl) {
            formControl.setErrors({server: getMessage(template, fieldName)});
        } else {
            this.errorService.alertService.showError(defaultHeader, `${fieldName}: ${getMessage(template, fieldName)}`);
        }

    }

    private getFormFieldName(wsFieldName: string): string {
        if (this.getForm().get(wsFieldName)) {
            return wsFieldName;
        } else {
            return this.wsKeyFormControlNameMap.get(wsFieldName);
        }
    }

    private addErrorMessageToFormArrayField(template: string, fieldName: string): string {
        let formFieldName = this.getFormFieldName(getArrayName(fieldName));

        if (formFieldName) {
            const index = getArrayIndex(fieldName);

            if (this.getForm().get(formFieldName) instanceof FormArray) {
                formFieldName = `${formFieldName}.${index}`;
            }

            this.errorService.validationService.addServerError(this.getForm(), formFieldName, getMessage(template, fieldName));
        }
        return formFieldName;
    }


    private addErrorMessageToFormControl(template: string, fieldName: string): string {
        let formFieldName = this.getFormFieldName(fieldName);
        if (formFieldName) {
            this.errorService.validationService.addServerError(this.getForm(), formFieldName, getMessage(template, formFieldName));
        }
        return formFieldName;
    }

}
