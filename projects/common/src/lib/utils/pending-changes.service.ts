import {Injectable} from '@angular/core';
import {from, isObservable, Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ComponentCanDeactivate} from '../pages/can-deactivate.component';
import {ConfirmModalComponent} from '../modals/confirm/confirm-modal.component';
import {ObjectHelper} from '../helpers/object.helper';

@Injectable({providedIn: 'root'})
export class PendingChangesService {

  private activePage: ComponentCanDeactivate = null;
  private skip = false;

  constructor(private modalService: NgbModal) {
  }

  setActivePage(component) {
    this.activePage = ObjectHelper.isDefined(component) && typeof component.canDeactivate === 'function' ? component : null;
  }

  skipNextCheck() {
    this.skip = true;
  }

  consumeSkip(): boolean {
    const skip = this.skip;
    this.skip = false;
    return skip;
  }

  confirmLeavingActivePage(): Observable<boolean> {
    return ObjectHelper.isDefined(this.activePage) ? this.confirmLeaving(this.activePage) : of(true);
  }

  confirmLeaving(component: ComponentCanDeactivate): Observable<boolean> {
    const canDeactivate = component.canDeactivate();
    return (isObservable(canDeactivate) ? canDeactivate : of(canDeactivate))
      .pipe(mergeMap(can => can ? of(true) : this.showConfirmDialog()));
  }

  showConfirmDialog(): Observable<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.okButtonText = 'Ok';
    modalRef.componentInstance.cancelButtonText = 'Cancel';
    modalRef.componentInstance.header = 'Unsaved changes detected';
    modalRef.componentInstance.body = 'You have unsaved changes. Press Cancel to go back and save these changes, or Ok to lose these changes.';
    return from(modalRef.result.catch(() => false));
  }
}
