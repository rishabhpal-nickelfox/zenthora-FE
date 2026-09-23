import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ErrorService} from '../../utils/errorhandler/error.service';
import {DomSanitizer} from "@angular/platform-browser";
import {PaymentStatusEnum, PaymentStatusEnumValue} from "../../enums/sale/payment-status.enum";
import {ComponentWithSubscriptions} from "../../components/component-with-subscriptions";
import {SaleViewModel} from "../../models/sale/sale-view.model";
import {DocTypeEnum} from "../../enums/sale/doc-type.enum";

@Component({
  standalone: false,
  selector: 'app-sale-view',
  templateUrl: './sale-view.component.html',
  styleUrls: ['sale-view.component.scss']
})
export class SaleViewComponent extends ComponentWithSubscriptions implements OnInit {

  @Input() viewModel: SaleViewModel;
  @Input() docType: DocTypeEnum;

  SaleStatusEnum = PaymentStatusEnum;
  SaleStatusEnumValue = PaymentStatusEnumValue;
  protected readonly document = document;

  constructor(protected ch: ChangeDetectorRef,
              protected domSanitizer: DomSanitizer,
              public errorService: ErrorService) {
    super();
  }


  ngOnInit(): void {
  }

}
