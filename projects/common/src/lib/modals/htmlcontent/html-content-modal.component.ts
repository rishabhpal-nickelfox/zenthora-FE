import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SafeHtml} from "@angular/platform-browser";

@Component({
  standalone: false,
  selector: 'app-html-content-modal',
  templateUrl: './html-content-modal.component.html',
  styleUrls: ['../external-modal.scss']
})
export class HtmlContentModalComponent implements OnInit {
  constructor(protected _activeModal: NgbActiveModal, private ch: ChangeDetectorRef) {
  }

  @Input() header = null;

  @Input() okButtonText = 'Ok';

  @Input() innerHtml: SafeHtml

  get activeModal() {
    return this._activeModal;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.getElementById("header").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

