import {isDefined} from '../../helpers/object.helper';
import * as moment from 'moment-timezone';
import {Mask} from '../../helpers/mask';

export class Item {
  id: number;
  customer;
  item: any = {};
  lineNum: number;
  uiLineNumber: number;
  detailType = 'SALES_ITEM_LINE_DETAIL';
  itemRefName: string;
  description: string;
  quantity = 0;
  unitPrice = 0;
  _quantity = 0;
  _unitPrice = 0;
  amount = 0;
  parentGroup: string;
  taxable = false;
  sku: string;
  serviceDate;


  static calcLineNumber(invoiceItems: Item[]) {
    let tmpUiLineNumber = 0;
    let parentGroup = null;
    invoiceItems.forEach((invoiceItem, i) => {
      if (!isDefined(invoiceItem.parentGroup)) {
        invoiceItem.uiLineNumber = ++tmpUiLineNumber;
        invoiceItem.parentGroup = null;
        parentGroup = invoiceItem;
      } else {
        invoiceItem.uiLineNumber = null;
        invoiceItem.parentGroup = parentGroup;
      }
      invoiceItem.lineNum = i + 1;
    });
  }

  static fromInvoiceItem(serviceItem) {
    const invoiceItem = new Item();
    if (serviceItem) {
      invoiceItem.description = serviceItem.description;
      invoiceItem.item = {id: serviceItem.id, name: serviceItem.name};
      invoiceItem.taxable = serviceItem.taxable;
      invoiceItem.unitPrice = serviceItem.unitPrice || 0;
      invoiceItem.detailType = serviceItem.detailType || 'SALES_ITEM_LINE_DETAIL';
      invoiceItem.quantity = serviceItem.quantity || 0;
      //invoiceItem.amount = parseFloat(calcAmount(invoiceItem).toFixed(2));
      invoiceItem._quantity = serviceItem.quantity;
      invoiceItem._unitPrice = serviceItem.unitPrice;
      invoiceItem.sku = serviceItem.sku;
      invoiceItem.serviceDate = serviceItem.serviceDate ? moment(serviceItem.serviceDate) : null;
      //invoiceItem.categoryClass = serviceItem.categoryClass;
    }
    return invoiceItem;
  }

  static toJSON(invoiceItem: Item, i) {
    return {
      description: invoiceItem.description,
      item: invoiceItem.item ? {
        id: invoiceItem.item.id,
        name: invoiceItem.item.name
      } : null,
      lineNum: i + 1,
      amount: Mask.unmaskNumber(invoiceItem.amount),
      detailType: invoiceItem.detailType,
      quantity: Mask.unmaskNumber(invoiceItem.quantity),
      unitPrice: Mask.unmaskNumber(invoiceItem.unitPrice),
      taxable: invoiceItem.taxable || false,
      serviceDate: moment(invoiceItem.serviceDate).isValid() ? moment(invoiceItem.serviceDate).utc(true).format() : null
    };
  }

  static listToJSON(invoiceItems: Item[]) {
    let currentParentGroupIndex = -1;
    const jsonInvoiceItems = [];
    invoiceItems.forEach((invoiceItem, i) => {
      const toJson = Item.toJSON(invoiceItem, i);
      if (isDefined(invoiceItem.parentGroup)) {
        if (!jsonInvoiceItems[currentParentGroupIndex].children) {
          jsonInvoiceItems[currentParentGroupIndex].children = [];
        }
        jsonInvoiceItems[currentParentGroupIndex].children.push(toJson);
      } else {
        jsonInvoiceItems.push(toJson);
        currentParentGroupIndex = jsonInvoiceItems.length - 1;
      }
    });
    return jsonInvoiceItems;
  }

}
