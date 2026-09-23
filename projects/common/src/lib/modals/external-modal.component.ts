import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  standalone: false,
  selector: 'app-external-modal',
  templateUrl: './external-modal.component.html',
  styleUrls: ['./external-modal.scss']
})
export class ExternalModalComponent implements OnInit {
  @Input() url = '';
  @Input() header = '';
  resourceUrl;

  constructor(protected _activeModal: NgbActiveModal, protected _sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.resourceUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  get activeModal() {
    return this._activeModal;
  }

}

