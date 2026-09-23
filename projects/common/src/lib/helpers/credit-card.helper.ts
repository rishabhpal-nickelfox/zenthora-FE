import {isDefined} from './object.helper';
import * as moment from 'moment';

export function luhnAlgorithmCheck(digits) {
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let cardNum = parseInt(digits[i], 10);

    if ((digits.length - i) % 2 === 0) {
      cardNum = cardNum * 2;

      if (cardNum > 9) {
        cardNum = cardNum - 9;
      }
    }

    sum += cardNum;
  }

  return sum % 10 === 0;
}

export function isCCExpired(exp): boolean {
  if (isDefined(exp)) {
    const m = moment(exp, 'MM/YY').endOf('month');
    return moment().endOf('month') > m;
  }
  return false;
}
