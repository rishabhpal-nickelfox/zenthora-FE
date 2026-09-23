import {ElementRef, Directive, Inject} from '@angular/core';
import {ScrollableComponent} from './scrollable.component';
import {of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {FormPageComponent} from './form-page.component';
import {FormPageStateService} from "../utils/form-page-state.service";
import {ErrorService} from "../utils/errorhandler/error.service";
import {ServerErrorService} from "../utils/server-error.service";
import {getScrollBehavior} from '../helpers/dom.helper';

@Directive()
export abstract class AutoScrollingFormPageComponent extends FormPageComponent implements ScrollableComponent {

  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, public formServerErrorService?: ServerErrorService) {
    super(formPageStateService, elementRef, errorService, formServerErrorService);
  }


  reInit(newData?: any) {
    new Promise((resolve) => {
      this.formPageStateService.setSubmittedState(false);
      this.onReInit(newData);
      resolve(resolve);
    }).then(() => {
      this.focusFirst();
      this.scroll();
    });
  }

  scroll() {
    this.subscriptions.add(
      of(true)
        .pipe(delay(5))
        .pipe(map(() => {
          window.scrollTo({top: 0, left: 0, behavior: getScrollBehavior()});
        })).subscribe()
    );
  }
}
