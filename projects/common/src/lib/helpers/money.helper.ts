import {CurrencyEnumValue} from "../enums/sale/currency.enum";

export class MoneyHelper {

  static getCurrencyPrefix(code: string): string {
    return CurrencyEnumValue.get(code) ? CurrencyEnumValue.get(code) : code;
  }

  static readonly NUMBER_PATTERN = /^-?(?:0|[1-9]\d{0,2}(?:,\d{3})*|[1-9]\d*)(?:\.\d+)?$/;
  private static readonly MAX_FRACTION_DIGITS = 100; //SetNumberFormatDigitOptions mxfd range [0, 100]
  static formatAmount(
    amount: string | number,
    opts: {
      currency?: string;
      minimumFractionDigits?: number;
      maximumFractionDigits?: number;
      locale?: string;
    } = {}
  ): string {
    const {
      currency,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      locale = 'en-US',
    } = opts;

    let num: number | null = null;

    if (typeof amount === 'number') {
      if (!Number.isFinite(amount)) return String(amount);
      num = amount;
    } else if (typeof amount === 'string') {
      const s = amount.trim();
      if (s === '') return '';

      if (!MoneyHelper.NUMBER_PATTERN.test(s)) {
        return amount;
      }

      // Remove thousands separators and parse
      const parsed = Number(s.replace(/,/g, ''));
      if (!Number.isFinite(parsed)) return amount;
      num = parsed;
    } else {
      return String(amount ?? '');
    }

    // minus placement: -$1,234.50 (minus BEFORE the currency symbol)
    const isNegative = num < 0;
    const formatOptions: Intl.NumberFormatOptions = {
      useGrouping: true,
      minimumFractionDigits: minimumFractionDigits ?? 0,
      maximumFractionDigits: maximumFractionDigits ?? MoneyHelper.MAX_FRACTION_DIGITS
    }
    const absFormatted = new Intl.NumberFormat(locale, formatOptions).format(Math.abs(num));

    if (currency) {
      return isNegative ? `-${currency}${absFormatted}` : `${currency}${absFormatted}`;
    }
    return isNegative ? `-${absFormatted}` : absFormatted;
  }

}
