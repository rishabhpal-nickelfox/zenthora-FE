import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FormPageStateService {
    private _submitClicked = new BehaviorSubject<boolean>(false);
    public submitClicked$ = this._submitClicked.asObservable();

    setSubmittedState(state: boolean){
        this._submitClicked.next(state);
    }

    isSubmitted(): boolean {
        return this._submitClicked.getValue();
    }
}
