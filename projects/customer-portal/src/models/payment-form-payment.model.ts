import {USStateEnum} from "../../../common/src/lib/enums/utils/us-state.enum";
import {CAStateEnum} from "../../../common/src/lib/enums/utils/ca-state.enum";
import {PaymentFormControlType} from "../../../common/src/lib/enums/payment-form-control-type.enum";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CountryISOEnum} from "../../../common/src/lib/enums/utils/country-iso.enum";

export interface PaymentFormDataItem {
  id: string;
  type: PaymentFormControlType;
  label: string;
  value: any;
}

export interface PaymentFormResponse {
  template: string;
  currency: string;
  companyInfo: PaymentFormCompanyInfo;
}

export interface PaymentFormCompanyInfo {
  legalName: string;
  displayName: string;
  logo?: string;
  logoContentType?: string
  allowedPaymentMethods: PaymentMethodTypeEnum[];
  globalPaymentsEnabled: boolean;
  creditCardAuthorizationMessage: string;
  creditCardSurchargesAuthorizationMessage: string;
  surchargePercent: number;
  surchargeProhibitedStates: (USStateEnum | CAStateEnum)[];
  country?: CountryISOEnum;
}
