import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SafeHtml} from '@angular/platform-browser';
import {ComponentWithSubscriptions} from "../../components/component-with-subscriptions";
import {HtmlSanitizerService} from "../../utils/html-sanitizer.service";

@Component({
  standalone: false,
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['receipt-modal.component.css','../external-modal.scss']
})
export class ReceiptModalComponent extends ComponentWithSubscriptions implements OnInit {
  private _receipt = '';
  receiptSafeHtml: SafeHtml;

  constructor(
    public activeModal: NgbActiveModal,
    private htmlSanitizer: HtmlSanitizerService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  get receipt(): string {
    return this._receipt;
  }

  @Input('receipt')
  set receipt(value: string) {
    this._receipt = value;
    this.receiptSafeHtml = this.htmlSanitizer.sanitizeToSafeHtml(this._receipt);
  }

  printReceipt() {
    const printableReceipt = this.htmlSanitizer.sanitizeHtml(this._receipt);
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    popupWin.document.open();
    popupWin.document.write(printableReceipt);
    popupWin.document.close();

    const waitForImagesToLoad = () => {
      const images = popupWin.document.images;
      if (images.length === 0) {
        popupWin.print();
        popupWin.close();
        return;
      }

      let loadedCount = 0;

      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          popupWin.print();
          popupWin.close();
        }
      };

      for (let i = 0; i < images.length; i++) {
        let img = images[i];

        if (img.complete) {
          onImageLoad();
        } else {
          img.onload = onImageLoad;
          img.onerror = onImageLoad;
        }
      }
    };

    setTimeout(waitForImagesToLoad, 500);
    return false;
  }

  close() {
    this.activeModal.dismiss();
    return false;
  }
}
