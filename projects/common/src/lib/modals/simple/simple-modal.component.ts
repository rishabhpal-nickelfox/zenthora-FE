import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: false,
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['../external-modal.scss']
})
export class SimpleModalComponent {

  @Input() header = null;
  @Input() body = '';
  @Input() okButtonText = 'Ok';

  constructor(protected _activeModal: NgbActiveModal) {
  }

  get activeModal() {
    return this._activeModal;
  }
}

