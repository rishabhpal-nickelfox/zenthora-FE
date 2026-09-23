import {Decimal} from 'decimal.js';
import {Mask} from './mask';

export class NumberHelper {


  static readonly MAX_INT = 2147483647;

  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

export function decimal(val: number): Decimal {
  return new Decimal(Mask.unmaskNumber(val || 0));
}


