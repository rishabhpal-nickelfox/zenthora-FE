import {formatDate, SDFT} from "../../../../../common/src/lib/helpers/date.helper";
import {
  MailingMethodEnum
} from "../../../../../common/src/lib/enums/companymanagement/companysettings/mailing-method.enum";
import {
  WebhookAuthTypeEnum
} from "../../../../../common/src/lib/enums/companymanagement/platform/webhook-auth-type.enum";
import {WebhookEventEnum} from "../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {EnumHelper} from "../../../../../common/src/lib/helpers/enum.helper";
import {
  VaultPaymentRequestTypeEnum
} from "../../../../../common/src/lib/enums/companymanagement/platform/vault-payment-request-type-enum";
import {InvoiceTemplateModel, ReceiptTemplateModel} from "@eps/common";
import {HmacSha256, OAuth10, WebhookSettings} from "../companymanage/entity.model";
import {isDefined} from "../../../../../common/src/lib/helpers/object.helper";

export class PlatformModel {
  id: number;
  name: string;
  trusted = false;
  epsCheckout = false;
  sendgridSettingsId: number;
  brandingId: number;
  emailSale = false;
  emailReceipt = false;
  lastUse: string;
  companiesCount: number;
  disabled = false;
  refreshToken: string;
  vaultProductId: string;
  vaultPaymentRequestTypesOnCheckoutPage: VaultPaymentRequestTypeEnum;
  customerPortalFeature: Feature = new Feature();
  emailPaymentsFeature: Feature = new Feature();
  paymentFormsFeature: Feature = new Feature();
  surchargesFeature: Feature = new Feature();
  webhookAuthType: WebhookAuthTypeEnum;
  webhookBypassDnsCache: boolean;
  webhookEvents: WebhookEventEnum[] = [];
  webhookAttemptsNumber: number;
  webhookSettings: WebhookSettings = null;
  customerRegistrationOnCheckoutPageEnabled = false;
  emailPaymentTemplate: InvoiceTemplateModel;
  receiptTemplate: ReceiptTemplateModel;
  customFieldsEnabled = false;
  advancedFieldsEnabled = false;

  static toJSON(platform: PlatformModel) {
    return {
      id: platform.id,
      name: platform.name,
      trusted: platform.trusted,
      epsCheckout: platform.epsCheckout,
      sendgridSettingsId: platform.sendgridSettingsId,
      brandingId: platform.brandingId,
      emailSale: platform.emailSale,
      emailReceipt: platform.emailReceipt,
      lastUse: platform.lastUse,
      companiesCount: platform.companiesCount,
      vaultProductId: platform.vaultProductId,
      vaultPaymentRequestTypesOnCheckoutPage: platform.vaultPaymentRequestTypesOnCheckoutPage,
      customerPortalFeature: platform.customerPortalFeature,
      emailPaymentsFeature: platform.emailPaymentsFeature,
      paymentFormsFeature: platform.paymentFormsFeature,
      surchargesFeature: platform.surchargesFeature,
      webhookAuthType: platform.webhookAuthType,
      webhookBypassDnsCache: platform.webhookBypassDnsCache,
      webhookEvents: platform.webhookAuthType ? EnumHelper.sort(WebhookEventEnum, platform.webhookEvents) : null,
      webhookAttemptsNumber: platform.webhookAttemptsNumber,
      // The platform edit request expects the auth settings flat (oAuth10Settings / hmacSha256Settings), not wrapped in webhookSettings
      oAuth10Settings: PlatformModel.usesPlatformWebhookSettings(platform) && isDefined(platform.webhookSettings?.oAuth10Settings) ? OAuth10.toJSON(platform.webhookSettings.oAuth10Settings) : null,
      hmacSha256Settings: PlatformModel.usesPlatformWebhookSettings(platform) && isDefined(platform.webhookSettings?.hmacSha256Settings) ? HmacSha256.toJSON(platform.webhookSettings.hmacSha256Settings) : null,
      customerRegistrationOnCheckoutPageEnabled: platform.customerRegistrationOnCheckoutPageEnabled,
      emailPaymentTemplate: platform.emailPaymentTemplate ? InvoiceTemplateModel.toString(platform.emailPaymentTemplate) : null,
      receiptTemplate: platform.receiptTemplate ? ReceiptTemplateModel.toJSON(platform.receiptTemplate) : null,
      customFieldsEnabled: PlatformModel.isEPSCheckoutOrCustomerPortal(platform) ? platform.customFieldsEnabled: null,
      advancedFieldsEnabled:  PlatformModel.isEPSCheckoutOrCustomerPortal(platform) ? platform.advancedFieldsEnabled: null
    };
  }

  static isEPSCheckoutOrCustomerPortal(platform: PlatformModel ){
    return platform.epsCheckout || platform.customerPortalFeature?.enabled;
  }

  static usesPlatformWebhookSettings(platform: PlatformModel): boolean {
    return platform.trusted && isDefined(platform.webhookAuthType);
  }

  static fromJSON(json: any): PlatformModel {
    const platform = Object.assign(new PlatformModel(), json);

    platform.id = json.id ?? null;
    platform.name = json.name ?? null;
    platform.trusted = json.trusted ?? false;
    platform.epsCheckout = json.epsCheckout ?? false;
    platform.sendgridSettingsId = json.sendgridSettingsId ?? null;
    platform.brandingId = json.brandingId ?? null;
    platform.emailSale = json.emailSale ?? false;
    platform.emailReceipt = json.emailReceipt ?? false;
    platform.lastUse = json.lastUse ? formatDate(json.lastUse, SDFT) : null;
    platform.activeCompaniesCount = json.activeCompaniesCount ?? 0;
    platform.companiesCount = json.companiesCount ?? 0;
    platform.disabled = json.disabled ?? false;
    platform.refreshToken = json.refreshToken ?? null;
    platform.vaultProductId = json.vaultProductId ?? null;
    platform.vaultPaymentRequestTypesOnCheckoutPage = json.vaultPaymentRequestTypesOnCheckoutPage ?? null;
    platform.customerPortalFeature = {
      enabled: json.customerPortalFeature?.enabled ?? false,
      vaultFeatureName: json.customerPortalFeature?.vaultFeatureName ?? null
    };

    platform.emailPaymentsFeature = {
      enabled: json.emailPaymentsFeature?.enabled ?? false,
      vaultFeatureName: json.emailPaymentsFeature?.vaultFeatureName ?? null
    };

    platform.paymentFormsFeature = {
      enabled: json.paymentFormsFeature?.enabled ?? false,
      vaultFeatureName: json.paymentFormsFeature?.vaultFeatureName ?? null
    };

    platform.surchargesFeature = {
      enabled: json.surchargesFeature?.enabled ?? false,
      vaultFeatureName: json.surchargesFeature?.vaultFeatureName ?? null
    };

    platform.webhookAuthType = json.webhookAuthType ?? null;
    platform.webhookBypassDnsCache = json.webhookBypassDnsCache ?? null;
    platform.webhookEvents = json.webhookEvents ?? [];
    platform.webhookAttemptsNumber = json.webhookAttemptsNumber ?? null;
    platform.webhookSettings = isDefined(json.webhookSettings) ? WebhookSettings.fromJSON(json.webhookSettings) : null;
    platform.customerRegistrationOnCheckoutPageEnabled = json.customerRegistrationOnCheckoutPageEnabled ?? null;
    return platform;
  }

}


export class PlatformTemplateSettings {
  customFieldsEnabled: boolean;
  advancedFieldsEnabled: boolean;
  emailPaymentTemplate: InvoiceTemplateModel;
  receiptTemplate: ReceiptTemplateModel;
  defaultEmailPaymentTemplate: InvoiceTemplateModel;
  defaultReceiptTemplate: ReceiptTemplateModel;

  static fromJSON(json): PlatformTemplateSettings {
    const settings = new PlatformTemplateSettings();
    settings.customFieldsEnabled = json.customFieldsEnabled ?? false;
    settings.advancedFieldsEnabled = json.advancedFieldsEnabled ?? false;
    settings.emailPaymentTemplate = InvoiceTemplateModel.fromJSON(json.emailPaymentTemplate ?? json.defaultEmailPaymentTemplate, json.defaultEmailPaymentTemplate);
    settings.receiptTemplate = ReceiptTemplateModel.fromJSON(json.receiptTemplate ?? json.defaultReceiptTemplate);
    settings.defaultEmailPaymentTemplate = JSON.parse(json.defaultEmailPaymentTemplate);
    settings.defaultReceiptTemplate = ReceiptTemplateModel.fromJSON(json.defaultReceiptTemplate);
    return settings;
  }

}

export class Feature {
  enabled = false;
  vaultFeatureName: string = null;
}
