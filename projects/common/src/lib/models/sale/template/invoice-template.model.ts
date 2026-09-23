import {GridsterItem} from 'angular-gridster2/lib/gridsterItem.interface';
import {
  InvoiceEmailPaymentTemplateLogoSizeEnum
} from "../../../enums/sale/invoice-email-payment-template-logo-size.enum";
import {ObjectHelper} from "../../../helpers/object.helper";
import {CompanyInfoRowsEnum} from "../../../enums/sale/company-info-rows.enum";
import {
  InvoiceItemsTableTotalsEnum
} from "../../../enums/sale/invoice-items-table-totals.enum";
import {
  InvoiceEmailPaymentLineStyleEnum
} from "../../../enums/sale/invoice-email-payment-line-style.enum";
import {
  InvoiceEmailPaymentTemplateComponentsEnum
} from "../../../enums/sale/invoice-email-payment-template-components.enum";


export class InvoiceTemplateModel {
  public static readonly LINE_HEIGHTS: readonly number[] = [1.0, 1.15, 1.2, 1.5, 1.75, 2.0];
  public static readonly DEFAULT_LINE_HEIGHT = 1.5;

  version: string;
  components: GridAreaModel[] = [];
  saleFullInfoTemplate: InvoiceFullInfoTemplateModel;
  itemTableTemplate: InvoiceItemTableTemplateModel;
  itemsRowsTemplate: InvoiceItemsRowsTemplateModel;
  saleShortInfoTemplate: InvoiceShortInfoTemplateModel;
  saleAdditionalInfoTemplates: InvoiceAdditionalInfoTemplateModel[];
  customFieldsTemplates: CustomFieldsTemplateModel[];
  billToTemplate: AddressTemplateModel;
  shipToTemplate: AddressTemplateModel;
  shippingInfoTemplate: ShippingInfoTemplateModel;
  companyInfoTemplates: CompanyInfoTemplateModel[] = [];
  lineTemplates: LineTemplateModel[];
  customerMemoTemplate: CustomerMemoTemplateModel;
  customerNameTemplates: CustomerNameTemplateModel[];
  totalsTemplate: TotalsTemplateModel;
  textTemplates: TextTemplateModel[];
  titleColor: string;
  colorEven: string;
  colorOdd: string;
  fontColor: string;
  borderColor: string;
  fontSize: number;
  logoSize: InvoiceEmailPaymentTemplateLogoSizeEnum;
  minimizeVerticalSize: boolean;
  gridGap: number;
  lineHeight: number;
  /** Layout algorithm switch. true = legacy QBO render (discrete 45pt fixed columns);
   * false/undefined = the flexible auto-flow layout.
   * Set false by the editor on save so a template migrates to the new look only after its appearance is approved. **/
  legacyLayout: boolean;

  public static generateGridAreaId(prefix: string) {
    return `${prefix}${Date.now()}`;
  }

  private static migrateTemplates<T>(
    invoice: InvoiceTemplateModel,
    json: any,
    config: {
      arrayKey: string;
      singleKey: string;
      componentKey: InvoiceEmailPaymentTemplateComponentsEnum;
      gridAreaId: string;
      fromJSON: (template: any, root: InvoiceTemplateModel) => T;
      getDefaultTemplate: () => any;
    }
  ) {
    const components = (invoice.components ?? []).filter(c => c.id === config.componentKey);
    const componentDefaultTemplate = config.getDefaultTemplate();

    const hasArray = Array.isArray(json[config.arrayKey]);
    const hasSingle = !hasArray && !!json[config.singleKey];

    const src = hasArray
      ? json[config.arrayKey]
      : (hasSingle ? [json[config.singleKey]] : []);

    let firstId: string | undefined;

    invoice[config.arrayKey] = src.map((componentTemplate: any, idx: number) => {
      const id = componentTemplate?.id ?? InvoiceTemplateModel.generateGridAreaId(config.componentKey);
      if (idx === 0) firstId = id;

      const merged = ObjectHelper.mergeProperties(componentTemplate, componentDefaultTemplate);
      return config.fromJSON({...merged, id}, invoice);
    });

    if (hasSingle && components.length && firstId) {
      components[0][config.gridAreaId] = firstId;
    }

    const existingIds: string[] = invoice[config.arrayKey].map(t => t.id);

    for (const comp of components) {
      let id = comp[config.gridAreaId];

      if (!id) {
        id = InvoiceTemplateModel.generateGridAreaId(config.componentKey);
        comp[config.gridAreaId] = id;
      }

      if (existingIds.indexOf(id) < 0) {
        const base = (hasSingle && id === firstId) ? json[config.singleKey] : {};
        const merged = ObjectHelper.mergeProperties(base, componentDefaultTemplate);

        const tpl = config.fromJSON({...merged, id}, invoice);
        invoice[config.arrayKey].push(tpl);
        existingIds.push(id);
      }
    }
  }


  static fromJSON(templateAsString: string, defaultTemplateAsString: string): InvoiceTemplateModel {
    const invoiceTemplateModel = new InvoiceTemplateModel();
    const jsonTemplate = JSON.parse(templateAsString);
    const defaultTemplate = JSON.parse(defaultTemplateAsString);
    invoiceTemplateModel.version = jsonTemplate.version ?? defaultTemplate.version;
    invoiceTemplateModel.components = jsonTemplate.components ?? defaultTemplate.components;

    invoiceTemplateModel.components = invoiceTemplateModel.components.filter(c => {
      if (c.id !== InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS) return true;
      return ObjectHelper.isDefined(c.customFieldsId)
    });

    invoiceTemplateModel.titleColor = jsonTemplate.titleColor ?? defaultTemplate.titleColor;
    invoiceTemplateModel.colorEven = jsonTemplate.colorEven ?? defaultTemplate.colorEven;
    invoiceTemplateModel.colorOdd = jsonTemplate.colorOdd ?? defaultTemplate.colorOdd;
    invoiceTemplateModel.fontColor = jsonTemplate.fontColor ?? defaultTemplate.fontColor;
    invoiceTemplateModel.borderColor = jsonTemplate.borderColor ?? defaultTemplate.borderColor;
    invoiceTemplateModel.fontSize = jsonTemplate.fontSize ?? defaultTemplate.fontSize;
    invoiceTemplateModel.logoSize = jsonTemplate.logoSize ?? defaultTemplate.logoSize;

    invoiceTemplateModel.minimizeVerticalSize = jsonTemplate.minimizeVerticalSize ?? defaultTemplate.minimizeVerticalSize;
    invoiceTemplateModel.gridGap = jsonTemplate.gridGap ?? defaultTemplate.gridGap;
    invoiceTemplateModel.lineHeight = jsonTemplate.lineHeight ?? defaultTemplate.lineHeight;
    invoiceTemplateModel.legacyLayout = jsonTemplate.legacyLayout ?? defaultTemplate.legacyLayout;
    invoiceTemplateModel.saleFullInfoTemplate = InvoiceFullInfoTemplateModel.fromJSON(jsonTemplate.saleFullInfoTemplate ?? defaultTemplate.saleFullInfoTemplate, invoiceTemplateModel);
    invoiceTemplateModel.itemTableTemplate = InvoiceItemTableTemplateModel.fromJSON(ObjectHelper.mergeProperties(jsonTemplate.itemTableTemplate, defaultTemplate.itemTableTemplate), jsonTemplate.itemTable ?? jsonTemplate.itemTableTemplate?.itemTable ?? defaultTemplate.itemTableTemplate.itemTable,
      jsonTemplate.totals ?? jsonTemplate.itemTableTemplate?.totals ?? defaultTemplate.itemTableTemplate.totals, invoiceTemplateModel);
    invoiceTemplateModel.itemsRowsTemplate = InvoiceItemsRowsTemplateModel.fromJSON(ObjectHelper.mergeProperties(jsonTemplate.itemsRowsTemplate, defaultTemplate.itemsRowsTemplate), invoiceTemplateModel);
    invoiceTemplateModel.saleShortInfoTemplate = InvoiceShortInfoTemplateModel.fromJSON(jsonTemplate.saleShortInfoTemplate ?? defaultTemplate.saleShortInfoTemplate, invoiceTemplateModel);

    InvoiceTemplateModel.migrateTemplates<InvoiceAdditionalInfoTemplateModel>(invoiceTemplateModel, jsonTemplate, {
      arrayKey: 'saleAdditionalInfoTemplates',
      singleKey: 'saleAdditionalInfoTemplate',
      componentKey: InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL,
      gridAreaId: 'saleAdditionalInfoId',
      fromJSON: (template, root) => InvoiceAdditionalInfoTemplateModel.fromJSON(template, root),
      getDefaultTemplate: () => (defaultTemplate.saleAdditionalInfoTemplates?.length
        ? defaultTemplate.saleAdditionalInfoTemplates[0]
        : new InvoiceAdditionalInfoTemplateModel())
    });

    invoiceTemplateModel.customFieldsTemplates = jsonTemplate.customFieldsTemplates ? jsonTemplate.customFieldsTemplates.map(template => CustomFieldsTemplateModel.fromJSON(
      template,
      invoiceTemplateModel
    )) : [];
    invoiceTemplateModel.billToTemplate = AddressTemplateModel.fromJSON(jsonTemplate.billToTemplate ?? defaultTemplate.billToTemplate, invoiceTemplateModel);
    invoiceTemplateModel.shipToTemplate = AddressTemplateModel.fromJSON(jsonTemplate.shipToTemplate ?? defaultTemplate.shipToTemplate, invoiceTemplateModel);
    invoiceTemplateModel.shippingInfoTemplate = ShippingInfoTemplateModel.fromJSON(ObjectHelper.mergeProperties(jsonTemplate.shippingInfoTemplate, defaultTemplate.shippingInfoTemplate), invoiceTemplateModel)

    InvoiceTemplateModel.migrateTemplates<CompanyInfoTemplateModel>(invoiceTemplateModel, jsonTemplate, {
      arrayKey: 'companyInfoTemplates',
      singleKey: 'companyInfoTemplate',
      componentKey: InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO,
      gridAreaId: 'companyInfoId',
      fromJSON: (template, root) => CompanyInfoTemplateModel.fromJSON(template, root),
      getDefaultTemplate: () => (defaultTemplate.companyInfoTemplates?.length
        ? defaultTemplate.companyInfoTemplates[0]
        : new CompanyInfoTemplateModel())
    });

    invoiceTemplateModel.lineTemplates = jsonTemplate.lineTemplates ? jsonTemplate.lineTemplates.map(line => LineTemplateModel.fromJSON(line)) : [];
    invoiceTemplateModel.customerMemoTemplate = CustomerMemoTemplateModel.fromJSON(jsonTemplate.customerMemoTemplate ?? defaultTemplate.customerMemoTemplate, invoiceTemplateModel);
    invoiceTemplateModel.totalsTemplate = TotalsTemplateModel.fromJSON(jsonTemplate.totalsTemplate ?? defaultTemplate.totalsTemplate, invoiceTemplateModel);
    invoiceTemplateModel.textTemplates = jsonTemplate.textTemplates ? jsonTemplate.textTemplates.map(text => TextTemplateModel.fromJSON(text)) : [];
    invoiceTemplateModel.customerNameTemplates = jsonTemplate.customerNameTemplates ? jsonTemplate.customerNameTemplates.map(customerNameTemplate => CustomerNameTemplateModel.fromJSON(customerNameTemplate, invoiceTemplateModel)) : [];
    return invoiceTemplateModel;
  }

  static toMap(instance: InvoiceTemplateModel): Map<string, any> {
    const map = new Map();
    map.set('version', instance.version);
    map.set('components', instance.components);
    map.set('saleFullInfoTemplate', InvoiceFullInfoTemplateModel.toMap(instance.saleFullInfoTemplate));
    map.set('itemTableTemplate', InvoiceItemTableTemplateModel.toMap(instance.itemTableTemplate));
    map.set('itemsRowsTemplate', InvoiceItemsRowsTemplateModel.toMap(instance.itemsRowsTemplate));
    map.set('saleShortInfoTemplate', InvoiceShortInfoTemplateModel.toMap(instance.saleShortInfoTemplate));
    map.set('saleAdditionalInfoTemplates', instance.saleAdditionalInfoTemplates?.map(t => InvoiceAdditionalInfoTemplateModel.toMap(t)) ?? []);
    map.set('billToTemplate', AddressTemplateModel.toMap(instance.billToTemplate));
    map.set('shipToTemplate', AddressTemplateModel.toMap(instance.shipToTemplate));
    map.set('shippingInfoTemplate', ShippingInfoTemplateModel.toMap(instance.shippingInfoTemplate));
    map.set('companyInfoTemplates', instance.companyInfoTemplates?.map(companyInfo => CompanyInfoTemplateModel.toMap(companyInfo)) ?? []);
    map.set('lineTemplates', instance.lineTemplates?.map(line => LineTemplateModel.toMap(line))) ?? [];
    map.set('customerMemoTemplate', CustomerMemoTemplateModel.toMap(instance.customerMemoTemplate));
    map.set('customerNameTemplates', instance.customerNameTemplates?.map(customerNameTemplate => CustomerNameTemplateModel.toMap(customerNameTemplate))) ?? [];
    map.set('totalsTemplate', TotalsTemplateModel.toMap(instance.totalsTemplate));
    map.set('textTemplates', instance.textTemplates?.map(text => TextTemplateModel.toMap(text)) ?? []);
    map.set('customFieldsTemplates', instance.customFieldsTemplates?.map(customField => CustomFieldsTemplateModel.toMap(customField)) ?? []);
    map.set('titleColor', instance.titleColor);
    map.set('colorEven', instance.colorEven);
    map.set('colorOdd', instance.colorOdd);
    map.set('fontColor', instance.fontColor);
    map.set('borderColor', instance.borderColor);
    map.set('fontSize', instance.fontSize);
    map.set('logoSize', instance.logoSize);
    map.set('gridGap', instance.gridGap);
    map.set('minimizeVerticalSize', instance.minimizeVerticalSize);
    map.set('lineHeight', instance.lineHeight);
    map.set('legacyLayout', instance.legacyLayout);
    return map;
  }


  static toString(instance: InvoiceTemplateModel): string {
    const map = InvoiceTemplateModel.toMap(instance);
    const plainObject = ObjectHelper.mapToObject(map);
    return JSON.stringify(plainObject);
  }

}

export interface GridAreaModel extends GridsterItem {
  id: any;
  cols: number;
  rows: number;
  x: number;
  y: number;
  isEmpty?: boolean;
  lineId?: string;
  companyInfoId?: string;
  customFieldsId?: string;
  saleAdditionalInfoId?: string;
}

export type CustomFieldGridAreaModel = GridAreaModel & { name: string };

export class InvoiceComponentTemplateModel {
  titleColor: string;
  colorEven: string;
  colorOdd: string;
  fontColor: string;
  borderColor: string;

  static fromJSON(jsonTemplate, defaultTemplate, ...params) {
    const settings = new InvoiceComponentTemplateModel();
    settings.titleColor = jsonTemplate?.titleColor ?? defaultTemplate.titleColor;
    settings.colorEven = jsonTemplate?.colorEven ?? defaultTemplate.colorEven;
    settings.colorOdd = jsonTemplate?.colorOdd ?? defaultTemplate.colorOdd;
    settings.fontColor = jsonTemplate?.fontColor ?? defaultTemplate.fontColor;
    settings.borderColor = jsonTemplate?.borderColor ?? defaultTemplate.borderColor;
    return settings;
  }

  static toMap(instance: InvoiceComponentTemplateModel): Map<string, any> {
    const map = new Map();
    map.set('titleColor', instance?.titleColor);
    map.set('colorEven', instance?.colorEven);
    map.set('colorOdd', instance?.colorOdd);
    map.set('fontColor', instance?.fontColor);
    map.set('borderColor', instance?.borderColor);
    return map;
  }
}

export class InvoiceFullInfoTemplateModel extends InvoiceComponentTemplateModel {
  saleHeader: string;
  dateHeader: string;
  dueDateHeader: string;
  termsHeader: string;

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new InvoiceFullInfoTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.saleHeader = jsonTemplate.saleHeader;
    settings.dateHeader = jsonTemplate.dateHeader;
    settings.dueDateHeader = jsonTemplate.dueDateHeader;
    settings.termsHeader = jsonTemplate.termsHeader;
    return settings;
  }

  static toMap(instance: InvoiceFullInfoTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('saleHeader', instance.saleHeader);
    map.set('dateHeader', instance.dateHeader);
    map.set('dueDateHeader', instance.dueDateHeader);
    map.set('termsHeader', instance.termsHeader);
    return map;
  }
}


export class InvoiceAdditionalInfoTemplateModel extends InvoiceComponentTemplateModel {
  id: string;
  dueDateHeader: string;
  termsHeader: string;
  salesRepHeader: string;
  shipDateHeader: string;
  shipMethodHeader: string;
  fobHeader: string;
  trackingNumberHeader: string;
  poNumberHeader: string;
  otherHeader: string;
  additionalInfo: GridAreaModel[];

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new InvoiceAdditionalInfoTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.id = jsonTemplate?.id ?? InvoiceTemplateModel.generateGridAreaId(InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL);
    settings.termsHeader = jsonTemplate.termsHeader;
    settings.dueDateHeader = jsonTemplate.dueDateHeader;
    settings.salesRepHeader = jsonTemplate.salesRepHeader ?? defaultTemplate.salesRepHeader;
    settings.shipDateHeader = jsonTemplate.shipDateHeader ?? defaultTemplate.shipDateHeader;
    settings.shipMethodHeader = jsonTemplate.shipMethodHeader ?? defaultTemplate.shipMethodHeader;
    settings.fobHeader = jsonTemplate.fobHeader ?? defaultTemplate.fobHeader;
    settings.trackingNumberHeader = jsonTemplate.trackingNumberHeader ?? defaultTemplate.trackingNumberHeader;
    settings.poNumberHeader = jsonTemplate.poNumberHeader ?? defaultTemplate.poNumberHeader;
    settings.otherHeader = jsonTemplate.otherHeader ?? defaultTemplate.otherHeader;
    settings.additionalInfo = jsonTemplate.additionalInfo;
    return settings;
  }

  static toMap(instance: InvoiceAdditionalInfoTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('id', instance.id);
    map.set('dueDateHeader', instance.dueDateHeader);
    map.set('termsHeader', instance.termsHeader);
    map.set('salesRepHeader', instance.salesRepHeader);
    map.set('shipDateHeader', instance.shipDateHeader);
    map.set('shipMethodHeader', instance.shipMethodHeader);
    map.set('fobHeader', instance.fobHeader);
    map.set('trackingNumberHeader', instance.trackingNumberHeader);
    map.set('poNumberHeader', instance.poNumberHeader);
    map.set('otherHeader', instance.otherHeader);
    map.set('additionalInfo', instance.additionalInfo);
    return map;
  }
}

export class CompanyInfoTemplateModel extends InvoiceComponentTemplateModel {
  id: string;
  companyInfoHeader: string;
  hideHeader: boolean;
  companyInfoRows: CompanyInfoRowsEnum[];

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new CompanyInfoTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.id = jsonTemplate?.id ?? InvoiceTemplateModel.generateGridAreaId(InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO);
    settings.companyInfoHeader = jsonTemplate.companyInfoHeader;
    settings.hideHeader = jsonTemplate.hideHeader ?? false;
    settings.companyInfoRows = jsonTemplate.companyInfoRows ?? Object.keys(CompanyInfoRowsEnum);
    return settings;
  }

  static toMap(instance: CompanyInfoTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('id', instance.id);
    map.set('companyInfoHeader', instance.companyInfoHeader);
    map.set('hideHeader', instance.hideHeader);
    map.set('companyInfoRows', instance.companyInfoRows);
    return map;
  }
}

export class InvoiceItemTableTemplateModel extends InvoiceComponentTemplateModel {
  lineNumHeader: string;
  itemHeader: string;
  descriptionHeader: string;
  quantityHeader: string;
  rateHeader: string;
  amountHeader: string;
  taxableHeader: string;
  skuHeader: string;
  serviceDateHeader: string;
  categoryClassHeader: string;
  other1Header: string;
  other2Header: string;
  itemTable: GridAreaModel[] = [];
  totals: InvoiceItemsTableTotalsEnum[];
  hideCustomerMemo: boolean;
  customerMemoColor: string;
  autoColumnWidths: boolean;
  autoTotalsWidth: boolean;
  totalsLabelColumnSpan: number;
  totalsAmountColumnSpan: number;

  private static readonly HEADER_KEYS = [
    'lineNumHeader',
    'itemHeader',
    'descriptionHeader',
    'quantityHeader',
    'rateHeader',
    'amountHeader',
    'taxableHeader',
    'skuHeader',
    'serviceDateHeader',
    'categoryClassHeader',
    'other1Header',
    'other2Header',
  ] as const;

  static fromJSON(jsonTemplate: Partial<InvoiceItemTableTemplateModel>, itemTable: GridAreaModel[], totals: InvoiceItemsTableTotalsEnum[], defaultTemplate: Partial<InvoiceItemTableTemplateModel>): InvoiceItemTableTemplateModel {
    const settings = Object.assign(new InvoiceItemTableTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));

    this.HEADER_KEYS.forEach(key => {
      settings[key] = jsonTemplate[key] ?? defaultTemplate[key];
    });

    settings.hideCustomerMemo = jsonTemplate.hideCustomerMemo ?? false;
    settings.customerMemoColor = jsonTemplate.customerMemoColor ?? null;
    settings.autoColumnWidths = jsonTemplate.autoColumnWidths ?? true;
    settings.autoTotalsWidth = jsonTemplate.autoTotalsWidth ?? true;
    settings.totalsLabelColumnSpan = jsonTemplate.totalsLabelColumnSpan ?? null;
    settings.totalsAmountColumnSpan = jsonTemplate.totalsAmountColumnSpan ?? null;
    settings.itemTable = itemTable;
    settings.totals = totals;

    return settings;
  }

  static toMap(instance: InvoiceItemTableTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    this.HEADER_KEYS.forEach(key => map.set(key, instance[key]));
    map.set('hideCustomerMemo', instance.hideCustomerMemo);
    map.set('customerMemoColor', instance.customerMemoColor);
    map.set('autoColumnWidths', instance.autoColumnWidths);
    map.set('autoTotalsWidth', instance.autoTotalsWidth);
    map.set('totalsLabelColumnSpan', instance.totalsLabelColumnSpan);
    map.set('totalsAmountColumnSpan', instance.totalsAmountColumnSpan);
    map.set('itemTable', instance.itemTable);
    map.set('totals', instance.totals);
    return map;
  }
}

export class InvoiceItemsRowsTemplateModel extends InvoiceComponentTemplateModel {
  lineNumHeader: string;
  itemHeader: string;
  descriptionHeader: string;
  quantityHeader: string;
  rateHeader: string;
  amountHeader: string;
  taxableHeader: string;
  skuHeader: string;
  serviceDateHeader: string;
  categoryClassHeader: string;
  other1Header: string;
  other2Header: string;
  itemTable: GridAreaModel[] = [];
  autoColumnWidths: boolean;

  private static readonly HEADER_KEYS = [
    'lineNumHeader',
    'itemHeader',
    'descriptionHeader',
    'quantityHeader',
    'rateHeader',
    'amountHeader',
    'taxableHeader',
    'skuHeader',
    'serviceDateHeader',
    'categoryClassHeader',
    'other1Header',
    'other2Header',
  ];

  static fromJSON(jsonTemplate: Partial<InvoiceItemsRowsTemplateModel>, defaultTemplate: Partial<InvoiceItemsRowsTemplateModel>): InvoiceItemsRowsTemplateModel {
    const base = InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate);
    const settings = Object.assign(new InvoiceItemsRowsTemplateModel(), base);

    this.HEADER_KEYS.forEach(key => {
      settings[key] = jsonTemplate[key] ?? defaultTemplate[key];
    });

    settings.itemTable = jsonTemplate.itemTable;
    settings.autoColumnWidths = jsonTemplate.autoColumnWidths ?? true;
    return settings;
  }

  static toMap(instance: InvoiceItemsRowsTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    this.HEADER_KEYS.forEach(key => map.set(key, instance[key]));
    map.set('itemTable', instance.itemTable);
    map.set('autoColumnWidths', instance.autoColumnWidths);
    return map;
  }
}


export class InvoiceShortInfoTemplateModel extends InvoiceComponentTemplateModel {
  dateHeader: string;
  saleHeader: string;

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new InvoiceShortInfoTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.dateHeader = jsonTemplate.dateHeader;
    settings.saleHeader = jsonTemplate.saleHeader;
    return settings;
  }

  static toMap(instance: InvoiceShortInfoTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('dateHeader', instance.dateHeader);
    map.set('saleHeader', instance.saleHeader);
    return map
  }
}

export class AddressTemplateModel extends InvoiceComponentTemplateModel {
  addressHeader: string;

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new AddressTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.addressHeader = jsonTemplate.addressHeader;
    return settings;
  }

  static toMap(instance: AddressTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('addressHeader', instance.addressHeader);
    return map;
  }
}

export class CustomFieldsTemplateModel extends InvoiceComponentTemplateModel {
  id: string;
  customFields: CustomFieldGridAreaModel[] = [];

  constructor(id: string, customFields: CustomFieldGridAreaModel[],
              titleColor: string,
              colorEven: string,
              colorOdd: string,
              fontColor: string,
              borderColor: string) {
    super();
    this.id = id;
    this.customFields = customFields;
    this.titleColor = titleColor;
    this.colorEven = colorEven;
    this.colorOdd = colorOdd;
    this.fontColor = fontColor;
    this.borderColor = borderColor;
  }

  static fromJSON(jsonTemplate, defaultTemplate) {
    const baseTemplate = InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate);
    return new CustomFieldsTemplateModel(jsonTemplate.id, jsonTemplate.customFields, baseTemplate.titleColor,
      baseTemplate.colorEven, baseTemplate.colorOdd, baseTemplate.fontColor, baseTemplate.borderColor);
  }

  static toMap(instance: CustomFieldsTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('id', instance?.id);
    map.set('customFields', instance?.customFields ?? []);
    return map;
  }
}

export class LineTemplateModel {
  id: string;
  color: string;
  width: number;
  style: InvoiceEmailPaymentLineStyleEnum;


  constructor(id: string, defaultColor: string, width?: number, style?: InvoiceEmailPaymentLineStyleEnum) {
    this.id = id;
    this.color = defaultColor;
    this.width = width ?? 3;
    this.style = style ?? InvoiceEmailPaymentLineStyleEnum.SOLID;
  }

  static fromJSON(jsonTemplate) {
    return new LineTemplateModel(jsonTemplate.id, jsonTemplate.color, jsonTemplate.width, jsonTemplate.style);
  }

  static toMap(instance: LineTemplateModel): Map<string, any> {
    const map = new Map();
    map.set('id', instance.id);
    map.set('color', instance.color);
    map.set('width', instance.width);
    map.set('style', instance.style);
    return map;
  }
}

export class TotalsTemplateModel extends InvoiceComponentTemplateModel {
  totals: InvoiceItemsTableTotalsEnum[];
  totalHeader: string;
  subtotalHeader: string;
  taxHeader: string;
  discountHeader: string;
  shippingCostHeader: string;
  appliedAmountHeader: string;
  amountDueHeader: string;
  tipHeader: string;

  static fromJSON(jsonTemplate, defaultTemplate): TotalsTemplateModel {
    const settings: TotalsTemplateModel = Object.assign(new TotalsTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.totals = jsonTemplate.totals;
    settings.subtotalHeader = jsonTemplate.subtotalHeader;
    settings.taxHeader = jsonTemplate.taxHeader;
    settings.discountHeader = jsonTemplate.discountHeader;
    settings.subtotalHeader = jsonTemplate.subtotalHeader;
    settings.shippingCostHeader = jsonTemplate.shippingCostHeader;
    settings.appliedAmountHeader = jsonTemplate.appliedAmountHeader;
    settings.amountDueHeader = jsonTemplate.amountDueHeader;
    settings.totalHeader = jsonTemplate.totalHeader;
    settings.tipHeader = jsonTemplate.tipHeader;
    return settings;
  }

  static toMap(instance: TotalsTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('totals', instance.totals);
    map.set('subtotalHeader', instance.subtotalHeader);
    map.set('taxHeader', instance.taxHeader);
    map.set('discountHeader', instance.discountHeader);
    map.set('shippingCostHeader', instance.shippingCostHeader);
    map.set('appliedAmountHeader', instance.appliedAmountHeader);
    map.set('amountDueHeader', instance.amountDueHeader);
    map.set('totalHeader', instance.totalHeader);
    map.set('tipHeader', instance.tipHeader);
    return map;
  }
}

export class CustomerMemoTemplateModel extends InvoiceComponentTemplateModel {
  static fromJSON(jsonTemplate, defaultTemplate) {
    return Object.assign(new CustomerMemoTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
  }

}

export class TextTemplateModel {
  id: string;
  content: string;


  constructor(id: string, content?: string) {
    this.id = id;
    this.content = content ?? `<span class="ql-size-14px">INVOICE</span>`;
  }

  static fromJSON(jsonTemplate) {
    return new TextTemplateModel(jsonTemplate.id, jsonTemplate.content);
  }

  static toMap(instance: TextTemplateModel): Map<string, any> {
    const map = new Map();
    map.set('id', instance.id);
    map.set('content', instance.content);
    return map;
  }
}

export class ShippingInfoTemplateModel extends InvoiceComponentTemplateModel {
  shipMethodHeader: string;
  trackingNumberHeader: string;
  shipDateHeader: string;

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new ShippingInfoTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.shipMethodHeader = jsonTemplate.shipMethodHeader;
    settings.trackingNumberHeader = jsonTemplate.trackingNumberHeader;
    settings.shipDateHeader = jsonTemplate.shipDateHeader;
    return settings;
  }

  static toMap(instance: ShippingInfoTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('shipMethodHeader', instance.shipMethodHeader);
    map.set('trackingNumberHeader', instance.trackingNumberHeader);
    map.set('shipDateHeader', instance.shipDateHeader);
    return map
  }
}

export class CustomerNameTemplateModel extends InvoiceComponentTemplateModel {
  id: string;
  customerNameId: string;
  customerNameHeader: string;

  static fromJSON(jsonTemplate, defaultTemplate) {
    const settings = Object.assign(new CustomerNameTemplateModel(), InvoiceComponentTemplateModel.fromJSON(jsonTemplate, defaultTemplate));
    settings.id = jsonTemplate.id;
    settings.customerNameHeader = jsonTemplate.customerNameHeader;
    return settings;
  }

  static toMap(instance: CustomerNameTemplateModel): Map<string, any> {
    const map = super.toMap(instance);
    map.set('id', instance.id);
    map.set('customerNameHeader', instance.customerNameHeader);
    return map
  }
}
