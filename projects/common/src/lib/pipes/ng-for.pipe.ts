import {Pipe, PipeTransform} from '@angular/core';
import { isDefined } from '../helpers/object.helper';

@Pipe({
  standalone: false,name: 'arrayStartEnd'})
export class CreateArrayFromStartAndEndPipe implements PipeTransform {
  transform(size, arg1: string, arg2: string): any {
    const start = isDefined(arg1) ? parseInt(arg1, 10) : 0;
    const end = isDefined(arg2) ? parseInt(arg2, 10) : 0;
    const res = [];
    for (let i = start; i <= end; i++) {
      res.push(i);
    }
    return res;
  }
}
