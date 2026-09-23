import * as equal from 'deep-equal';
import cloneDeep from 'lodash/cloneDeep';

export class ObjectHelper {

  static mapToObject(map: Map<string, any>): any {
    const obj: any = {};
    map.forEach((value, key) => {
      if (value instanceof Map) {
        obj[key] = ObjectHelper.mapToObject(value);
      } else if (Array.isArray(value)) {
        obj[key] = value.map((item) => (item instanceof Map ? ObjectHelper.mapToObject(item) : item));
      } else {
        obj[key] = value;
      }
    });
    return obj;
  }

  static isDefined(smth) {
    return !(smth === null || typeof smth === 'undefined');
  }

  static isNumber(smth) {
    return isDefined(smth) && smth !== '' && !isNaN(Number(smth));
  }

  static deepGet(obj, path) {
    if (isDefined(obj)) {
      const parts = path.split('.');
      if (parts.length == 1) {
        return obj[parts[0]];
      }
      return deepGet(obj[parts[0]], parts.slice(1).join('.'));
    }
    return '';
  }

  static isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static deepEqual(obj1, obj2) {
    return equal(obj1, obj2);
  }

  static cloneDeep(obj1): any {
    return cloneDeep(obj1)
  }

  static mergeProperties(target, source): Object {
    const t = target ?? {};

    for (const key in source) {
      if (!(key in t)) {
        t[key] = source[key];
      }
    }
    return t;
  }
}

export function isDefined(smth) {
  return !(smth === null || typeof smth === 'undefined');
}

export function isNumber(smth) {
  return isDefined(smth) && smth !== '' && !isNaN(Number(smth));
}

export function deepGet(obj, path) {
  if (isDefined(obj)) {
    const parts = path.split('.');
    if (parts.length == 1) {
      return obj[parts[0]];
    }
    return deepGet(obj[parts[0]], parts.slice(1).join('.'));
  }
  return '';
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function objectPropertiesAreEqual(obj1, obj2) {
  return JSON.stringify(obj1).toLowerCase() === JSON.stringify(obj2).toLowerCase();
}

export function deepEqual(obj1, obj2) {
  return equal(obj1, obj2);
}

export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
