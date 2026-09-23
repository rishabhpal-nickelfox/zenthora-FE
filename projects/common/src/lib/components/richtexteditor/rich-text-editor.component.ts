import {ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import Quill from 'quill';

@Component({
  standalone: false,
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextEditorComponent),
    multi: true
  }]
})
export class RichTextEditorComponent implements ControlValueAccessor, OnDestroy, OnInit {
  value: string | null = null;
  isDisabled = false;
  editor: Quill;
  selectedAlignment: 'left' | 'center' | 'right' = 'left';
  @Input() fontSizeMode: 'class' | 'style' = 'class';
  @Input() defaultFontSize = 14;
  @Input() defaultColor = '#000000';
  @Input() allowedFontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
  @Input() placeholders: Map<string, string> = new Map();
  @Input() options: {
    selectFontSize?: boolean,
    selectFontColor?: boolean,
    selectBackgroundColor?: boolean,
    selectFontStyle?: boolean,
    selectListStyle?: boolean,
    selectAlignment?: boolean
  } = {
    selectFontSize: true,
    selectFontColor: true,
    selectBackgroundColor: true,
    selectFontStyle: true,
    selectListStyle: true,
    selectAlignment: false
  }
  selectedFontSize: { label: string, value: string } = {label: '12', value: '12px'};
  selectedColor;
  selectedBackgroundColor = '#ffffff';
  fontSizes = [];

  modules = {
    toolbar: false
  };

  onChange = (_: any) => {
  };
  onTouched = () => {
  };


  constructor(private ch: ChangeDetectorRef) {
    Quill.register(Quill.import('attributors/class/size') as any, true);
  }

  ngOnInit(): void {
    this.configureFontSizeAttributor();
    this.fontSizes = this.allowedFontSizes.map(size => {
      const value = `${size}px`;
      return {label: size, value};
    });
    this.selectedColor = this.defaultColor;
    this.selectedFontSize = this.fontSizes.find(f => f.label == this.defaultFontSize);
  }

  ngOnDestroy(): void {
    if (this.fontSizeMode === 'style') {
      Quill.register(Quill.import('attributors/class/size') as any, true);
    }
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  onValueChange(newValue) {
    this.value = newValue;
    this.onChange(newValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onEditorCreated(quill: Quill) {
    this.editor = quill;
    this.editor.on('selection-change', (range, oldRange, source) => {
      if (range) {
        const formats = this.editor.getFormat(range.index);
        this.syncControlsWithFormats(formats);
      }
    });

    this.editor.on('text-change', (delta, oldDelta, source) => {
      const text = this.editor.getText();
      if (text.trim() === '') {
        if (this.options.selectFontSize) {
          this.configureFontSizeAttributor();
          this.editor.format('size', this.selectedFontSize?.value || '12px', 'user');
        }
        if (this.options.selectFontColor) {
          this.editor.format('color', this.selectedColor || '#000000', 'user');
        }
        if (this.options.selectBackgroundColor) {
          this.editor.format('background', this.selectedBackgroundColor || '#ffffff', 'user');
        }
      }
    });

    setTimeout(() => {
      const length = this.editor.getLength();
      this.editor.setSelection(length - 1, 0, 'user');
      this.ch.detectChanges();
    });

  }


  applyFontSize(size: { label: string, value: string }) {
    if (!this.editor) return;

    this.configureFontSizeAttributor();
    const range = this.editor.getSelection();
    if (!range) return;

    const formats = this.editor.getFormat(range);

    if (range.length > 0) {
      this.editor.formatText(range.index, range.length, {
        ...formats,
        size: size.value
      }, 'user');
    } else {
      Object.entries(formats).forEach(([format, value]) => {
        this.editor.format(format, value, 'user');
      });
      this.editor.format('size', size.value, 'user');
    }

    this.selectedFontSize = size;
  }

  applyFontColor(color: string) {
    const range = this.editor.getSelection();
    if (range?.length > 0) {
      this.editor.formatText(range.index, range.length, 'color', color, 'user');
    } else {
      this.editor.format('color', color, 'user');
    }

    this.selectedColor = color;
  }

  format(action: string) {
    if (!this.editor) return;

    const range = this.editor.getSelection();
    if (!range) return;

    const formats = this.editor.getFormat(range);

    if (range.length > 0) {
      const newValue = !(formats[action] === true);

      this.editor.formatText(range.index, range.length, {
        ...formats,
        [action]: newValue
      }, 'user');
    } else {
      const currentValue = formats[action] === true;
      this.editor.format(action, !currentValue, 'user');
      const currentSize = formats.size || this.selectedFontSize?.value || '12px';
      this.configureFontSizeAttributor();
      this.editor.format('size', currentSize, 'user');
    }
  }

  applyBackgroundColor(color: string) {
    if (!this.editor) return;

    const range = this.editor.getSelection();

    if (range?.length > 0) {
      this.editor.formatText(range.index, range.length, 'background', color, 'user');
    } else {
      this.editor.format('background', color, 'user');
    }

    this.selectedBackgroundColor = color;
  }

  removeFormat() {
    if (!this.editor) return;

    const range = this.editor.getSelection();
    if (!range) return;

    const index = range.length === 0 ? 0 : range.index;
    const length = range.length === 0 ? this.editor.getLength() : range.length;

    this.editor.removeFormat(index, length);

    setTimeout(() => {
      this.onChange(this.editor.root.innerHTML);
      this.ch.detectChanges();
    });

    this.selectedFontSize = this.fontSizes.find(f => f.label == this.defaultFontSize);
    this.selectedColor = this.defaultColor;
    this.selectedBackgroundColor = '#ffffff';
    this.selectedAlignment = 'left';
  }


  syncControlsWithFormats(formats: any) {
    this.selectedFontSize = this.fontSizes.find(f => f.value == formats.size) || this.fontSizes.find(f => f.label == this.defaultFontSize);
    this.selectedColor = formats.color || this.defaultColor;
    this.selectedBackgroundColor = formats.background || '#ffffff';
    this.selectedAlignment = formats.align || 'left';
    this.ch.detectChanges();
  }

  toggleList(listType: 'bullet' | 'ordered') {
    if (!this.editor) return;

    const range = this.editor.getSelection();
    if (!range) return;

    const currentFormats = this.editor.getFormat(range);

    const isSame = currentFormats.list === listType;

    this.editor.format('list', isSame ? false : listType, 'user');
  }

  applyAlignment(alignment: 'left' | 'center' | 'right') {
    if (!this.editor) return;

    const range = this.editor.getSelection();
    if (!range) return;

    const quillAlignment = alignment === 'left' ? false : alignment;
    this.editor.format('align', quillAlignment, 'user');
    this.selectedAlignment = alignment;
  }

  insertPlaceholder(placeholder: string) {
    if (!this.editor) return;
    const range = this.editor.getSelection(true);
    if (range) {
      this.editor.insertText(range.index, placeholder, 'user');
      this.editor.setSelection(range.index + placeholder.length, 0, 'user');
    }
  }

  isAlignmentSelected(alignment: 'left' | 'center' | 'right') {
    return this.selectedAlignment === alignment;
  }

  private configureFontSizeAttributor(): void {
    const Size = Quill.import(`attributors/${this.fontSizeMode}/size`) as { whitelist: string[] };
    this.allowedFontSizes.forEach(size => {
      const value = `${size}px`;
      if (!Size.whitelist.includes(value)) {
        Size.whitelist.push(value);
      }
    });
    Quill.register(Size as any, true);
  }


}
