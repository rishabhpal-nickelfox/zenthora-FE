import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {GridsterConfig} from 'angular-gridster2';
import {GridsterItem} from 'angular-gridster2/lib/gridsterItem.interface';
import {NbDialogService} from '@nebular/theme';
import {
  PaymentFormControlType,
  PaymentFormControlTypeValue
} from '../../../../../../../../common/src/lib/enums/payment-form-control-type.enum';
import {PaymentFormTemplateItemEditComponent} from './payment-form-template-item-edit.component';
import {PaymentFormTemplateItem} from "../../../../../../../../common/src/lib/models/paymentform/payment-form-template.model";
import {PaymentFormTemplateEditorViewService} from './payment-form-template-editor-view.service';
import {ErrorService} from '../../../../../../../../common/src/lib/utils/errorhandler/error.service';
import {ObjectHelper} from '../../../../../../../../common/src/lib/helpers/object.helper';

@Component({
  standalone: false,
  selector: 'app-payment-form-template-editor',
  templateUrl: './payment-form-template-editor.component.html',
  styleUrls: [
    '../../../../../../../../common/src/assets/payment-form.scss',
    './payment-form-template-editor.component.scss'
  ]
})
export class PaymentFormTemplateEditorComponent implements OnChanges, AfterViewChecked {
  @Input() template: string;
  @Input() companyLogo: string;
  @Input() companyLogoContentType: string;
  @Output() templateChange = new EventEmitter<string>();

  readonly PaymentFormControlType = PaymentFormControlType;
  readonly PaymentFormControlTypeLabel = PaymentFormControlTypeValue;

  layout: PaymentFormTemplateItem[] = [];
  private addedItemId: string | null = null;
  private aspectRatios = new Map<string, number>();
  private imageSizes = new Map<string, number>();
  private originalSizes = new Map<string, { cols: number; rows: number }>();
  options: GridsterConfig = {
    gridType: 'fixed',
    setGridSize: true,
    displayGrid: 'always',
    minCols: this.viewService.maxCols,
    maxCols: this.viewService.maxCols,
    minRows: 4,
    fixedColWidth: this.viewService.cellSize,
    fixedRowHeight: this.viewService.cellSize,
    margin: 0,
    minItemCols: this.viewService.minCols,
    minItemRows: 1,
    pushItems: true,
    draggable: {enabled: true, ignoreContentClass: 'payment-form-template-editor__action-btn'},
    resizable: {
      enabled: true,
      stop: (item: GridsterItem) => {
        this.zone.run(() => {
          const pfItem = item as PaymentFormTemplateItem;
          const key = pfItem.type === PaymentFormControlType.LOGO ? PaymentFormControlType.LOGO : pfItem.id;
          this.viewService.enforceAspectRatio(item, this.aspectRatios.get(key));
          this.viewService.assignTextareaRows(pfItem);
          this.emitTemplate();
        });
      }
    },
    itemChangeCallback: (item: GridsterItem) => {
      this.zone.run(() => {
        this.viewService.enforceRows(item);
        this.viewService.assignTextareaRows(item as PaymentFormTemplateItem);
        this.emitTemplate();
      });
    }
  };

  constructor(private dialogService: NbDialogService,
              private zone: NgZone,
              private sanitizer: DomSanitizer,
              private errorService: ErrorService,
              public viewService: PaymentFormTemplateEditorViewService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.template) {
      this.layout = this.viewService.parseTemplate(this.template);
      this.populateImageAspectRatios(this.layout);
    }
    if (changes.companyLogo || changes.companyLogoContentType) {
      this.getLogoWidthAndHeight().then(dimensions => {
        if (dimensions) {
          const ratio = dimensions.width / dimensions.height;
          this.aspectRatios.set(PaymentFormControlType.LOGO, ratio);
          this.originalSizes.set(PaymentFormControlType.LOGO, this.viewService.convertWidthAndHeightToColsAndRows(dimensions.width, ratio));
        } else {
          this.aspectRatios.delete(PaymentFormControlType.LOGO);
          this.originalSizes.delete(PaymentFormControlType.LOGO);
        }
      });
    }
  }

  async addLogo() {
    const dimensions = await this.getLogoWidthAndHeight();
    this.zone.run(() => {
      if (!dimensions) {
        this.errorService.showError('', 'Failed to load logo');
        return;
      }
      const ratio = dimensions.width / dimensions.height;
      this.aspectRatios.set(PaymentFormControlType.LOGO, ratio);
      const colsAndRows = this.viewService.convertWidthAndHeightToColsAndRows(dimensions.width, ratio);
      this.originalSizes.set(PaymentFormControlType.LOGO, colsAndRows);
      this.addItem({type: PaymentFormControlType.LOGO, cols: colsAndRows.cols, rows: colsAndRows.rows});
    });
  }

  addText() {
    this.addItem(this.viewService.getDefaultsByType(PaymentFormControlType.TEXT));
  }

  addInput() {
    this.addItem(this.viewService.getDefaultsByType(PaymentFormControlType.INPUT));
  }

  addDate() {
    this.addItem(this.viewService.getDefaultsByType(PaymentFormControlType.DATE));
  }

  addSelect() {
    this.addItem(this.viewService.getDefaultsByType(PaymentFormControlType.SELECT));
  }

  addTextarea() {
    this.addItem(this.viewService.getDefaultsByType(PaymentFormControlType.TEXTAREA));
  }

  triggerImageFilePicker() {
    this.viewService.triggerFilePicker('imageFileInput');
  }

  async onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const currentTotalBytes = [...this.imageSizes.values()].reduce((sum, s) => sum + s, 0);
    const sizeError = this.viewService.validateImageFileSize(file, currentTotalBytes);
    if (sizeError) {
      this.errorService.showError('', sizeError);
      return;
    }

    const {base64, contentType, dimensions, size} = await this.viewService.readImageFile(file);
    const ratio = dimensions ? dimensions.width / dimensions.height : null;
    const {cols, rows} = ratio
      ? this.viewService.convertWidthAndHeightToColsAndRows(dimensions.width, ratio)
      : {cols: 7, rows: 2};

    const item = this.addItem({
      type: PaymentFormControlType.IMAGE,
      value: base64,
      imageContentType: contentType,
      cols,
      rows,
      originalCols: cols,
      originalRows: rows
    });
    this.imageSizes.set(item.id, size);
    if (ratio) {
      this.aspectRatios.set(item.id, ratio);
      this.originalSizes.set(item.id, {cols, rows});
    }
  }

  edit(item: PaymentFormTemplateItem) {
    this.zone.run(() => {
      const modalRef = this.dialogService.open(PaymentFormTemplateItemEditComponent, {
        context: {
          item: ObjectHelper.cloneDeep(item)
        },
        closeOnBackdropClick: false,
        hasBackdrop: true,
        hasScroll: false,
        autoFocus: false,
        dialogClass: 'paymentform-edit-dialog'
      });
      modalRef.onClose.subscribe((updated: PaymentFormTemplateItem) => {
        if (!updated) {
          return;
        }
        const index = this.layout.findIndex(i => i.id === item.id);
        if (index >= 0) {
          this.layout[index] = this.viewService.withGridsterItemOptions({
            ...updated,
            x: item.x,
            y: item.y,
            cols: item.cols,
            rows: item.rows
          });
          this.emitTemplate();
        }
      });
    });
  }

  revertToOriginalSize(item: PaymentFormTemplateItem) {
    const key = item.type === PaymentFormControlType.LOGO ? PaymentFormControlType.LOGO : item.id;
    const original = this.originalSizes.get(key);
    if (!original) return;

    const extraRows = original.rows - item.rows;
    if (extraRows > 0) {
      const bottomEdge = item.y + item.rows;
      this.layout.forEach(other => {
        if (other.id === item.id) return;
        if (other.y >= bottomEdge) {
          other.y += extraRows;
        }
      });
    }

    item.cols = original.cols;
    item.rows = original.rows;
    this.options.api?.optionsChanged();
    this.emitTemplate();
  }

  isAtOriginalSize(item: PaymentFormTemplateItem): boolean {
    const key = item.type === PaymentFormControlType.LOGO ? PaymentFormControlType.LOGO : item.id;
    const original = this.originalSizes.get(key);
    return ObjectHelper.isDefined(original) && item.cols === original.cols && item.rows === original.rows;
  }

  canRevertToOriginalSize(item: PaymentFormTemplateItem): boolean {
    const key = item.type === PaymentFormControlType.LOGO ? PaymentFormControlType.LOGO : item.id;
    const original = this.originalSizes.get(key);
    if (!original) return false;
    if (item.x + original.cols > this.viewService.maxCols) return false;
    return !this.layout.some(other => {
      if (other.id === item.id) return false;
      const xOverlap = other.x < item.x + original.cols && other.x + other.cols > item.x;
      const yOverlapWithCurrentRows = other.y < item.y + item.rows && other.y + other.rows > item.y;
      return xOverlap && yOverlapWithCurrentRows;
    });
  }

  remove(item: PaymentFormTemplateItem) {
    this.layout = this.layout.filter(i => i.id !== item.id);
    this.imageSizes.delete(item.id);
    this.aspectRatios.delete(item.id);
    this.originalSizes.delete(item.id);
    this.emitTemplate();
  }

  trackById(index: number, item: PaymentFormTemplateItem) {
    return item.id;
  }

  ngAfterViewChecked(): void {
    if (!this.addedItemId) {
      return;
    }

    const addedItemId = this.addedItemId;
    this.addedItemId = null;
    this.zone.runOutsideAngular(() => this.viewService.scrollToElement(addedItemId));
  }

  get companyLogoUrl(): SafeResourceUrl {
    return this.companyLogo && this.companyLogoContentType
      ? this.sanitizer.bypassSecurityTrustResourceUrl(`data:${this.companyLogoContentType};base64,${this.companyLogo}`)
      : null;
  }

  private addItem(defaults: Partial<PaymentFormTemplateItem>) {
    const type = defaults.type ?? PaymentFormControlType.INPUT;
    const item: PaymentFormTemplateItem = this.viewService.withGridsterItemOptions({
      id: defaults.id ?? PaymentFormTemplateItem.generateId(type),
      type,
      requirement: defaults.requirement ?? false,
      label: defaults.label,
      value: defaults.value,
      imageContentType: defaults.imageContentType,
      originalCols: defaults.originalCols,
      originalRows: defaults.originalRows,
      options: defaults.options ? [...defaults.options] : [],
      x: 0,
      y: this.viewService.computeNextY(this.layout),
      cols: defaults.cols ?? 7,
      rows: defaults.rows ?? 1
    });
    this.layout = [...this.layout, item];
    this.addedItemId = item.id;
    this.emitTemplate();
    return item;
  }

  private populateImageAspectRatios(items: PaymentFormTemplateItem[]): void {
    items
      .filter(i => i.type === PaymentFormControlType.IMAGE && i.value && i.imageContentType)
      .forEach(i => {
        if (i.originalCols && i.originalRows) {
          this.originalSizes.set(i.id, {cols: i.originalCols, rows: i.originalRows});
        }
        this.viewService.getImageWidthAndHeight(`data:${i.imageContentType};base64,${i.value}`)
          .then(dimensions => {
            if (dimensions) {
              const ratio = dimensions.width / dimensions.height;
              this.aspectRatios.set(i.id, ratio);
              if (!i.originalCols || !i.originalRows) {
                this.originalSizes.set(i.id, this.viewService.convertWidthAndHeightToColsAndRows(dimensions.width, ratio));
              }
            }
          });
      });
  }

  private emitTemplate() {
    const value = JSON.stringify(this.layout.map(item => PaymentFormTemplateItem.toJSON(item)));
    this.templateChange.emit(value);
  }

  private getLogoWidthAndHeight(): Promise<{ width: number; height: number }> {
    if (!this.companyLogo || !this.companyLogoContentType) return Promise.resolve(null);
    return this.viewService.getImageWidthAndHeight(`data:${this.companyLogoContentType};base64,${this.companyLogo}`);
  }
}
