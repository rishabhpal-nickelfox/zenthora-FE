import {FormGroupAsFormControlComponent} from "../../components/formgroup/form-group-as-form-control.component";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from "@angular/forms";
import {ErrorService} from "../../utils/errorhandler/error.service";
import {ServerErrorService} from "../../utils/server-error.service";
import {CreditCardModel} from "../../models/sale/credit-card.model";
import {ACHModel} from "../../models/sale/ach.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {CustomValidator} from "../../helpers/custom.validator";
import {PaymentMethodTypeEnum, PaymentMethodTypeEnumValue} from "../../enums/sale/payment-method-type.enum";
import {NbTabsetComponent} from "@nebular/theme";
import {PaymentMethodLabels} from "./payment-method-labels";
import {BillingAddress} from "../../models/common/address.model";
import {ConfirmModalComponent} from "../../modals/confirm/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {PaymentMethodPreviewModel} from "./payment-method-preview.component";
import {CreditCardViewService} from "../creditcard/credit-card-view.service";
import {PaymentMethodViewModeEnum} from "../../enums/sale/payment-method-view-mode.enum";
import {ACHViewService} from "../ach/ach-view.service";
import {CreditCardEnumValue} from "../../enums/sale/credit-card.enum";
import {AccountTypeEnumValue} from "../../enums/sale/account-type.enum";
import {PaymentMethodsViewService} from "./payment-methods-view.service";
import {isDefined} from "../../helpers/object.helper";
import {CreditCardViewModel} from "../creditcard/credit-card-info-group.component";
import {ACHViewModel} from "../ach/ach-group.component";

@Component({
  standalone: false,
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaymentMethodsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PaymentMethodsComponent,
      multi: true
    },
    CreditCardViewService,
    ACHViewService
  ],
  styleUrls: ['payment-methods.component.scss']
})
export class PaymentMethodsComponent extends FormGroupAsFormControlComponent implements OnInit, OnDestroy {
  @Input() copyFromLabel: string;
  @Output() deletePaymentMethod: EventEmitter<{
    paymentMethodType: PaymentMethodTypeEnum;
    paymentMethod: CreditCardModel | ACHModel
  }> = new EventEmitter();

  _paymentMethodType = new FormControl<PaymentMethodTypeEnum>(null, Validators.compose([c => CustomValidator.required('Payment method')]));
  _creditCardData = new FormControl<CreditCardViewModel>(new CreditCardViewModel());
  _achData = new FormControl<ACHViewModel>(new ACHViewModel());

  protected readonly PaymentMethodTypeEnumValue = PaymentMethodTypeEnumValue;
  protected readonly PaymentMethodTypeEnum = PaymentMethodTypeEnum;
  protected readonly Labels = PaymentMethodLabels;

  protected itemsPerSlide = 3;
  private _paymentMethodsAreLoading = false;

  private form = this._fb.group<PaymentMethodsGroupModel>({
    paymentMethodType: this._paymentMethodType,
    creditCardData: this._creditCardData,
    achData: this._achData
  });

  constructor(protected elementRef: ElementRef,
              public errorService: ErrorService,
              public serverErrorService: ServerErrorService,
              protected ch: ChangeDetectorRef,
              private injector: Injector,
              private _fb: FormBuilder,
              private modalService: NgbModal,
              private creditCardViewService: CreditCardViewService,
              private achViewService: ACHViewService,
              public viewService: PaymentMethodsViewService) {
    super(elementRef, errorService, ch, serverErrorService);
  }

  private _defaultAddress: BillingAddress;
  get defaultAddress(): BillingAddress {
    return this._defaultAddress;
  }

  @Input() set defaultAddress(value: BillingAddress) {
    this._defaultAddress = value;
    this.creditCardViewService.defaultAddress = value;
    this.achViewService.defaultAddress = value;
  }

  private _paymentMethodTabset: NbTabsetComponent;
  private _carouselReady = false;

  @ViewChild('paymentMethod', {static: false}) set paymentMethodTabset(value: NbTabsetComponent) {
    this._paymentMethodTabset = value;
    if (value) {
      this.subscriptions.add(this._paymentMethodTabset.changeTab.subscribe(newTab => {
        if (newTab.tabId != this._paymentMethodType.value) {
          this._paymentMethodType.setValue(newTab.tabId);
        }
      }));
    }
  }

  get value(): PaymentMethodsViewModel {
    const paymentMethodType = this._paymentMethodType.value;
    const selectedPaymentMethod = paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD
      ? this._creditCardData.getRawValue()
      : this._achData.getRawValue();
    return {paymentMethodType, selectedPaymentMethod};
  }

  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }

  private getType(pm: CreditCardModel | ACHModel | null): PaymentMethodTypeEnum | null {
    if (!pm) return null;
    if (pm instanceof CreditCardModel) return PaymentMethodTypeEnum.CREDIT_CARD;
    if (pm instanceof ACHModel) return PaymentMethodTypeEnum.ACH;
    return null;
  }

  protected get filteredPaymentMethods(): Array<CreditCardModel | ACHModel> {
    const t = this._paymentMethodType.value;
    const list = this.viewService.paymentMethods ?? [];
    return t ? list.filter(pm => this.getType(pm) === t) : list;
  }

  get selectedIndex(): number {
    const i = this.filteredPaymentMethods.findIndex(pm => pm?.id == this.selectedPaymentMethod?.id);
    return i >= 0 ? i + 1 : 0;
  }

  protected get showFullTabs(): boolean {
    return (this.viewService.allowedPaymentMethods?.length ?? 0) > 1;
  }

  protected get selectedPaymentMethod(): CreditCardViewModel | ACHViewModel {
    return this.value.selectedPaymentMethod;
  }

  protected get isSelectedPaymentMethodNew(): boolean {
    return !this.isDefined(this.selectedPaymentMethod?.id);
  }

  protected get isCurrentUserOwner(): boolean {
    return this.isSelectedPaymentMethodNew || this.selectedPaymentMethod?.isCurrentUserOwner;
  }

  protected get showPaymentMethodsCarousel(): boolean {
    return this.filteredPaymentMethods?.length >= this.itemsPerSlide && !this._paymentMethodsAreLoading;
  }

  protected get showPaymentMethodsRow(): boolean {
    return (this.filteredPaymentMethods?.length > 0) && !this.showPaymentMethodsCarousel;
  }

  private get defaultPaymentMethod(): PaymentMethodTypeEnum {
    return this.viewService.allowedPaymentMethods.length > 1 ||
    this.viewService.allowedPaymentMethods[0] == PaymentMethodTypeEnum.CREDIT_CARD
      ? PaymentMethodTypeEnum.CREDIT_CARD
      : PaymentMethodTypeEnum.ACH;
  }

  get newACH(): ACHViewModel {
    const m = new ACHViewModel();
    m.country = this.achViewService.defaultCountry;
    m.batchDefault = !isDefined(this.viewService.batchDefaultPaymentMethod);
    m.paymentDefault = !isDefined(this.viewService.paymentDefaultPaymentMethod);
    m.customerDefault = true;
    m.isPrivate = true;
    m.isCurrentUserOwner = true;
    m.savePaymentMethod = this.viewService.canManagePaymentMethods;
    return m;
  }

  get newCC(): CreditCardViewModel {
    const m = new CreditCardViewModel();
    m.country = this.creditCardViewService.defaultCountry;
    m.batchDefault = !isDefined(this.viewService.batchDefaultPaymentMethod);
    m.paymentDefault = !isDefined(this.viewService.paymentDefaultPaymentMethod);
    m.customerDefault = true;
    m.isPrivate = true;
    m.isCurrentUserOwner = true;
    m.savePaymentMethod = this.viewService.canManagePaymentMethods;
    return m;
  }

  getWsKeys(): Map<string, FormControl<any>> {
    return new Map<string, FormControl<any>>([
      ['paymentMethod', this._paymentMethodType],
      ['paymentMethodType', this._paymentMethodType],
      ['creditCardData', this._creditCardData],
      ['achData', this._achData]
    ]);
  }

  getForm(): FormGroup<PaymentMethodsGroupModel> {
    return this.form;
  }

  canSelectPaymentMethod(paymentMethod: CreditCardModel | ACHModel): boolean {
    return !paymentMethod || !paymentMethod.errors || paymentMethod.errors.length == 0;
  }

  protected onInit(): void {
    this.creditCardViewService.globalPaymentsEnabled = this.viewService.globalPaymentsEnabled;
    this.creditCardViewService.showCvv = this.viewService.usePaymentMethod;
    this.achViewService.autoSavePaymentMethods = this.viewService.autoSavePaymentMethods;
    this.creditCardViewService.autoSavePaymentMethods = this.viewService.autoSavePaymentMethods;
    this.creditCardViewService.canManagePaymentMethods = this.viewService.canManagePaymentMethods;
    this.achViewService.canManagePaymentMethods = this.viewService.canManagePaymentMethods;

    this.subscriptions.add(
      this.viewService.paymentMethodsChanged.subscribe(() => {
        this._paymentMethodsAreLoading = true;
        this.ch.detectChanges();
        this._paymentMethodsAreLoading = false;
      })
    );

    this.subscriptions.add(
      this.viewService.globalPaymentEnabledChanged.subscribe(
        () => this.creditCardViewService.globalPaymentsEnabled = this.viewService.globalPaymentsEnabled
      )
    );

    this.subscriptions.add(
      this.viewService.usePaymentMethodChanged.subscribe(
        () => this.creditCardViewService.showCvv = this.viewService.usePaymentMethod
      )
    );

    this.subscriptions.add(this._paymentMethodType.valueChanges.subscribe(
      value => {
        this._achData.reset(this.newACH);
        this._creditCardData.reset(this.newCC);

        if (value === PaymentMethodTypeEnum.CREDIT_CARD) {
          this._creditCardData.enable();
          this._creditCardData.updateValueAndValidity();
          this._achData.disable();
        } else if (value === PaymentMethodTypeEnum.ACH) {
          this._achData.enable();
          this._achData.updateValueAndValidity();
          this._creditCardData.disable();
        } else {
          this._achData.disable();
          this._creditCardData.disable();
        }
        this.viewService.paymentMethodTypeChanged.emit();
        this.ch.detectChanges();
      }
    ));

    this.subscriptions.add(
      this.viewService.autoSavePaymentMethodsChanged.subscribe(
        () => {
          this.achViewService.autoSavePaymentMethods = this.viewService.autoSavePaymentMethods;
          this.creditCardViewService.autoSavePaymentMethods = this.viewService.autoSavePaymentMethods;
        }
      )
    );

    this.subscriptions.add(
      this.viewService.canManagePaymentMethodsChanged.subscribe(
        () => {
          this.achViewService.canManagePaymentMethods = this.viewService.canManagePaymentMethods;
          this.creditCardViewService.canManagePaymentMethods = this.viewService.canManagePaymentMethods;
        }
      )
    );
  }

  protected formValueChanges(): Observable<PaymentMethodsViewModel> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }

  protected onReInit(newData: PaymentMethodsViewModel) {
    if (newData.paymentMethodType && newData.selectedPaymentMethod) {
      const hasId = isDefined((newData.selectedPaymentMethod as any)?.id);

      if (newData.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
        this._paymentMethodType.reset(PaymentMethodTypeEnum.CREDIT_CARD);

        const ccViewModel: CreditCardViewModel =
          Object.assign({savePaymentMethod: false}, newData.selectedPaymentMethod as CreditCardModel);

        this._creditCardData.reset(ccViewModel);
        this._achData.reset(new ACHViewModel());

        this.creditCardViewService.isCurrentUserOwner = hasId ? (ccViewModel.isCurrentUserOwner ?? false) : true;
        this.creditCardViewService.mode = hasId ? PaymentMethodViewModeEnum.VIEW : PaymentMethodViewModeEnum.CREATE;

      } else if (newData.paymentMethodType == PaymentMethodTypeEnum.ACH) {
        this._paymentMethodType.reset(PaymentMethodTypeEnum.ACH);

        this._creditCardData.reset(new CreditCardViewModel());
        const achViewModel: ACHViewModel =
          Object.assign({savePaymentMethod: false}, newData.selectedPaymentMethod as ACHViewModel);

        this._achData.reset(achViewModel);

        this.achViewService.isCurrentUserOwner = hasId ? (achViewModel.isCurrentUserOwner ?? false) : true;
        this.achViewService.mode = hasId ? PaymentMethodViewModeEnum.VIEW : PaymentMethodViewModeEnum.CREATE;

      } else {
        throw new Error('Unsupported payment method type');
      }

    } else {
      this._paymentMethodType.reset(this.defaultPaymentMethod);

      this.creditCardViewService.mode = PaymentMethodViewModeEnum.CREATE;
      this.creditCardViewService.isCurrentUserOwner = true;

      this.achViewService.mode = PaymentMethodViewModeEnum.CREATE;
      this.achViewService.isCurrentUserOwner = true;

      this._creditCardData.reset(this.newCC);
      this._achData.reset(this.newACH);
    }
    this.rebuildCarousel();
    this.ch.detectChanges();
  }

  protected selectPaymentMethod(paymentMethod: CreditCardModel | ACHModel | null): void {
    if (paymentMethod && !this.canSelectPaymentMethod(paymentMethod)) return;

    const type = paymentMethod
      ? this.getType(paymentMethod)
      : this._paymentMethodType.value;

    this.reInit(new PaymentMethodsViewModel(
      type!,
      paymentMethod ?? (type === PaymentMethodTypeEnum.CREDIT_CARD ? this.newCC : this.newACH)
    ));
    this.getForm().updateValueAndValidity();
  }

  protected isSelectedPaymentMethod(paymentMethod: CreditCardModel | ACHModel): boolean {
    return (!this.isDefined(paymentMethod) && !this.isDefined(this.selectedPaymentMethod?.id))
      || (this.isDefined(paymentMethod) && this.selectedPaymentMethod?.id == (paymentMethod as any)?.id);
  }

  protected onEditPaymentMethod(paymentMethodPreviewModel: PaymentMethodPreviewModel) {
    if (paymentMethodPreviewModel.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
      this.creditCardViewService.mode = PaymentMethodViewModeEnum.EDIT;
    } else {
      this.achViewService.mode = PaymentMethodViewModeEnum.EDIT;
    }
    this.getForm().updateValueAndValidity();
    this.ch.detectChanges();
  }

  protected onDeletePaymentMethod(paymentMethodPreviewModel: PaymentMethodPreviewModel) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.header = 'Delete Payment Method';

    const typeAndNumber = this.getPaymentMethodTypeAndNumber(paymentMethodPreviewModel);
    const type = typeAndNumber.type;
    const number = typeAndNumber.number;

    modalRef.componentInstance.body = `Are you sure you want to delete ${type} ${number}?`;
    modalRef.componentInstance.okButtonText = 'Yes';
    modalRef.componentInstance.cancelButtonText = 'No';
    modalRef.result.then(() => {
      this.deletePaymentMethod.emit({
        paymentMethodType: paymentMethodPreviewModel.paymentMethodType,
        paymentMethod: paymentMethodPreviewModel.paymentMethod
      });
    }, reason => {
    });
    return false;
  }

  private getPaymentMethodTypeAndNumber(paymentMethodPreviewModel: PaymentMethodPreviewModel): {
    type: string,
    number: string
  } {
    let type = null;
    let number = null;
    if (paymentMethodPreviewModel.paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD) {
      number = (paymentMethodPreviewModel.paymentMethod as CreditCardModel).number
      type = CreditCardEnumValue.get((paymentMethodPreviewModel.paymentMethod as CreditCardModel).cardType)
        ?? PaymentMethodTypeEnumValue.get(PaymentMethodTypeEnum.CREDIT_CARD);
    } else if (paymentMethodPreviewModel.paymentMethodType == PaymentMethodTypeEnum.ACH) {
      number = (paymentMethodPreviewModel.paymentMethod as ACHModel).accountNumber;
      type = AccountTypeEnumValue.get((paymentMethodPreviewModel.paymentMethod as ACHModel).accountType)
        ?? PaymentMethodTypeEnumValue.get(PaymentMethodTypeEnum.ACH)
    }
    return {type, number};
  }

  get carouselReady(): boolean {
    return this._carouselReady;
  }

  private rebuildCarousel() {
    this._carouselReady = false;
    Promise.resolve().then(() => this._carouselReady = true);
  }
}

export class PaymentMethodsViewModel {
  paymentMethodType: PaymentMethodTypeEnum;
  selectedPaymentMethod: CreditCardViewModel | ACHViewModel;

  constructor(paymentMethodType: PaymentMethodTypeEnum, selectedPaymentMethod: CreditCardModel | ACHModel) {
    this.paymentMethodType = paymentMethodType;
    this.selectedPaymentMethod = Object.assign({savePaymentMethod: false}, selectedPaymentMethod);
  }
}

interface PaymentMethodsGroupModel {
  paymentMethodType: FormControl<PaymentMethodTypeEnum>;
  creditCardData: FormControl<CreditCardModel>;
  achData: FormControl<ACHModel>;
}
