import {ElementRef, EventEmitter} from '@angular/core';
import {ComponentWithSubscriptions} from '../components/component-with-subscriptions';
import {DEFAULT_DATE_CONFIG} from "../helpers/date.helper";
import {Mask} from "../helpers/mask";
import {FormHelper} from "../helpers/form.helper";

export abstract class DetailViewComponent extends ComponentWithSubscriptions {
  dateConfig = DEFAULT_DATE_CONFIG;
  MASK = new Mask();

  cancelEvent: EventEmitter<any> = new EventEmitter();

  constructor(protected elementRef: ElementRef) {
    super();
  }

  get nativeElement() {
    return this.elementRef.nativeElement;
  }

  protected abstract onReInit(newData?: any);

  reInit(newData?: any) {
    this.onReInit(newData);
  }

  enumKeys(e) {
    return Object.keys(e);
  }


  print(printDiv: ElementRef) {
    const head = document.head.innerHTML;
    const classList = Array.from(document.body.classList).join(' ');

    const popup = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popup.document.open();

    popup.document.write(`<html>${head}<body onload="setTimeout(window.print,10);setTimeout(window.close,15)" class="${classList}">${printDiv.nativeElement.innerHTML}</body></html>`);
    popup.document.close();
  }


  findInDictionaryById(dictionary, id) {
    return FormHelper.findInDictionaryById(dictionary, id);
  }

  protected onCancel(): boolean {
    this.cancelEvent.emit();
    return false;
  }

  cancel() {
    return this.onCancel();
  }
}
