import {Directive, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {isDefined, ObjectHelper} from '../helpers/object.helper';

@Directive()
export class ComponentWithSubscriptions implements OnDestroy {
    protected subscriptions = new Subscription();

    constructor() {

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.onDestroy();
    }

    isDefined(smth) {
        return ObjectHelper.isDefined(smth);
    }

    protected onDestroy() {

    }
}
