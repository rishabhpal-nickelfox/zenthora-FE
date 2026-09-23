import {ElementRef} from '@angular/core';
import {DetailViewComponent} from './detail-view.component';
import {ScrollableComponent} from './scrollable.component';
import {findFirstFocusableIn} from "../helpers/dom.helper";
import {getScrollBehavior} from '../helpers/dom.helper';

export abstract class DetailPageComponent extends DetailViewComponent implements ScrollableComponent {
    constructor(protected elementRef: ElementRef) {
        super(elementRef);
    }


    reInit(newData?: any) {
        new Promise((resolve) => {
            this.onReInit(newData);
            resolve(resolve);
        }).then(() => {
            this.focusFirst();
            this.scroll();
        });
    }

    scroll() {
        window.scrollTo({top: 0, behavior: getScrollBehavior()});
    }

    focusFirst() {
        const firstFocusable = findFirstFocusableIn(this.elementRef.nativeElement);
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}
