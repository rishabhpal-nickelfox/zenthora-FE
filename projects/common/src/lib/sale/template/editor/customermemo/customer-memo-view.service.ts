import {InvoiceEmailTemplateViewCommonService} from '../invoice-email-template-view-common.service';
import {EventEmitter, Injectable} from '@angular/core';
import {
  CustomerMemoTemplateModel, InvoiceComponentTemplateModel
} from "../../../../models/sale/template/invoice-template.model";

@Injectable()
export class CustomerMemoViewService extends InvoiceEmailTemplateViewCommonService {
    customerMemoChanged: EventEmitter<void> = new EventEmitter<void>();

    public get customerMemo(): string {
        return this._customerMemo;
    }

    public set customerMemo(value: string) {
        this._customerMemo = value;
        this.customerMemoChanged.emit();
    }

    private _customerMemo: string = 'Customer Memo';

    get template(): CustomerMemoTemplateModel {
        const template = Object.assign(new CustomerMemoTemplateModel(), super.template);
        return template;
    }

    initTemplate(value: CustomerMemoTemplateModel, defaultTemplate: InvoiceComponentTemplateModel) {
        this.titleColor = value.titleColor ?? defaultTemplate.titleColor;
        this.borderColor = value.borderColor ?? defaultTemplate.borderColor;
        this.colorEven = value.colorEven ?? defaultTemplate.colorEven;
        this.colorOdd = value.colorOdd ?? defaultTemplate.colorOdd;
        this.fontColor = value.fontColor ?? defaultTemplate.fontColor;
        this.settingsChanged.emit();
    }
}
