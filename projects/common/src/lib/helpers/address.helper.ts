import {isDefined} from "./object.helper";
import {USStateEnum, USStateEnumValue} from "../enums/utils/us-state.enum";
import {CountryISO, CountryISOEnum} from "../enums/utils/country-iso.enum";
import {CAStateEnum, CAStateEnumValue} from "../enums/utils/ca-state.enum";

export function guessCountryByState(state: string) {
  if (isDefined(findState(state, USStateEnum, USStateEnumValue))) {
    return CountryISOEnum.US;
  } else if (isDefined(findState(state, CAStateEnum, CAStateEnumValue))) {
    return CountryISOEnum.CA;
  }
  return null;
}

function findState(state: string, stateEnum, stateEnumValue): string {
  if (Object.keys(stateEnum).find(st => st == state)) {
    return state;
  } else {
    let stateEntry = Array.from(stateEnumValue.entries()).find(stateEntry => stateEntry[1] == state);
    if (isDefined(stateEntry)) {
      return stateEntry[0];
    } else {
      return null;
    }
  }
}

function normalizeCountryValue(v: string): string {
  return v?.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function resolveCountry(value: string, countries: CountryISO[]): CountryISO | null {
  const normalized = normalizeCountryValue(value);

  const country = countries.find(c =>
    normalizeCountryValue(c.code) === normalized ||
    normalizeCountryValue(c.code3) === normalized ||
    normalizeCountryValue(c.name) === normalized
  );

  return country ?? null;
}

