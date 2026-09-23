import {AutoScrollingFormPageComponent} from './auto-scrolling-form-page.component';
import {Observable} from 'rxjs';
import { ElementRef, Directive } from '@angular/core';
import {FormPageStateService} from "../utils/form-page-state.service";
import {FileService} from "../utils/file.service";
import {ErrorService} from "../utils/errorhandler/error.service";

@Directive()
export abstract class FilesPageComponent extends AutoScrollingFormPageComponent {


  constructor(public formPageStateService: FormPageStateService, protected elementRef: ElementRef, protected fileService: FileService, public errorService: ErrorService) {
    super(formPageStateService, elementRef, errorService);
  }


  openFileBrowser(event: any, fileInputId) {
    event.preventDefault();
    document.getElementById(fileInputId).click();
  }

  handleFileInput(files: FileList, references: any[]) {
    for (let indx = 0; indx < files.length; indx++) {
      const reader = new FileReader();
      reader.onload = result => {
        references.push({name: files[indx].name, value: btoa(reader.result.toString())});
      };
      reader.readAsBinaryString(files[indx]);
    }
  }


  removeReference(reference, references: any[]) {
    references.splice(references.indexOf(reference), 1);
  }

  downloadFile(referenceObservable: Observable<any>) {
    this.subscriptions.add(
      referenceObservable.subscribe(data => {
        this.fileService.guessTypeAndDownloadFile(data.name, data.value);
      })
    );
  }
}
