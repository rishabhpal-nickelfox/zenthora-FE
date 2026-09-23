import {
  AddressModel,
  convertAddressToJSON,
  convertJSONToAddress
} from '../../../../../common/src/lib/models/common/address.model';
import {ReceiptPrintWidthEnum, FullTemplate, InvoiceTemplateModel, ReceiptTemplateModel} from "@eps/common";
import {SaleEmailAuthorizationMessagePlaceholderScopeEnum} from "../../../../../common/src/lib/enums/sale/sale-email-authorization-message-placeholder-scope.enum";
import {
  MailingMethodEnum
} from "../../../../../common/src/lib/enums/companymanagement/companysettings/mailing-method.enum";
import {PaymentMethodTypeEnum} from "../../../../../common/src/lib/enums/sale/payment-method-type.enum";
import {
  OAuth10SignatureMethodEnum
} from "../../../../../common/src/lib/enums/companymanagement/company/oauth-1.0-signature-method.enum";
import {
  WebhookAuthTypeEnum
} from "../../../../../common/src/lib/enums/companymanagement/platform/webhook-auth-type.enum";
import {Mask} from "../../../../../common/src/lib/helpers/mask";
import {isDefined, ObjectHelper} from '../../../../../common/src/lib/helpers/object.helper';
import {getValueOrNull, isEmptyString} from "../../../../../common/src/lib/helpers/string.helper";
import {WebhookEventEnum} from "../../../../../common/src/lib/enums/webhookerrors/webhook-event.enum";
import {EnumHelper} from "../../../../../common/src/lib/helpers/enum.helper";
import {ContactHelper} from "../../../../../common/src/lib/helpers/contact.helper";
import {formatDate, SDFT} from "../../../../../common/src/lib/helpers/date.helper";
import {DateTime} from 'luxon';
import {PrivateSmtpSecurityMode} from "../../../enums/companymanagement/private-smtp-security-mode.enum";

export class ContactInfoModel {
  email: string;
  phone: string;
  website: string;
  formattedPhone: string;
}

export function convertContactInfoToJSON(contactInfo: ContactInfoModel) {
  return {
    email: contactInfo.email,
    phone: contactInfo.phone,
    website: !isEmptyString(contactInfo.website) ? contactInfo.website : null
  };
}

export function convertJSONToContactInfo(json): ContactInfoModel {
  const contactInfo: ContactInfoModel = new ContactInfoModel();
  if (isDefined(json)) {
    contactInfo.email = json.email;
    contactInfo.phone = json.phone;
    contactInfo.website = json.website;
    contactInfo.formattedPhone = ContactHelper.formatPhone(contactInfo.phone);
  }
  return contactInfo;
}

export class PrivateSmtpModel {
  from: string;
  server: string;
  securityMode: PrivateSmtpSecurityMode;
  port: number;
  user: string;
  password: string;
}

export function convertPrivateSmtpToJSON(privateSmtp: PrivateSmtpModel) {
  return {
    from: privateSmtp.from,
    server: privateSmtp.server,
    securityMode: privateSmtp.securityMode,
    port: privateSmtp.port,
    user: privateSmtp.user,
    password: privateSmtp.password
  };
}

export function convertJSONToPrivateSmtp(json): PrivateSmtpModel {
  const privateSmtp: PrivateSmtpModel = new PrivateSmtpModel();
  if (isDefined(json)) {
    privateSmtp.from = json.from;
    privateSmtp.server = json.server;
    privateSmtp.securityMode = json.securityMode;
    privateSmtp.port = json.port;
    privateSmtp.user = json.user;
    privateSmtp.password = json.password;
  }
  return privateSmtp;
}

export class VaultModel {
  companyId: number;
  userId: number;
  authKey: string;
}

export function convertVaultToJSON(vault: VaultModel) {
  return {
    companyId: vault.companyId, userId: vault.userId, authKey: vault.authKey
  };
}

export function convertJSONToVault(json): VaultModel {
  const vault: VaultModel = new VaultModel();
  if (isDefined(json)) {
    vault.companyId = json.companyId;
    vault.userId = json.userId;
    vault.authKey = json.authKey;
  }
  return vault;
}

export class EntityModel {
  id: number;
  externalId: string;
  platformId: number;
  platformName: string;
  platformEpsCheckout: boolean;
  platformTrusted: boolean;
  platformWebhookAuthType: WebhookAuthTypeEnum;
  platformWebhookEvents: WebhookEventEnum[];
  platformCustomerRegistrationOnCheckoutPageEnabled: boolean;
  epsCheckout: boolean;
  legalName: string;
  displayName: string;
  disabled: boolean;
  logo: {
    value: string,
    type: string
  };
  favicon: {
    value: string,
    type: string
  };
  admins: { email: string }[] = [];
  activeUsers: string;
  activeTokens: string;
  globalPaymentsEnabled: boolean;
  customerRegistrationOnCheckoutPageEnabled: boolean;
  address: AddressModel = new AddressModel();
  vault: VaultModel = new VaultModel();
  contactInfo: ContactInfoModel = new ContactInfoModel();
  emailSale: boolean;
  emailReceipt: boolean;
  isEmailReceiptEditable: boolean;
  mailingMethod: MailingMethodEnum;
  privateSmtp: PrivateSmtpModel = new PrivateSmtpModel();
  emailPaymentTemplate: FullTemplate;
  receiptTemplate: ReceiptTemplateModel;
  receiptPrintWidth: string;
  invoicePartialPaymentsAllowed: boolean;
  salesOrderPartialPaymentsAllowed: boolean;
  depositPartialPaymentsAllowed: boolean;
  allowedPaymentMethods: PaymentMethodTypeEnum[] = [];
  ccAuthorizationMessageTemplate: string;
  achAuthorizationMessageTemplate: string;
  creditCardPaymentAmountLimit: any;
  tokenLimit: number;
  webhookSettings: WebhookSettings;
  suppressedWebhookEvents: WebhookEventEnum[];
  allowCustomersManageTheirPaymentMethodsCreatedByMerchant: boolean;
  maxUsersInCompany: number;
  maxCustomerUsersInCustomer: number;
  paymentFormsCompanyId: string;
  theme: Map<string, string>;
  features: VaultFeatures;

  static toJSON(entity: EntityModel, newAdminId: number) {
    const json = {
      platformId: entity.platformId,
      platformName: entity.platformName,
      legalName: entity.legalName,
      displayName: entity.displayName,
      logo: getValueOrNull(entity.logo?.value),
      favicon: getValueOrNull(entity.favicon?.value),
      globalPaymentsEnabled: entity.globalPaymentsEnabled,
      customerRegistrationOnCheckoutPageEnabled: entity.customerRegistrationOnCheckoutPageEnabled,
      address: convertAddressToJSON(entity.address),
      contactInfo: convertContactInfoToJSON(entity.contactInfo),
      emailReceipt: entity.emailReceipt,
      mailingMethod: entity.mailingMethod,
      emailPaymentTemplate: isDefined(entity.emailPaymentTemplate) ? JSON.stringify(entity.emailPaymentTemplate) : null,
      receiptTemplate: entity.receiptTemplate ? ReceiptTemplateModel.toJSON(entity.receiptTemplate) : null,
      receiptPrintWidth: entity.receiptTemplate?.width ?? entity.receiptPrintWidth,
      tokenLimit: entity.tokenLimit,
      userAdminId: isDefined(newAdminId) ? newAdminId : null,
      webhookSettings: isDefined(entity.webhookSettings) ? WebhookSettings.toJSON(entity.webhookSettings) : null,
      suppressedWebhookEvents: entity.suppressedWebhookEvents,
      maxUsersInCompany: entity.maxUsersInCompany,
      maxCustomerUsersInCustomer: entity.maxCustomerUsersInCustomer,
      paymentFormsCompanyId: entity.features?.paymentFormsFeatureEnabled === true ? entity.paymentFormsCompanyId : null
    };
    if (entity.mailingMethod == MailingMethodEnum.PRIVATE_SMTP) {
      json['privateSmtp'] = convertPrivateSmtpToJSON(entity.privateSmtp);
    }
    if (isDefined(entity.vault)) {
      json['vault'] = convertVaultToJSON(entity.vault);
    }
    return json;
  }

  static fromJSON(json): EntityModel {
    const entity: EntityModel = new EntityModel();
    entity.id = json.id;
    entity.externalId = json.externalId;
    entity.platformId = json.platformId;
    entity.platformName = json.platformName;
    entity.platformEpsCheckout = json.platformEpsCheckout;
    entity.platformTrusted = json.platformTrusted;
    entity.platformWebhookAuthType = json.platformWebhookAuthType;
    entity.platformCustomerRegistrationOnCheckoutPageEnabled = json.platformCustomerRegistrationOnCheckoutPageEnabled;
    entity.legalName = json.legalName;
    entity.displayName = json.displayName;
    entity.logo = json.logo;
    entity.favicon = json.favicon;
    entity.disabled = json.disabled;
    entity.admins = json.admins || [];
    entity.activeUsers = json.activeUsers;
    entity.activeTokens = json.activeTokens;
    entity.globalPaymentsEnabled = json.globalPaymentsEnabled;
    entity.customerRegistrationOnCheckoutPageEnabled = json.customerRegistrationOnCheckoutPageEnabled;
    entity.address = convertJSONToAddress(json.address);
    entity.vault = convertJSONToVault(json.vault);
    entity.contactInfo = convertJSONToContactInfo(json.contactInfo);
    entity.emailSale = json.emailSale;
    entity.emailReceipt = json.emailReceipt;
    entity.isEmailReceiptEditable = json.isEmailReceiptEditable;
    entity.mailingMethod = json.mailingMethod;
    entity.privateSmtp = convertJSONToPrivateSmtp(json.privateSmtp);
    entity.emailPaymentTemplate = json.emailPaymentTemplate ? JSON.parse(json.emailPaymentTemplate) as FullTemplate : null;
    entity.receiptTemplate = ReceiptTemplateModel.fromJSON(json.receiptTemplate);
    entity.receiptPrintWidth = json.receiptPrintWidth || ReceiptPrintWidthEnum.PX185;
    entity.tokenLimit = json.tokenLimit;
    entity.webhookSettings = isDefined(json.webhookSettings) ? WebhookSettings.fromJSON(json.webhookSettings) : null;
    entity.maxUsersInCompany = json.maxUsersInCompany;
    entity.maxCustomerUsersInCustomer = json.maxCustomerUsersInCustomer;
    entity.paymentFormsCompanyId = json.paymentFormsCompanyId;
    entity.platformWebhookEvents = json.platformWebhookEvents;
    entity.suppressedWebhookEvents = json.suppressedWebhookEvents;
    entity.features = isDefined(json.features) ? VaultFeatures.fromJSON(json.features) : null;
    return entity;
  }
}

export interface AuthorizationMessagePlaceholder {
  key: string;
  description: string;
  scope: SaleEmailAuthorizationMessagePlaceholderScopeEnum[]
}

export class WebhookSettings {
  oAuth10Settings: OAuth10;
  hmacSha256Settings: HmacSha256;

  static withOAuth10(oAuth10Settings: OAuth10): WebhookSettings {
    const settings = new WebhookSettings();
    settings.oAuth10Settings = oAuth10Settings || new OAuth10();
    settings.hmacSha256Settings = null;
    return settings;
  }

  static withHmacSha256(hmacSha256Settings: HmacSha256): WebhookSettings {
    const settings = new WebhookSettings();
    settings.oAuth10Settings = null;
    settings.hmacSha256Settings = hmacSha256Settings || new HmacSha256();
    return settings;
  }

  static fromJSON(json): WebhookSettings {
    const settings = new WebhookSettings();
    settings.oAuth10Settings = isDefined(json.oAuth10Settings) ? OAuth10.fromJSON(json.oAuth10Settings) : null;
    settings.hmacSha256Settings = isDefined(json.hmacSha256Settings) ? HmacSha256.fromJSON(json.hmacSha256Settings) : null;
    return settings;
  }


  static toJSON(settings: WebhookSettings) {
    return {
      oAuth10Settings: isDefined(settings.oAuth10Settings) ? OAuth10.toJSON(settings.oAuth10Settings) : null,
      hmacSha256Settings: isDefined(settings.hmacSha256Settings) ? HmacSha256.toJSON(settings.hmacSha256Settings) : null
    }
  }
}

export class OAuth10 {
  webhookUrl: string;
  signatureMethod: OAuth10SignatureMethodEnum;
  consumerKey: string;
  consumerSecret: string;
  accessToken: string;
  tokenSecret: string;
  realm: string;

  static fromJSON(json): OAuth10 {
    const settings = new OAuth10();
    settings.webhookUrl = json.webhookUrl;
    settings.signatureMethod = json.signatureMethod;
    settings.consumerKey = json.consumerKey;
    settings.consumerSecret = json.consumerSecret;
    settings.accessToken = json.accessToken;
    settings.tokenSecret = json.tokenSecret;
    settings.realm = json.realm;
    return settings;
  }

  static toJSON(settings: OAuth10) {
    return {
      webhookUrl: settings.webhookUrl,
      signatureMethod: settings.signatureMethod,
      consumerKey: settings.consumerKey,
      consumerSecret: settings.consumerSecret,
      accessToken: settings.accessToken,
      tokenSecret: settings.tokenSecret,
      realm: settings.realm
    }
  }
}

export class HmacSha256 {
  webhookUrl: string;
  secret: string;

  static fromJSON(json): HmacSha256 {
    const settings = new HmacSha256();
    settings.webhookUrl = json.webhookUrl;
    settings.secret = json.secret;
    return settings;
  }

  static toJSON(settings: HmacSha256) {
    return {
      webhookUrl: settings.webhookUrl,
      secret: settings.secret
    }
  }
}


export class GeneralSettings {
  legalName: string;
  displayName: string;
  logo: {
    value: string,
    type: string
  };
  address: AddressModel = new AddressModel();
  contactInfo: ContactInfoModel = new ContactInfoModel();

  static fromJSON(json): GeneralSettings {
    const settings: GeneralSettings = new GeneralSettings();
    settings.legalName = json.legalName;
    settings.displayName = json.displayName;
    settings.logo = json.logo;
    settings.address = convertJSONToAddress(json.address);
    settings.contactInfo.email = json.email;
    settings.contactInfo.phone = json.phone;
    settings.contactInfo.website = json.website;
    return settings;
  }

  static toJSON(settings: GeneralSettings) {
    const json = {
      phone: settings.contactInfo ? settings.contactInfo.phone : null,
      email: settings.contactInfo ? settings.contactInfo.email : null,
      website: settings.contactInfo ? settings.contactInfo.website : null,
      legalName: settings.legalName,
      displayName: settings.displayName,
      logo: getValueOrNull(settings.logo?.value),
      address: convertAddressToJSON(settings.address)
    };
    return json;
  }
}

export class CustomerPortalSettings {
  legalName: string;
  logo: {
    value: string,
    type: string
  };
  favicon: {
    value: string,
    type: string
  };
  theme: Map<string, string>;

  static fromJSON(json): CustomerPortalSettings {
    const settings = new CustomerPortalSettings();
    settings.legalName = json.legalName;
    settings.logo = json.logo;
    settings.favicon = json.favicon;
    if (ObjectHelper.isDefined(json.theme)) {
      settings.theme = new Map(JSON.parse(json.theme));
    }
    return settings;
  }

  static toJSON(settings: CustomerPortalSettings) {
    return {
      favicon: getValueOrNull(settings.favicon?.value),
      theme: settings.theme ? JSON.stringify(Array.from(settings.theme.entries())) : null
    }
  }
}

export class TemplateSettings {
  displayName: string;
  address: AddressModel;
  contactInfo: ContactInfoModel;
  logo: {
    value: string,
    type: string
  };
  emailPaymentTemplate: InvoiceTemplateModel;
  receiptTemplate: ReceiptTemplateModel;
  defaultEmailPaymentTemplate: InvoiceTemplateModel;
  defaultReceiptTemplate: ReceiptTemplateModel;
  customFieldsEnabled: boolean;
  advancedFieldsEnabled: boolean;

  static fromJSON(json): TemplateSettings {
    const settings = new TemplateSettings();
    settings.displayName = json.displayName;
    settings.address = convertJSONToAddress(json.address);
    settings.contactInfo = convertJSONToContactInfo(json);
    settings.logo = json.logo;
    settings.emailPaymentTemplate = json.emailPaymentTemplate ? InvoiceTemplateModel.fromJSON(json.emailPaymentTemplate, json.defaultEmailPaymentTemplate) : null;
    settings.receiptTemplate = ReceiptTemplateModel.fromJSON(json.receiptTemplate ?? json.defaultReceiptTemplate);
    settings.defaultEmailPaymentTemplate = JSON.parse(json.defaultEmailPaymentTemplate);
    settings.defaultReceiptTemplate = ReceiptTemplateModel.fromJSON(json.defaultReceiptTemplate);
    settings.customFieldsEnabled = json.customFieldsEnabled ?? false;
    settings.advancedFieldsEnabled = json.advancedFieldsEnabled ?? false;
    return settings;
  }

  static toJSON(settings: TemplateSettings) {
    return {
      emailPaymentTemplate: InvoiceTemplateModel.toString(settings.emailPaymentTemplate),
      receiptTemplate: ReceiptTemplateModel.toJSON(settings.receiptTemplate),
      receiptPrintWidth: settings.receiptTemplate?.width ?? ReceiptPrintWidthEnum.PX185
    }
  }
}

export class MailingMethodSettings {
  isEmailReceiptEditable: boolean;
  emailPaymentNotification: boolean;
  paymentNotificationEmail: string;
  paymentFormSubmissionNotification: boolean;
  paymentFormSubmissionNotificationEmail: string;
  emailSale: boolean;
  emailReceipt: boolean;
  emailSaleHeaderEnabled: boolean;
  mailingMethod: MailingMethodEnum;
  privateSmtp: PrivateSmtpModel = new PrivateSmtpModel();

  static fromJSON(json): MailingMethodSettings {
    const settings = new MailingMethodSettings();
    settings.isEmailReceiptEditable = json.isEmailReceiptEditable;
    settings.emailPaymentNotification = json.emailPaymentNotification;
    settings.paymentNotificationEmail = json.paymentNotificationEmail;
    settings.paymentFormSubmissionNotification = json.paymentFormSubmissionNotification;
    settings.paymentFormSubmissionNotificationEmail = json.paymentFormSubmissionNotificationEmail;
    settings.emailSale = json.emailSale;
    settings.emailReceipt = json.emailReceipt;
    settings.emailSaleHeaderEnabled = json.emailSaleHeaderEnabled !== false;
    settings.mailingMethod = json.mailingMethod;
    settings.privateSmtp = convertJSONToPrivateSmtp(json.privateSmtp);
    return settings;
  }

  static toJSON(settings: MailingMethodSettings) {
    const json = {
      emailPaymentNotification: settings.emailPaymentNotification,
      paymentNotificationEmail: settings.emailPaymentNotification ? settings.paymentNotificationEmail : null,
      paymentFormSubmissionNotification: settings.paymentFormSubmissionNotification,
      paymentFormSubmissionNotificationEmail: settings.paymentFormSubmissionNotification ? settings.paymentFormSubmissionNotificationEmail : null,
      emailReceipt: settings.emailReceipt,
      emailSaleHeaderEnabled: settings.emailSaleHeaderEnabled,
      mailingMethod: settings.mailingMethod,
    }
    if (settings.mailingMethod == MailingMethodEnum.PRIVATE_SMTP) {
      json['privateSmtp'] = convertPrivateSmtpToJSON(settings.privateSmtp)
    }
    return json;
  }
}

export class PaymentSettings {
  allowCustomersManageTheirPaymentMethodsCreatedByMerchant: boolean;
  invoicePartialPaymentsAllowed: boolean;
  salesOrderPartialPaymentsAllowed: boolean;
  depositPartialPaymentsAllowed: boolean;
  allowedPaymentMethods: PaymentMethodTypeEnum[] = [];
  ccAuthorizationMessageTemplate: string;
  defaultCcAuthorizationMessageTemplate: string;
  ccSurchargesAuthorizationMessageTemplate: string;
  defaultCcSurchargesAuthorizationMessageTemplate: string;
  achAuthorizationMessageTemplate: string;
  defaultAchAuthorizationMessageTemplate: string;
  creditCardPaymentAmountLimit: number;
  surchargesFeature: {
    enabled: boolean;
    percent: number;
    isSurchargesAvailable: boolean;
  }

  static fromJSON(json): PaymentSettings {
    const settings = new PaymentSettings();
    settings.allowCustomersManageTheirPaymentMethodsCreatedByMerchant = json.allowCustomersManageTheirPaymentMethodsCreatedByMerchant;
    settings.invoicePartialPaymentsAllowed = json.invoicePartialPaymentsAllowed;
    settings.salesOrderPartialPaymentsAllowed = json.salesOrderPartialPaymentsAllowed;
    settings.depositPartialPaymentsAllowed = json.depositPartialPaymentsAllowed;
    settings.allowedPaymentMethods = EnumHelper.sort(PaymentMethodTypeEnum, json.allowedPaymentMethods);
    settings.ccAuthorizationMessageTemplate = json.ccAuthorizationMessageTemplate;
    settings.defaultCcAuthorizationMessageTemplate = json.defaultCcAuthorizationMessageTemplate;
    settings.ccSurchargesAuthorizationMessageTemplate = json.ccSurchargesAuthorizationMessageTemplate;
    settings.defaultCcSurchargesAuthorizationMessageTemplate = json.defaultCcSurchargesAuthorizationMessageTemplate;
    settings.achAuthorizationMessageTemplate = json.achAuthorizationMessageTemplate;
    settings.defaultAchAuthorizationMessageTemplate = json.defaultAchAuthorizationMessageTemplate;
    settings.creditCardPaymentAmountLimit = !isEmptyString(json.creditCardPaymentAmountLimit) ? Number(json.creditCardPaymentAmountLimit) : null;
    settings.surchargesFeature = json.surchargesFeature;
    return settings;
  }

  static toJSON(settings: PaymentSettings) {
    return {
      invoicePartialPaymentsAllowed: settings.invoicePartialPaymentsAllowed,
      salesOrderPartialPaymentsAllowed: settings.salesOrderPartialPaymentsAllowed,
      depositPartialPaymentsAllowed: settings.depositPartialPaymentsAllowed,
      allowedPaymentMethods: EnumHelper.sort(PaymentMethodTypeEnum, settings.allowedPaymentMethods),
      ccAuthorizationMessageTemplate: settings.ccAuthorizationMessageTemplate,
      ccSurchargesAuthorizationMessageTemplate: settings.ccSurchargesAuthorizationMessageTemplate,
      achAuthorizationMessageTemplate: settings.achAuthorizationMessageTemplate,
      creditCardPaymentAmountLimit: settings.creditCardPaymentAmountLimit,
      allowCustomersManageTheirPaymentMethodsCreatedByMerchant: settings.allowCustomersManageTheirPaymentMethodsCreatedByMerchant,
      surchargesFeature: {
        enabled: settings.surchargesFeature?.enabled ?? false,
        percent: settings.surchargesFeature?.percent ?? null
      }
    }
  }
}

export class VaultFeatures {
  emailPaymentFeatureSubscriptionActive: boolean;
  customerPortalFeatureEnabled: boolean;
  surchargesFeatureEnabled: boolean;
  paymentFormsFeatureEnabled: boolean;
  vaultAllowedPaymentMethods: PaymentMethodTypeEnum[];
  allowedPaymentMethods: PaymentMethodTypeEnum[];
  missingPaymentMethods: PaymentMethodTypeEnum[];
  lastUpdatedTimestamp: string;
  lastUpdatedZoneName: string;

  static fromJSON(json): VaultFeatures {
    const vaultFeatures = new VaultFeatures();
    vaultFeatures.emailPaymentFeatureSubscriptionActive = json.emailPaymentFeatureSubscriptionActive;
    vaultFeatures.customerPortalFeatureEnabled = json.customerPortalFeatureEnabled;
    vaultFeatures.surchargesFeatureEnabled = json.surchargesFeatureEnabled;
    vaultFeatures.paymentFormsFeatureEnabled = json.paymentFormsFeatureEnabled;
    vaultFeatures.vaultAllowedPaymentMethods = json.vaultAllowedPaymentMethods ?? [];
    vaultFeatures.allowedPaymentMethods = json.allowedPaymentMethods ?? [];
    vaultFeatures.missingPaymentMethods = vaultFeatures.vaultAllowedPaymentMethods
      .filter(pm => !vaultFeatures.allowedPaymentMethods.includes(pm));
    vaultFeatures.lastUpdatedTimestamp = formatDate(json.lastUpdatedTimestamp, SDFT);
    vaultFeatures.lastUpdatedZoneName = DateTime.local().zoneName;
    return vaultFeatures;
  }
}
