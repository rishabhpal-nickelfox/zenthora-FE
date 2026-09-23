import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SalePortalPaymentComponent} from "../sale-portal-payment.component";
import {FormPageStateService} from "../../../../../../common/src/lib/utils/form-page-state.service";
import {
  PaymentMethodsViewService
} from "../../../../../../common/src/lib/payment/paymentmethod/payment-methods-view.service";
import {SalePrintService} from "@eps/common";
import {PaymentHistoryComponent} from "../../../../../../common/src/lib/sale/view/payment-history.component";
import {ErrorService} from "../../../../../../common/src/lib/utils/errorhandler/error.service";
import {ServerErrorService} from "../../../../../../common/src/lib/utils/server-error.service";
import {FormBuilder} from "@angular/forms";
import {SalePaymentViewService} from "../../../../services/sale-payment-view.service";
import {CustomerService} from "../../../../services/customer.service";
import {AlertService} from "../../../../../../common/src/lib/utils/alert.service";
import {
  FieldValidationErrorService
} from "../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {DepositService} from "../../../../services/deposit.service";
import {SaleService} from "../../../../services/sale.service";
import {PaymentErrorService} from "../../../../../../common/src/lib/utils/errorhandler/payment-error.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerPermissionService} from "../../../../services/customer-permission.service";
import {TermService} from "../../../../../../common/src/lib/services/eula/term.service";
import {SaleEmailPaymentLabels} from "../../../checkout/sale-email-payment-labels";
import {HtmlSanitizerService} from "../../../../../../common/src/lib/utils/html-sanitizer.service";

@Component({
  standalone: false,
  selector: 'app-deposit-payment',
  templateUrl: '../sale-portal-payment.component.html',
  styleUrls: ['../sale-portal-payment.component.scss'],
  outputs: ['saveEvent', 'cancelEvent'],
  providers: [FormPageStateService, PaymentMethodsViewService, SalePrintService, SalePaymentViewService]
})
export class DepositPaymentComponent extends SalePortalPaymentComponent implements OnInit {
  @ViewChild(PaymentHistoryComponent) protected saleEmailPaymentHistoryComponent: PaymentHistoryComponent;

  constructor(formPageStateService: FormPageStateService, elementRef: ElementRef,
              errorService: ErrorService, formServerErrorService: ServerErrorService,
              protected ch: ChangeDetectorRef, protected _fb: FormBuilder,
              protected viewService: SalePaymentViewService,
              protected paymentMethodsViewService: PaymentMethodsViewService,
              protected htmlSanitizer: HtmlSanitizerService,
              protected printService: SalePrintService,
              protected customerService: CustomerService,
              protected modalService: NgbModal,
              protected alertService: AlertService,
              protected fieldValidationService: FieldValidationErrorService,
              protected paymentErrorService: PaymentErrorService,
              protected depositService: DepositService,
              protected customerPermissionService: CustomerPermissionService,
              protected termService: TermService) {
    super(formPageStateService, elementRef, errorService, formServerErrorService, ch, _fb, viewService, paymentMethodsViewService, htmlSanitizer, printService, customerService, modalService, alertService, fieldValidationService, paymentErrorService, customerPermissionService, termService);
  }

  @ViewChild("printSale") private _printSale: ElementRef;

  protected get printSale(): ElementRef {
    return this._printSale;
  }

  protected get saleService(): SaleService {
    return this.depositService;
  }

}
