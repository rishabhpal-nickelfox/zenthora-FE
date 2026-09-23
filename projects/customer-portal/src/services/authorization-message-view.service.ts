import {Injectable} from "@angular/core";
import {PaymentMethodTypeEnum} from "../../../common/src/lib/enums/sale/payment-method-type.enum";
import {CreditCardModel} from "../../../common/src/lib/models/sale/credit-card.model";
import {ACHModel} from "../../../common/src/lib/models/sale/ach.model";
import {SaleEmailAuthorizationMessagePlaceholderEnum, SaleEmailAuthorizationMessagePlaceholderEnumValue} from "../../../common/src/lib/enums/sale/sale-email-authorization-message-placeholder.enum";
import {SalePaymentModelConverter} from "../models/sale-payment-model-converter";
import {DecimalPipe} from "@angular/common";
import {getValueOrEmptyString} from "../../../common/src/lib/helpers/string.helper";
import {AuthorizationMessageModel} from "../models/sale-payment-view.model";
import {ObjectHelper} from "../../../common/src/lib/helpers/object.helper";

@Injectable()
export class AuthorizationMessageViewService {

  constructor(private decimalPipe: DecimalPipe) {

  }

  getAuthorizationMessage(paymentAmount: number, surchargeAmount: number, totalIncludingSurcharge: number, paymentMethodType: PaymentMethodTypeEnum, paymentMethod: CreditCardModel | ACHModel, creditCardAuthorizationMessage: string, achAuthorizationMessage: string, submitButtonName: string, termsOfServiceLinkId: string, privacyStatementLinkId: string): string {
    const template: string = paymentMethodType == PaymentMethodTypeEnum.CREDIT_CARD ? creditCardAuthorizationMessage || "" : paymentMethodType == PaymentMethodTypeEnum.ACH ? achAuthorizationMessage || "" : "";

    return this.processAuthorizationMessageTemplate(template, SalePaymentModelConverter.toAuthorizationMessageModel(this.decimalPipe.transform(paymentAmount, '1.2-2'),
      ObjectHelper.isDefined(surchargeAmount) ? this.decimalPipe.transform(surchargeAmount, '1.2-2') : null,
      ObjectHelper.isDefined(totalIncludingSurcharge) ? this.decimalPipe.transform(totalIncludingSurcharge, '1.2-2') : null,
      paymentMethodType, paymentMethod, submitButtonName, termsOfServiceLinkId, privacyStatementLinkId));
  }

  private processAuthorizationMessageTemplate(template: string, authorizationMessageModel: AuthorizationMessageModel): string {
    let templateStr = template;
    for (let placeholderKey of Object.keys(SaleEmailAuthorizationMessagePlaceholderEnum)) {
      templateStr = templateStr.replace(new RegExp(SaleEmailAuthorizationMessagePlaceholderEnumValue.get(placeholderKey), 'g'), getValueOrEmptyString(authorizationMessageModel[placeholderKey]));
    }
    return templateStr;
  }


}
