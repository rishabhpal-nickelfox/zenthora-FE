export class BrandingModel {
  id: number;
  name: string;
  companyPortalUrl: string;
  customerPortalUrl: string;
  paymentFormsUrl: string;
  saleFrom: string;
  receiptFrom: string;
  emailFrom: string;
  productName: string;
  signatureFormatted: string;
  supportPhone: string;
  supportEmail: string;
  disabled? = false;
  isDefault? = false;

  static toJSON(settings: BrandingModel) {
    return {
      id: settings.id,
      name: settings.name,
      companyPortalUrl: settings.companyPortalUrl,
      customerPortalUrl: settings.customerPortalUrl,
      paymentFormsUrl: settings.paymentFormsUrl,
      saleFrom: settings.saleFrom,
      receiptFrom: settings.receiptFrom,
      emailFrom: settings.emailFrom,
      productName: settings.productName,
      signatureFormatted: settings.signatureFormatted,
      supportPhone: settings.supportPhone,
      supportEmail: settings.supportEmail,
      isDefault: settings.isDefault == true ? settings.isDefault : null
    };
  }

  static fromJSON(json: any): BrandingModel {
    const settings = new BrandingModel();

    settings.id = json.id ?? null;
    settings.name = json.name ?? null;
    settings.companyPortalUrl = json.companyPortalUrl ?? null;
    settings.customerPortalUrl = json.customerPortalUrl ?? null;
    settings.paymentFormsUrl = json.paymentFormsUrl ?? null;
    settings.saleFrom = json.saleFrom ?? null;
    settings.receiptFrom = json.receiptFrom ?? null;
    settings.emailFrom = json.emailFrom ?? null;
    settings.productName = json.productName ?? null;
    settings.signatureFormatted = json.signatureFormatted ?? null;
    settings.supportPhone = json.supportPhone ?? null;
    settings.supportEmail = json.supportEmail ?? null;
    settings.isDefault = json.isDefault;
    settings.disabled = json.disabled;
    return settings;
  }
}
