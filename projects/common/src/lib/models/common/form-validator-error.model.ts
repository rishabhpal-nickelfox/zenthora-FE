import {Moment} from 'moment';
import {CountryISOEnum} from "../../enums/utils/country-iso.enum";

export class FormValidatorErrorModel {
    label: string;

    constructor(label: string) {
        this.label = label;
    }
}

export class FormValidatorMaxLengthErrorModel extends FormValidatorErrorModel {
    maxlength: number;

    constructor(label: string, maxlength: number) {
        super(label);
        this.maxlength = maxlength;
    }
}

export class FormValidatorMinLengthErrorModel extends FormValidatorErrorModel {
    minlength: number;

    constructor(label: string, minlength: number) {
        super(label);
        this.minlength = minlength;
    }
}

export class FormValidatorMinItemsErrorModel extends FormValidatorErrorModel {
    minSize: number;

    constructor(label: string, minSize: number) {
        super(label);
        this.minSize = minSize;
    }
}


export class FormValidatorExactLengthErrorModel extends FormValidatorErrorModel {
  length: number;

  constructor(label: string, minlength: number) {
    super(label);
    this.length = minlength;
  }
}

export class ServerErrorModel {
    error: string;

    constructor(error: string) {
        this.error = error;
    }
}

export class FormValidatorMustBeTheSameErrorModel extends FormValidatorErrorModel {
    sameAsLabel: string;

    constructor(label: string, sameAsLabel: string) {
        super(label);
        this.sameAsLabel = sameAsLabel;
    }
}

export class FormValidatorMaxValueErrorModel extends FormValidatorErrorModel {
    maxvalue: number;

    constructor(label: string, maxvalue: number) {
        super(label);
        this.maxvalue = maxvalue;
    }
}


export class FormValidatorMaxAmountErrorModel extends FormValidatorErrorModel {
  maxamount: number;
  currency: string;

  constructor(label: string, maxamount: number, currency: string) {
    super(label);
    this.maxamount = maxamount;
    this.currency = currency;
  }
}

export class FormValidatorMinValueErrorModel extends FormValidatorErrorModel {
    minvalue: number;

    constructor(label: string, minvalue: number) {
        super(label);
        this.minvalue = minvalue;
    }
}

export class FormValidatorMinValueStrictErrorModel extends FormValidatorErrorModel {
  minvalue: number;

  constructor(label: string, minvalue: number) {
    super(label);
    this.minvalue = minvalue;
  }
}


export class FormValidatorMinAmountErrorModel extends FormValidatorErrorModel {
  minamount: number;
  currency: string;

  constructor(label: string, minamount: number, currency: string) {
    super(label);
    this.minamount = minamount;
    this.currency = currency;
  }
}


export class FormValidatorDateValueErrorModel extends FormValidatorErrorModel {
    date: Moment;

    constructor(label: string, date: Moment) {
        super(label);
        this.date = date;
    }
}

export class FormValidatorZipErrorModel extends FormValidatorErrorModel {
  country: CountryISOEnum;

  constructor(label: string, country: CountryISOEnum) {
    super(label);
    this.country = country;
  }
}
