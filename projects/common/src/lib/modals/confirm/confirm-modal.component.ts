import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SafeHtml} from "@angular/platform-browser";
import {HtmlSanitizerService} from "../../utils/html-sanitizer.service";

@Component({
  standalone: false,
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['../external-modal.scss']
})
export class ConfirmModalComponent {

  @Input() header = '';
  private _htmlBody: SafeHtml;
  @Input() okButtonText = 'Ok';
  @Input() cancelButtonText = 'Cancel';

  constructor(protected _activeModal: NgbActiveModal, private htmlSanitizer: HtmlSanitizerService) {
  }

  get activeModal() {
    return this._activeModal;
  }

  get htmlBody(): SafeHtml {
    return this._htmlBody;
  }

  @Input() set body(value: string) {
    this._htmlBody = this.htmlSanitizer.sanitizeToSafeHtml(value);
  }

}
