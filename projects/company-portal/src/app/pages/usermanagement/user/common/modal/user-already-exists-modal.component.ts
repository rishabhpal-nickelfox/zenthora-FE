import {Component, ElementRef, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {
  ComponentWithSubscriptions
} from "../../../../../../../../common/src/lib/components/component-with-subscriptions";

@Component({
  standalone: false,
  selector: 'app-user-already-exists-modal',
  templateUrl: './user-already-exists-modal.component.html',
  styleUrls: ['./user-already-exists-modal.component.scss', '../../../../../../../../common/src/lib/modals/external-modal.scss']
})
export class UserAlreadyExistsModalComponent extends ComponentWithSubscriptions implements OnInit {

  userEmail;

  constructor(protected elementRef: ElementRef, protected _fb: FormBuilder, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
  }

  apply() {
    this.activeModal.close();
  }

  close() {
    this.activeModal.dismiss();
    return false;
  }


}
