import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {FormPageStateService} from "../../../../../common/src/lib/utils/form-page-state.service";
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {CustomerService} from "../../../services/customer.service";
import {finalize, map, mergeMap, switchMap} from "rxjs/operators";
import {
  PaymentMethodsViewService
} from "../../../../../common/src/lib/payment/paymentmethod/payment-methods-view.service";
import {PaymentMethodsLabels} from "./payment-methods-labels";
import {PaymentMethodTypeEnum} from "../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {
  PaymentMethodsComponent,
  PaymentMethodsViewModel
} from "../../../../../common/src/lib/payment/paymentmethod/payment-methods.component";
import {BillingAddress} from "../../../../../common/src/lib/models/common/address.model";
import {Observable, of} from "rxjs";
import {CreditCardModel} from "../../../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../../../common/src/lib/models/sale/ach.model";
import {deepEqual, isDefined, ObjectHelper} from "../../../../../common/src/lib/helpers/object.helper";
import {AutoScrollingFormPageComponent} from "../../../../../common/src/lib/pages/auto-scrolling-form-page.component";
import cloneDeep from 'lodash/cloneDeep';
import {Mask} from "../../../../../common/src/lib/helpers/mask";
import {
  UseExistingPaymentMethodModalComponent
} from "../../modal/payment-method/use-existing-payment-method-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UseExistingPaymentMethodModalLabels} from "../../modal/payment-method/use-existing-payment-method-modal-labels";
import {CreditCardViewModel} from "../../../../../common/src/lib/payment/creditcard/credit-card-info-group.component";
import {ACHViewModel} from "../../../../../common/src/lib/payment/ach/ach-group.component";
import {ComponentCanDeactivate} from "../../../../../common/src/lib/pages/can-deactivate.component";
import {CustomerCurrentDataService} from "../../../services/customer-current-data.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
  selector: 'app-customer-portal-payment-methods-management',
  templateUrl: './customer-portal-payment-methods-management.component.html',
  styleUrls: ['./customer-portal-payment-methods-management.component.scss'],
  providers: [FormPageStateService, PaymentMethodsViewService]
})
export class CustomerPortalPaymentMethodsManagementComponent extends AutoScrollingFormPageComponent implements ComponentCanDeactivate {
  _paymentMethods = new FormControl<PaymentMethodsViewModel>(new PaymentMethodsViewModel(null, null));
  protected Labels = PaymentMethodsLabels;
  protected form = this._fb.group<PaymentDataAddFormModel>({
      paymentMethods: this._paymentMethods
    }
  )
  protected paymentMethodsLoading = false;

  @ViewChild(PaymentMethodsComponent) paymentMethodsComponent: PaymentMethodsComponent;
  protected initializing: boolean;

  constructor(formPageStateService: FormPageStateService,
              protected elementRef: ElementRef,
              errorService: ErrorService,
              protected customerService: CustomerService,
              protected _fb: FormBuilder,
              protected ch: ChangeDetectorRef,
              public paymentMethodsViewService: PaymentMethodsViewService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              private currentDataService: CustomerCurrentDataService,
              private modalService: NgbModal) {
    super(formPageStateService, elementRef, errorService);
    this.subscriptions.add(
      this.routingService.refreshAfterNavigate.subscribe(url => {
        const cleanPathname = window.location.pathname.replace(/^\/|\/$/g, '');
        const cleanUrl = url.replace(/^\/|\/$/g, '');
        if (cleanPathname == cleanUrl) {
          this.reInit();
        }
      })
    );
  }

  get defaultAddress(): BillingAddress {
    return {
      firstName: null,
      lastName: null,
      companyName: null,
      address1: null,
      address2: null,
      city: null,
      zip: null,
      state: null,
      country: null,
      phone: null,
      email: null
    }
  }

  protected get showSubmit(): boolean {
    return this._paymentMethods.value.selectedPaymentMethod.savePaymentMethod;
  }

  getForm(): FormGroup {
    return this.form;
  }

  protected onReInit(newData?: any) {
    this.initializing = true;
    this.subscriptions.add(
      this.customerService.getAllPaymentMethods()
        .pipe(finalize(() => {
          this.initializing = false;
          this.ch.detectChanges();
        }))
        .pipe(map(response => {
          this.paymentMethodsViewService.paymentMethods = response.paymentMethods;
          this.paymentMethodsViewService.globalPaymentsEnabled = this.currentDataService.currentCustomer.companyGlobalPaymentsEnabled;
        }))
        .subscribe());
  }

  protected onSubmit(value) {
    const paymentMethodType = this._paymentMethods.value.paymentMethodType;
    const paymentMethod = this._paymentMethods.value.selectedPaymentMethod;
    let pmCandidate: CreditCardModel | ACHModel;
    if (!isDefined(paymentMethod.id)) {
      if (paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
        const last4 = Mask.unmaskCreditCardNumber((paymentMethod as CreditCardModel).number).slice(-4);
        const date = (paymentMethod as CreditCardModel).date;
        pmCandidate = this.paymentMethodsViewService.paymentMethods.find(pm => pm instanceof CreditCardModel && pm.number.slice(-4) == last4 && (pm as CreditCardModel).date == date);
      } else if (paymentMethodType == PaymentMethodTypeEnum.ACH) {
        const accountNumber = (paymentMethod as ACHModel).accountNumber.slice(-4);
        const routingNumber = (paymentMethod as ACHModel).routingNumber;
        pmCandidate = this.paymentMethodsViewService.paymentMethods.find(pm => pm instanceof ACHModel && pm.accountNumber.slice(-4) == accountNumber && pm.routingNumber == routingNumber);
      }
      if (isDefined(pmCandidate)) {
        const onUseExisting = () => {
          this.form.controls.paymentMethods.reset({
            selectedPaymentMethod: Object.assign({savePaymentMethod: false}, pmCandidate),
            paymentMethodType: paymentMethodType
          });
          this.afterSubmit();
        }
        const onCreateNew = () => this.subscriptions.add(this.getSavePaymentMethodObservable().subscribe());
        const onCancel = () => this.afterSubmit();

        this.openConfirmAddSimilarPaymentMethod(paymentMethodType, pmCandidate, onUseExisting, onCreateNew, onCancel);
        return;
      }
    }
    this.subscriptions.add(this.getSavePaymentMethodObservable().subscribe());
  }

  protected onInit(): void {
    this.paymentMethodsViewService.autoSavePaymentMethods = true;
    this.paymentMethodsViewService.allowedPaymentMethods = [PaymentMethodTypeEnum.CREDIT_CARD, PaymentMethodTypeEnum.ACH];
    this.reInit();
  }

  protected getPaymentMethodsObservable(): Observable<void> {
    return of(this.paymentMethodsLoading = true).pipe(switchMap(() => this.customerService.getAllPaymentMethods().pipe(map(result => {
      let paymentMethods = cloneDeep(result.paymentMethods);
      paymentMethods = paymentMethods.sort((a, b) => {
        return b.customerDefault ? 1 : -1;
      });
      this.paymentMethodsViewService.paymentMethods = paymentMethods;
    })).pipe(finalize(() => {
      this.paymentMethodsLoading = false;
      this.ch.detectChanges();
    }))));
  }

  protected getPaymentMethodsObservableAndSelectDefault() {
    return this.getPaymentMethodsObservable().pipe(map(() => this.selectDefault()))
  }

  protected selectDefault() {
    if (this.paymentMethodsViewService.defaultPaymentMethod) {
      const paymentMethodType = this.paymentMethodsViewService.defaultPaymentMethod instanceof CreditCardModel ? PaymentMethodTypeEnum.CREDIT_CARD :
        this.paymentMethodsViewService.defaultPaymentMethod instanceof ACHModel ? PaymentMethodTypeEnum.ACH : null;
      this._paymentMethods.reset({
        paymentMethodType: paymentMethodType,
        selectedPaymentMethod: Object.assign({savePaymentMethod: false}, this.paymentMethodsViewService.defaultPaymentMethod)
      });
    } else {
      this._paymentMethods.reset({
        paymentMethodType: null,
        selectedPaymentMethod: null
      });
    }
  }


  protected getSavePaymentMethodObservable() {
    const paymentMethodType = this._paymentMethods.value.paymentMethodType;
    return this.customerService.savePaymentMethod(this._paymentMethods.value.paymentMethodType, this._paymentMethods.value.selectedPaymentMethod)
      .pipe(mergeMap(newPaymentMethod => this.getPaymentMethodsObservable()
        .pipe(map(() => {
          let savedPaymentMethod = this.paymentMethodsViewService.paymentMethods.find(pm => pm.id == newPaymentMethod.id);
          if (ObjectHelper.isDefined(savedPaymentMethod)) {
            if (paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
              savedPaymentMethod = (savedPaymentMethod as CreditCardModel);
              savedPaymentMethod.cvv = (newPaymentMethod as CreditCardModel).cvv;
            } else if (paymentMethodType == PaymentMethodTypeEnum.ACH) {
              savedPaymentMethod = (savedPaymentMethod as ACHModel);
            }
          }
          this.form.controls.paymentMethods.reset({
            selectedPaymentMethod: Object.assign({savePaymentMethod: false}, savedPaymentMethod),
            paymentMethodType: paymentMethodType
          });
        }))))
      .pipe(finalize(() => {
        this.afterSubmit();
        this.ch.detectChanges();
      }))
  }

  protected onDeletePaymentMethod(value: {
    paymentMethodType: PaymentMethodTypeEnum,
    paymentMethod: CreditCardModel | ACHModel
  }) {
    this.subscriptions.add(
      this.customerService.deletePaymentMethod(value.paymentMethodType, value.paymentMethod)
        .pipe(map(() => this.errorService.showSuccess('', 'Payment method deleted')))
        .pipe(mergeMap(() => this.getPaymentMethodsObservableAndSelectDefault()))
        .subscribe()
    )
  }

  openConfirmAddSimilarPaymentMethod(paymentMethodType: PaymentMethodTypeEnum, candidate: CreditCardModel | ACHModel, showExisting, createNewCallback, cancelCallback): void {
    const modalRef = this.modalService.open(UseExistingPaymentMethodModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.paymentMethodType = paymentMethodType;
    modalRef.componentInstance.candidate = candidate;
    modalRef.componentInstance.showExistingButtonName = UseExistingPaymentMethodModalLabels.ShowExisting;
    modalRef.result.then(result => {
      if (result) {
        return createNewCallback();
      }
      return showExisting();
    }, reason => {
      cancelCallback()
    });
  }

  get value(): { paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardViewModel | ACHViewModel } {
    return {
      paymentMethodType: this._paymentMethods.value.paymentMethodType,
      paymentMethod: this._paymentMethods.value.selectedPaymentMethod
    };
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.objectChanged();
  }

  objectChanged(): boolean | Observable<boolean> {
    const newValue = this.value;
    return this.showSubmit && isDefined(newValue.paymentMethod.id)
      || !isDefined(newValue.paymentMethod.id) && (newValue.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD && !deepEqual(CreditCardModel.toJSON(this.value.paymentMethod as CreditCardModel), CreditCardModel.toJSON(this.paymentMethodsComponent.newCC))
        || newValue.paymentMethodType == PaymentMethodTypeEnum.ACH && !deepEqual(ACHModel.toJSON(this.value.paymentMethod as ACHModel), ACHModel.toJSON(this.paymentMethodsComponent.newACH)))
  }
}

interface PaymentDataAddFormModel {
  paymentMethods: FormControl<PaymentMethodsViewModel>
}
