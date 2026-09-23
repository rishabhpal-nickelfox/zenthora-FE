import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input
} from '@angular/core';
import {
  ControlContainer, FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators
} from '@angular/forms';
import {CompanySettingsLabels} from "../company-settings-labels";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {ServerErrorService} from "../../../../../../../../common/src/lib/utils/server-error.service";
import {v4 as uuidv4} from 'uuid';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {
  FormGroupAsFormControlComponent
} from "../../../../../../../../common/src/lib/components/formgroup/form-group-as-form-control.component";
import {CustomValidator} from "../../../../../../../../common/src/lib/helpers/custom.validator";

@Component({
  standalone: false,
  selector: 'app-sale-payment-authorization-message',
  templateUrl: './sale-payment-authorization-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SalePaymentAuthorizationMessageComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: SalePaymentAuthorizationMessageComponent,
      multi: true
    }
  ]
})
export class SalePaymentAuthorizationMessageComponent extends FormGroupAsFormControlComponent {

  @Input() placeholders = [];
  id;
  readonly Labels = CompanySettingsLabels;
  _message: FormControl;
  readonly MAX_LENGTH = {
    AUTHORIZATION_MESSAGE: 1024
  };
  private readonly _form = new FormGroup({});
  private _isFormControlInFocus;

  constructor(protected elementRef: ElementRef, public errorService: ErrorService,
              protected ch: ChangeDetectorRef,
              private controlContainer: ControlContainer,
              private _fb: FormBuilder,
              public serverErrorService: ServerErrorService,
              private injector: Injector) {
    super(elementRef, errorService, ch, serverErrorService);
  }

  get ngControl(): NgControl {
    return this.injector.get(NgControl);
  }

  get activeElement(): Element {
    return document.activeElement;
  }

  static getWSKeyFormControlNameMap(): Map<string, string> {
    return new Map([
      ['message', 'message']
    ]);
  }

  getForm(): FormGroup {
    return this._form;
  }

  addPlaceholder(e, placeholder) {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      const position = (<HTMLInputElement>this.activeElement).selectionStart;
      const oldValue = this._message.value;
      const newValue = oldValue ? [oldValue.slice(0, position), placeholder.key, oldValue.slice(position)].join('') : placeholder.key;
      const newPosition = position + placeholder.key.length;
      this._message.setValue(newValue);
      (<HTMLInputElement>this.activeElement).setSelectionRange(newPosition, newPosition);
    }, 10);
    return false;
  }

  btnClick() {
    return false;
  }

  get isFormControlInFocus(): boolean {
    return this._isFormControlInFocus;
  }

  onFormControlFocus() {
    this._isFormControlInFocus = true;
    this.ch.detectChanges();
  }

  onFormControlBlur() {
    this._isFormControlInFocus = false;
    this.ch.detectChanges();
  }

  getWsKeys(): Map<string, FormControl> {
    return new Map<string, FormControl>([
      ['message', this._message]
    ]);
  }

  protected onInit(): void {
    this.id = uuidv4();
    this._message = new FormControl(null, Validators.compose([c => CustomValidator.required(this.Labels.AuthorizationMessage)(c), c => CustomValidator.maxLength(this.Labels.AuthorizationMessage, this.MAX_LENGTH.AUTHORIZATION_MESSAGE)(c)]));
    this._form.addControl('message', this._message);
  }

  protected onReInit(authorizationMessage: string) {
    this._message.reset(authorizationMessage);
    this._form.markAsPristine();
  }

  get value(): string {
    return this.getControls().message.value;
  }

  protected formValueChanges(): Observable<string> {
    return this.getForm().valueChanges.pipe(map(formValue => this.value))
  }
}
