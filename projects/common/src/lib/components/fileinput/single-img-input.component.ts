import {Component, forwardRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ComponentWithSubscriptions} from '../component-with-subscriptions';

@Component({
  standalone: false,
  selector: 'app-single-img-input',
  templateUrl: './single-img-input.component.html',
  styleUrls: ['./single-img-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleImgInputComponent),
      multi: true
    }
  ]
})

export class SingleImgInputComponent extends ComponentWithSubscriptions implements ControlValueAccessor {
  @ViewChild('fileInput', { static: true }) fileInput;
  @ViewChild('filePreviewImg', { static: false }) filePreviewImg;

  @Input() maxWidth = '185px';
  @Input() maxHeight = '185px';

  @Input() maxFileSize = 128; //kilobytes
  @Input() disabled = false;

  file: { value: string, type: string } = null;
  fileIsTooLarge = false;

  constructor() {
    super();
  }


  onChange: (value: any) => void = (value) => {
  };

  handleFileInput(file: File) {
    const reader = new FileReader();
    const type = file.type;
    const size = file.size;
    reader.onload = result => {
      if (size <= this.maxFileSize*1000) {
        this.file = {value: btoa(reader.result.toString()), type: type};
        this.fileIsTooLarge = false;
        this.onChange(this.value);
      } else {
        this.fileIsTooLarge = true;
      }
    };
    reader.readAsBinaryString(file);
    this.fileInput.nativeElement.value = '';
  }

  get filePreview() {
    return this.file.value ? 'data:' + this.file.type + ';base64,' + this.file.value : null;
  }

  writeValue(obj: any): void {
    this.file = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get value() {
    return this.file;
  }

  removeFile() {
    this.file = null;
    this.fileIsTooLarge = false;
    this.onChange(this.value);
  }
}
