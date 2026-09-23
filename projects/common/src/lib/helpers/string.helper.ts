import {vsprintf} from 'sprintf-js';
import {isDefined, ObjectHelper} from "./object.helper";

export function getMessage(template: string, parameters): string {
  return vsprintf(template, parameters);
}

export function getValueOrEmptyString(value) {
  return value ? value : '';
}

export function getValueOrNull(value) {
  return value ? value : null;
}

export function getPropertyOrEmptyString(rowData, propertyName) {
  return rowData ? rowData[propertyName] : '';
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function isEmptyString(str: string) {
  return !isDefined(str) || str.length === 0;
}

export function truncateString(str, n) {
  return (isDefined(str) && str.length > n) ? str.substr(0, n - 1) : str;
}

export function getArrayName(fullName: string): string {
  let arrayNameRegex = '[a-zA-Z0-9]+';
  const matches = fullName.match(arrayNameRegex);
  return isDefined(matches) ? matches[0] : fullName;
}

export function getArrayIndex(fullName: string): number {
  let arrayNameRegex = '\\[(?:\\d+)\\]';
  const matches = fullName.match(arrayNameRegex);
  return isDefined(matches) ? Number(matches[0].replace(/\D/g, '')) : null;
}

export function escapeRegExp(string: String) {
  return string.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function removeSpaces(string: String) {
  return string ? string.replace(/\s+/g, '') : null;
}

export function versionCompare(v1, v2) {
  if (v1 === v2) {
    return 0;
  }
  const v1parts = v1.split('.');
  const v2parts = v2.split('.');

  for (let i = 0; i < v1parts.length; i++) {
    if (v1parts[i] > v2parts[i]) {
      return 1;
    } else if (v1parts[i] < v2parts[i]) {
      return -1;
    }
  }
  return 0;
}

const PLACEHOLDER_REGEX = /\{\{([^}\s]+)\}\}|\{([^}\s]+)\}/g;

export function replacePlaceholders(
  original: string,
  values: Map<string, string>
): string | null {
  if (isEmptyString(original)) return null;

  return original.replace(
    PLACEHOLDER_REGEX,
    (fullMatch: string, groupFromDouble?: string, groupFromSingle?: string) => {
      const name = (groupFromDouble ?? groupFromSingle) as string;

      let found = false;
      let value: string;

      if (values.has(name)) {
        found = true;
        value = values.get(name);
      } else {
        const keyDouble = `{{${name}}}`;
        if (values.has(keyDouble)) {
          found = true;
          value = values.get(keyDouble);
        } else {
          const keySingle = `{${name}}`;
          if (values.has(keySingle)) {
            found = true;
            value = values.get(keySingle);
          }
        }
      }
      if (!found) {
        return fullMatch;
      }
      if (value == null) {
        return '';
      }
      return String(value);
    }
  );
}

export function normalize(value: string): string {
  return value.trim().toLowerCase();
}
