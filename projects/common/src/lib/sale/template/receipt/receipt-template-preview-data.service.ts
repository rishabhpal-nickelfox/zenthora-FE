import {Injectable} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeStyle} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ReceiptTemplatePreviewDataService {
  private readonly defaultCompany = {
    logo: {
      type: 'image/png',
      value: ''
    },
    name: 'Company Name',
    street: 'Street',
    city: 'City',
    state: 'ST',
    zip: '11111',
    website: 'https://website.com',
    phone: '123123123',
    email: 'email@email.com'
  };
  private _company = {
    ...this.defaultCompany,
    logo: {...this.defaultCompany.logo}
  };

  readonly receiptTitle = 'Transaction Receipt';

  readonly date = '04/09/2026';
  readonly time = '11:06:57';
  readonly customerName = 'Testy T. Test';
  readonly customerEmail = 'customer.email@email.com';
  readonly poNumber = 'PO-1002';
  readonly memo = 'Thank you for your business and have a great day!';
  readonly saleType = 'Inv';
  readonly saleNumber = '1002';
  readonly amountPaid = '$3.00';
  readonly tax = '$0.15';
  readonly discount = '$0.00';
  readonly tip = '$1.00';
  readonly shippingAmount = '$2.00';

  readonly paymentMode = '*KEYED*';
  readonly paymentMethod = 'VISA';
  readonly paymentLastFour = '1111';
  readonly authorization = '695864206';
  readonly cvv2 = 'Match';
  readonly referenceNumber = '60112743236';

  readonly payer = 'name';

  constructor(private sanitizer: DomSanitizer) {
  }

  setCompanyInfo(companyInfo: any): void {
    this._company = {
      ...this.defaultCompany,
      name: companyInfo?.displayName || this.defaultCompany.name,
      street: companyInfo?.address?.street || this.defaultCompany.street,
      city: companyInfo?.address?.city || this.defaultCompany.city,
      state: companyInfo?.address?.state || this.defaultCompany.state,
      zip: companyInfo?.address?.zip || this.defaultCompany.zip,
      website: companyInfo?.contactInfo?.website || this.defaultCompany.website,
      phone: companyInfo?.contactInfo?.formattedPhone || companyInfo?.contactInfo?.phone || this.defaultCompany.phone,
      email: companyInfo?.contactInfo?.email || this.defaultCompany.email,
      logo: companyInfo?.logo ? {
        type: companyInfo.logo.type || this.defaultCompany.logo.type,
        value: companyInfo.logo.value || ''
      } : {...this.defaultCompany.logo}
    };
  }

  get company() {
    return this._company;
  }

  get companyLogoUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:' + this._company.logo.type + ';base64,' + this._company.logo.value
    );
  }

  get companyLogoWidth(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle('100px');
  }
}
