import {Component, ElementRef, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ComponentWithSubscriptions} from "../../../../../../../common/src/lib/components/component-with-subscriptions";

@Component({
  standalone: false,
  selector: 'app-invoice-table-select-currency',
  templateUrl: './select-currency-modal.component.html',
  styleUrls: ['../../../../../../../common/src/lib/modals/external-modal.scss']
})
export class SelectCurrencyModal extends ComponentWithSubscriptions implements OnInit {

  currencies: string[]

  constructor(protected elementRef: ElementRef, protected _fb: FormBuilder, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit(): void {
  }

  apply(currency: string) {
    this.activeModal.close(currency);
  }

  close() {
    this.activeModal.dismiss();
    return false;
  }


}
