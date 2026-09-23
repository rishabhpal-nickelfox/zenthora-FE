import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {CustomFieldsTableTemplateLayoutService} from './custom-fields-table-template-layout.service';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {SafeStyle} from '@angular/platform-browser';
import {FormPageComponent} from "../../../../pages/form-page.component";
import {FormPageStateService} from "../../../../utils/form-page-state.service";
import {CustomFieldGridAreaModel,
  CustomFieldsTemplateModel
} from "../../../../models/sale/template/invoice-template.model";
import {ErrorService} from "../../../../utils/errorhandler/error.service";
import {CustomFieldsLabels} from "./custom-fields-labels";
import cloneDeep from 'lodash/cloneDeep';
import {GridColumnsHelper} from "../../../../helpers/grid-columns.helper";
import {InvoiceItemsTableColumnsEnum
} from "../../../../enums/sale/invoice-items-table-columns.enum";
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue
} from "../../../../enums/sale/invoice-email-payment-template-components.enum";
import {HtmlSanitizerService} from '../../../../utils/html-sanitizer.service';
import {TEMPLATE_EDIT_COMPONENT_ID,
  TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE
} from "../invoice-email-payment-template.component";

@Component({
  standalone: false,
  selector: 'app-custom-fields-table-template',
  templateUrl: './custom-fields-table-template.component.html',
  styleUrls: ['../columns-drag.scss', './custom-fields-table-template.component.scss',
    '../../../../modals/external-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFieldsTableTemplateComponent extends FormPageComponent implements OnInit {
  styles: SafeStyle;
  private _template: CustomFieldsTemplateModel;
  readonly MAX_LENGTH = {
    HEADER: 20
  };
  customFieldsArray: FormArray = new FormArray([]);
  readonly Labels = CustomFieldsLabels;

  constructor(@Inject(TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE) private _viewService: CustomFieldsTableTemplateLayoutService,
              @Inject(TEMPLATE_EDIT_COMPONENT_ID) private _customFieldsId: string,
              public formPageStateService: FormPageStateService, protected elementRef: ElementRef, public errorService: ErrorService, private _activeModal: NgbActiveModal, protected ch: ChangeDetectorRef,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super(formPageStateService, elementRef, errorService);
  }


  protected _borderColor: FormControl<string> = new FormControl<string>(null);
  protected _titleColor = new FormControl<string>(null);
  protected _fontColor = new FormControl<string>(null);
  protected _colorOdd = new FormControl<string>(null);
  private _form = new FormGroup({
      fontColor: this._fontColor,
      borderColor: this._borderColor,
      colorOdd: this._colorOdd,
      titleColor: this._titleColor
    }
  );


  protected onColumnDrop(event: CdkDragDrop<CustomFieldGridAreaModel[]>): void {
    if (GridColumnsHelper.reorder(this.customFields, event.previousIndex, event.currentIndex)) {
      this.buildFormArray();
      this.ch.detectChanges();
    }
  }

  trackById(index: number, item: CustomFieldGridAreaModel) {
    return item.id;
  }

  get viewService(): CustomFieldsTableTemplateLayoutService {
    return this._viewService;
  }

  get customFieldsId(): string {
    return this._customFieldsId;
  }

  ngOnInit(): void {
    this.reInit();
  }

  close() {
    this.activeModal.dismiss();
  }

  get activeModal() {
    return this._activeModal;
  }


  protected onReInit() {
    this._template = cloneDeep(this.viewService.getTemplate(this.customFieldsId));
    this._fontColor.reset(this._template.fontColor);
    this._borderColor.reset(this._template.borderColor);
    this._colorOdd.reset(this._template.colorOdd);
    this._titleColor.reset(this._template.titleColor);
    this.buildFormArray();

    this.subscriptions.add(this._fontColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._borderColor.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._colorOdd.valueChanges.subscribe(() => this.updateStyles()));
    this.subscriptions.add(this._titleColor.valueChanges.subscribe(() => this.updateStyles()));

    this.updateStyles();
    this.ch.detectChanges();
  }

  buildFormArray() {
    this.customFieldsArray.clear();

    this.customFields.forEach((item) => {
      const control = new FormControl(item.name);
      this.customFieldsArray.push(control);

      control.valueChanges.subscribe((newValue) => {
        const target = this.customFields.find(i => i.id === item.id);
        if (target) {
          target.name = newValue;
        }
      });
    });
  }

  addCustomField() {
    // When header suggestions are available, start with an empty header so the
    // datalist shows all options on focus; otherwise fall back to a placeholder name.
    const name = this.viewService.availableCustomFieldNames.length
      ? ''
      : `Custom Field ${this.customFields.length + 1}`;
    this.viewService.addItem(this.customFields, name);
    this.customFieldsArray.push(new FormControl(name));
  }

  removeColumn(index: number) {
    this.customFields.splice(index, 1);
    this.customFieldsArray.removeAt(index);
  }

  protected onSubmit({value}: { value: any }) {
    this.viewService.updateTemplate(this._template.id, this._fontColor.value, this._borderColor.value, this._colorOdd.value, this._titleColor.value, this._template.customFields);
    this.activeModal.close();
  }

  private updateStyles() {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                      app-custom-fields-table-template {
                        --border: ${this.viewService.getBorderFromColor(this._borderColor.value)};
                        --fontColor: ${this._fontColor.value};
                        --colorOdd: ${this._colorOdd.value};
                        --titleColor: ${this._titleColor.value};

                        .table {
                          border-top: var(--border);
                          border-left: var(--border);
                          color: var(--fontColor)
                        }

                        .td, .th {
                          border-bottom: var(--border);
                          border-right: var(--border);
                        }

                        .th {
                            background: var(--titleColor);
                        }

                        .td {
                            background: var(--colorOdd);
                        }

                      }
                      </style>`);
    this.ch.detectChanges();
  }

  public getForm(): FormGroup {
    return this._form;
  }

  get customFields() {
    return this._template.customFields;
  }

  set customFields(customFields: CustomFieldGridAreaModel[]) {
    this._template.customFields = customFields;
  }

  protected readonly InvoiceItemsTableColumnsEnum = InvoiceItemsTableColumnsEnum;
  protected readonly CustomFieldsTableTemplateLayoutService = CustomFieldsTableTemplateLayoutService;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
}
