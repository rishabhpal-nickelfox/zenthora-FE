import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable({providedIn: 'root'})
export class ExtendedDatePickerAdapter implements NgbDateAdapter<NgbDateStruct> {
  fromModel(value: NgbDateStruct): NgbDateStruct {
    return undefined;
  }

  toModel(date: NgbDateStruct): NgbDateStruct {
    return undefined;
  }

}

