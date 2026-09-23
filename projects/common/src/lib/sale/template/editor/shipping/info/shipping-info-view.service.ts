import {Injectable} from '@angular/core';
import {InvoiceEmailTemplateViewCommonService} from '../../invoice-email-template-view-common.service';
import {
  InvoiceComponentTemplateModel,
  ShippingInfoTemplateModel
} from "../../../../../models/sale/template/invoice-template.model";

@Injectable()
export class ShippingInfoViewService extends InvoiceEmailTemplateViewCommonService {

    private _shipMethodHeader: string;
    private _trackingNumberHeader: string;
    private _shipDateHeader: string;

    get shipMethodHeader(): string {
        return this._shipMethodHeader;
    }

    set shipMethodHeader(value: string) {
        this._shipMethodHeader = value;
    }

    get trackingNumberHeader(): string {
        return this._trackingNumberHeader;
    }

    set trackingNumberHeader(value: string) {
        this._trackingNumberHeader = value;
    }

    get shipDateHeader(): string {
        return this._shipDateHeader;
    }

    set shipDateHeader(value: string) {
        this._shipDateHeader = value;
    }

    get template(): ShippingInfoTemplateModel {
        const template = Object.assign(new ShippingInfoTemplateModel(), super.template);
        template.shipMethodHeader = this.shipMethodHeader;
        template.trackingNumberHeader = this.trackingNumberHeader;
        template.shipDateHeader = this.shipDateHeader;
        return template;
    }

    initTemplate(value: ShippingInfoTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
        this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
        this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
        this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
        this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
        this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
        this.shipMethodHeader = value.shipMethodHeader;
        this.trackingNumberHeader = value.trackingNumberHeader;
        this.shipDateHeader = value.shipDateHeader;
        this.settingsChanged.emit();
    }

}
