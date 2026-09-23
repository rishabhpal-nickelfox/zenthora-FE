import {isEmptyString} from "./string.helper";
import {ObjectHelper} from "./object.helper";

export class ContactHelper {
  static formatPhone(input: string): string {
    if (isEmptyString(input)) return null;

    const raw = input.trim();
    const hasPlus = raw.startsWith("+");
    const digitsOnly = raw.replace(/\D/g, "");

    if (isEmptyString(digitsOnly)) return null;

    let countryCode: string;

    //International
    if (hasPlus && digitsOnly.length > 10) {
      countryCode = digitsOnly.slice(0, digitsOnly.length - 10);
    }

    // US or CA
    if (digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly[0] === "1")) {
      countryCode = "1";
    }

    if (ObjectHelper.isDefined(countryCode)) {
      const last10 = digitsOnly.slice(-10);
      const bracketsCode = last10.slice(0, 3);
      const firstPart = last10.slice(3, 6);
      const secondPart = last10.slice(6);
      return `+${countryCode}(${bracketsCode}) ${firstPart}-${secondPart}`;
    }

    return raw;
  }

}
