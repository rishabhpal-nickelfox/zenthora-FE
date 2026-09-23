import {Injectable} from '@angular/core';
import {GridsterItem} from 'angular-gridster2/lib/gridsterItem.interface';
import {PaymentFormControlType} from '../../../../../../../../common/src/lib/enums/payment-form-control-type.enum';
import {
  PaymentFormTemplateItem,
  PaymentFormTemplateLayout
} from '../../../../../../../../common/src/lib/models/paymentform/payment-form-template.model';
import {getScrollBehavior} from '../../../../../../../../common/src/lib/helpers/dom.helper';

export interface ImageReadResult {
  base64: string;
  contentType: string;
  dimensions: { width: number; height: number } | null;
  size: number;
}

@Injectable({providedIn: 'root'})
export class PaymentFormTemplateEditorViewService {
  readonly cellSize = PaymentFormTemplateLayout.cellHeight;
  readonly maxCols = 24;
  readonly minCols = 2;
  readonly maxImageBytes = 512 * 1024;

  withGridsterItemOptions(item: PaymentFormTemplateItem): PaymentFormTemplateItem {
    const next: PaymentFormTemplateItem = {
      ...item,
      rows: item.rows ?? 2,
      minItemRows: 1,
      maxItemRows: undefined
    };
    this.assignTextareaRows(next);
    return next;
  }

  enforceRows(item: GridsterItem): void {
    item.rows = item.rows ?? 2;
  }

  enforceAspectRatio(item: GridsterItem, ratio: number): void {
    if (!ratio) {
      this.enforceRows(item);
      return;
    }
    item.rows = this.colsToRows(item.cols, ratio);
  }

  colsToRows(cols: number, ratio: number): number {
    return Math.max(1, Math.round(cols * this.cellSize / ratio / this.cellSize));
  }

  convertWidthAndHeightToColsAndRows(width: number, ratio: number): { cols: number; rows: number } {
    const cols = Math.max(this.minCols, Math.min(Math.round(width / this.cellSize), this.maxCols));
    return {cols, rows: this.colsToRows(cols, ratio)};
  }

  assignTextareaRows(item: PaymentFormTemplateItem): void {
    if (item.type === PaymentFormControlType.TEXTAREA) {
      item.textareaRows = this.computeTextareaRows(item);
    }
  }

  private computeTextareaRows(item: PaymentFormTemplateItem): number {
    const totalHeight = (item.rows ?? 2) * PaymentFormTemplateLayout.cellHeight;
    const availableForLines = totalHeight
      - PaymentFormTemplateLayout.gridsterDivPaddingY * 2
      - PaymentFormTemplateLayout.labelHeight
      - PaymentFormTemplateLayout.textareaPaddingY * 2
      - PaymentFormTemplateLayout.textareaBorderY * 2;
    return Math.max(1, Math.floor(availableForLines / PaymentFormTemplateLayout.textareaLineHeight));
  }

  getImageWidthAndHeight(src: string): Promise<{ width: number; height: number }> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({width: img.naturalWidth, height: img.naturalHeight});
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  readImageFile(file: File): Promise<ImageReadResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const contentType = file.type;
        const dimensions = await this.getImageWidthAndHeight(`data:${contentType};base64,${base64}`);
        resolve({base64, contentType, dimensions, size: file.size});
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  validateImageFileSize(file: File, currentTotalBytes: number): string | null {
    if (file.size > this.maxImageBytes) {
      return `Sorry, this file is more than 512 KB`;
    }
    if (currentTotalBytes + file.size > this.maxImageBytes) {
      return `Sorry, total images size is more than 512 KB. Please remove an existing image to add a new one.`;
    }
    return null;
  }

  triggerFilePicker(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    input?.click();
  }

  computeNextY(items: PaymentFormTemplateItem[]): number {
    return items.length ? Math.max(...items.map(i => i.y + (i.rows ?? 1))) : 0;
  }

  getDefaultsByType(type: PaymentFormControlType): Partial<PaymentFormTemplateItem> {
    switch (type) {
      case PaymentFormControlType.TEXT:
        return {type, value: 'Text', cols: 7};
      case PaymentFormControlType.INPUT:
        return {type, label: 'Input', requirement: false, cols: 7, rows: 2};
      case PaymentFormControlType.DATE:
        return {type, label: 'Date', requirement: false, cols: 7, rows: 2};
      case PaymentFormControlType.SELECT:
        return {type, label: 'Select', requirement: false, options: ['Option'], cols: 7, rows: 2};
      case PaymentFormControlType.TEXTAREA:
        return {type, label: 'Textarea', requirement: false, cols: 7, rows: 3};
      default:
        return {type};
    }
  }

  parseTemplate(template: string): PaymentFormTemplateItem[] {
    return PaymentFormTemplateItem.parseTemplate(template).map(item => this.withGridsterItemOptions(item));
  }

  scrollToElement(itemId: string): void {
    const scrollContainer = document.documentElement || document.body;
    const gap = 50;
    const maxRetries = 10;
    let attempts = 0;

    const interval = setInterval(() => {
      const targetElement = document.getElementById(itemId);
      if (targetElement) {
        clearInterval(interval);

        const targetPosition = targetElement.getBoundingClientRect().top + scrollContainer.scrollTop - gap;
        scrollContainer.scrollTo({
          top: targetPosition,
          behavior: getScrollBehavior()
        });
      } else if (attempts >= maxRetries) {
        clearInterval(interval);
        console.debug(`Element not found ${itemId}`);
      }
      attempts++;
    }, 100);
  }
}
