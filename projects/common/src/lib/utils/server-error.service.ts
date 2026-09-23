import {Injectable} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ServerErrorService {

    private _wsKeyFormControlMap = new Map<string, AbstractControl[]>();

    addWsKeyFormControl(key: string, control: AbstractControl) {
        const formControls = this._wsKeyFormControlMap.get(key) ?? [];
        if (!formControls.includes(control)) {
            formControls.push(control);
        }
        this._wsKeyFormControlMap.set(key, formControls);
    }

    addWsKeyFormControls(addMap: Map<string, AbstractControl>) {
        addMap.forEach((value, key) => this.addWsKeyFormControl(`${key}`, value));
    }

    getFormControl(wsKey: string) {
        const formControls = this._wsKeyFormControlMap.get(wsKey) ?? [];
        return formControls.find(control => control.dirty) ?? formControls[formControls.length - 1];
    }

    getWsPrefixes(formControl: AbstractControl): string[] {
        return Array.from(this._wsKeyFormControlMap).filter(entry => entry[1].includes(formControl)).map(entry => entry[0]);
    }
}
