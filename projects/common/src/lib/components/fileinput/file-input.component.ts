import {Observable, of as observableOf} from 'rxjs';
import {Component, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ComponentWithSubscriptions} from '../component-with-subscriptions';
import {FileService} from "../../utils/file.service";
import {isDefined} from "../../helpers/object.helper";

@Component({
  standalone: false,
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputComponent),
            multi: true
        }
    ]
})

export class FileInputComponent extends ComponentWithSubscriptions implements ControlValueAccessor {
    @Output() download: EventEmitter<any> = new EventEmitter();
    @ViewChild('documentsLoader', {static: true}) documentsLoader;
    @Input() documents = [];
    @Input() disabled = false;

    tooLargeFiles = [];
    invalidExtensionFiles = [];
    @Input() maxFileSize = 20000; //kilobytes

    constructor(private fileService: FileService) {
        super();
    }

    private _extensions: string[] = [];

    @Input()
    set extensions(extensions: string[]) {
        this._extensions = extensions;
    }

    get extension(): string {
        if (this.acceptsAnyExtension) {
            return '*';
        } else {
            return this._extensions.join(', ');
        }
    }

    get acceptsAnyExtension(): boolean {
        return !isDefined(this._extensions) || this._extensions.length === 0;
    }

    get value(): { name: string, value: string, includeOnSend: boolean }[] {
        return this.documents;
    }

    hasAcceptableExtension(fileName: string): boolean {
        if (this.acceptsAnyExtension) {
            return true;
        }
        const fileExtension = fileName.split('.').pop();
        if (isDefined(fileExtension) && fileExtension.length > 0) {
            return this._extensions
                .map(extension => extension.toLowerCase())
                .indexOf('.' + fileExtension.toLowerCase()) >= 0;
        }
        return false;
    }

    @Input() downloadFunction = function (documentId) {
        return observableOf({});
    };

    onChange: (value: any) => void = (value) => {
    }

    openFileBrowser(event: any, fileInputId) {
        event.preventDefault();
        this.clearWarnings();
        document.getElementById(fileInputId).click();
    }

    handleFileInput(files: FileList) {
        for (let indx = 0; indx < files.length; indx++) {
            const reader = new FileReader();
            const name = files[indx].name;
            const size = files[indx].size;
            reader.onload = result => {
                if (size > this.maxFileSize * 1000) {
                    this.tooLargeFiles.push({name: name});
                } else if (!this.hasAcceptableExtension(name)) {
                    this.invalidExtensionFiles.push({name: name});
                } else {
                    this.documents.push({name: name, value: btoa(reader.result.toString()), includeOnSend: false});
                    this.onChange(this.documents);
                }
            };
            reader.readAsBinaryString(files[indx]);
        }
        this.documentsLoader.nativeElement.value = '';
    }

    removeFile(reference) {
        this.documents.splice(this.documents.indexOf(reference), 1);
        this.onChange(this.documents);
    }

    getFile(document) {
        return document.value ? this.downloadFile(observableOf(document)) : this.downloadFile(this.downloadFunction(document.id));
    }

    writeValue(obj: any): void {
        this.documents = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    downloadFile(referenceObservable: Observable<any>) {
        this.subscriptions.add(
            referenceObservable.subscribe(data => {
                this.fileService.guessTypeAndDownloadFile(data.name, data.value);
            })
        );
    }

    clearWarnings(): void {
        this.tooLargeFiles = [];
        this.invalidExtensionFiles = [];
    }
}
