import {Injectable} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from '../../invoice-email-template-view-common.service';
import {
  AddressTemplateModel, InvoiceComponentTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";

@Injectable()
export class ShippingAddressViewService extends InvoiceEmailTemplateViewCommonService {

    private _addressHeader: string;

    get template(): AddressTemplateModel {
        const template = Object.assign(new AddressTemplateModel(), super.template);
        template.addressHeader = this._addressHeader;
        return template;
    }

    initTemplate(value: AddressTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
        this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
        this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
        this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
        this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
        this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
        this.addressHeader = value.addressHeader;
        this.settingsChanged.emit();
    }

    get addressHeader(): string {
        return this._addressHeader;
    }

    set addressHeader(value: string) {
        this._addressHeader = value;
    }

}
