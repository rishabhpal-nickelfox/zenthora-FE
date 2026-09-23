import {AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken, Injector, NgZone, OnInit, Optional, Type, ViewChild} from '@angular/core';
import {GridsterComponent, GridsterConfig} from 'angular-gridster2';
import {InvoiceEmailTemplateLayoutService} from './invoice-email-template-layout.service';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {InvoiceItemsEditTableTemplateComponent} from './items/full/invoice-items-edit-table-template.component';
import {SafeHtml} from '@angular/platform-browser';
import {InvoiceItemsTableTemplateLayoutService} from './items/full/invoice-items-table-template-layout.service';
import {InvoiceFullInfoViewService} from './invoiceinfo/full/invoice-full-info-view.service';
import {InvoiceFullInfoEditComponent} from './invoiceinfo/full/invoice-full-info-edit.component';
import {InvoiceShortInfoViewService} from './invoiceinfo/short/invoice-short-info-view.service';
import {InvoiceShortInfoEditComponent} from './invoiceinfo/short/invoice-short-info-edit.component';
import {InvoiceAdditionalInfoLayoutService} from './invoiceinfo/additional/invoice-additional-info-layout.service';
import {InvoiceAdditionalInfoEditComponent} from './invoiceinfo/additional/invoice-additional-info-edit.component';
import {CustomerBillingAddressViewService} from './billing/customer-billing-address-view.service';
import {CustomerBillingAddressEditComponent} from './billing/customer-billing-address-edit.component';
import {CustomerShippingAddressEditComponent} from './shipping/address/customer-shipping-address-edit.component';
import {ShippingAddressViewService} from './shipping/address/shipping-address-view.service';
import {CompanyInfoViewService} from './companyinfo/company-info-view.service';
import {CompanyInfoEditComponent} from './companyinfo/company-info-edit.component';
import {InvoiceEmailTemplateViewCommonService} from './invoice-email-template-view-common.service';
import {LineViewService} from './line/line-view.service';
import {LineEditComponent} from './line/line-edit.component';
import {InvoiceItemRowsTemplateLayoutService} from './items/rows/invoice-item-rows-template-layout.service';
import {InvoiceItemRowsEditComponent} from './items/rows/invoice-item-rows-edit.component';
import {CustomerMemoViewService} from './customermemo/customer-memo-view.service';
import {CustomerMemoEditComponent} from './customermemo/customer-memo-edit.component';
import {TotalsViewService} from './items/totals/totals-view.service';
import {TotalsEditComponent} from './items/totals/totals-edit.component';
import {LogoViewService} from './logo/logo-view.service';
import {TextViewService} from './header/text-view.service';
import {TextEditComponent} from './header/text-edit.component';
import {ItemsGridLayoutCommonService} from './items/items-grid-layout-common.service';
import {ShippingInfoViewService} from './shipping/info/shipping-info-view.service';
import {ShippingInfoEditComponent} from './shipping/info/shipping-info-edit.component';
import {ComponentWithSubscriptions
} from "../../../components/component-with-subscriptions";
import {InvoiceEmailPaymentTemplateComponentsEnum,
  InvoiceEmailPaymentTemplateComponentsEnumValue,
  InvoiceEmailPaymentTemplateComponentsMultiple
} from "../../../enums/sale/invoice-email-payment-template-components.enum";
import {GridAreaModel,
  InvoiceTemplateModel
} from "../../../models/sale/template/invoice-template.model";
import {EDITOR_USERNAME} from "./editor-username.token";
import {SYSTEM_PREFIX} from "../../../common-environment";
import {ObjectHelper} from "../../../helpers/object.helper";
import {InvoiceEmailPaymentTemplateLogoSizeEnum,
  InvoiceEmailPaymentTemplateLogoSizeEnumName
} from "../../../enums/sale/invoice-email-payment-template-logo-size.enum";
import {AddressModel} from "../../../models/common/address.model";
import {CompanyContactInfoModel as ContactInfoModel} from "../../../models/sale/template/company-contact-info.model";
import {NbDialogService} from "@nebular/theme";
import {CustomFieldsTableTemplateLayoutService} from "./customfields/custom-fields-table-template-layout.service";
import {CustomFieldsTableTemplateComponent} from "./customfields/custom-fields-table-template.component";
import {CustomerNameViewService} from "./customername/customer-name-view.service";
import {CustomerNameEditComponent} from "./customername/customer-name-edit.component";
import {DOMHelper} from "../../../helpers/dom.helper";
import {GridsterItem} from "angular-gridster2/lib/gridsterItem.interface";
import {HtmlSanitizerService} from '../../../utils/html-sanitizer.service';
import {getScrollBehavior} from '../../../helpers/dom.helper';

export const TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE = new InjectionToken<any>('TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE');
export const TEMPLATE_EDIT_COMPONENT_ID = new InjectionToken<string>('TEMPLATE_EDIT_COMPONENT_ID');

export interface TemplateComponentContext {
  context: InvoiceEmailPaymentTemplateComponent;
  itemId: InvoiceEmailPaymentTemplateComponentsEnum;
  id: string;
  editButtonId: string;
  editFunction: (...args: any[]) => any;
  deleteFunction: (...args: any[]) => any;
}

@Component({
  standalone: false,
  selector: 'app-invoice-email-payment-template',
  templateUrl: './invoice-email-payment-template.component.html',
  styleUrls: ['./invoice-email-payment-template.component.scss'],
  providers: [InvoiceEmailTemplateLayoutService, InvoiceItemsTableTemplateLayoutService, InvoiceFullInfoViewService,
    CustomFieldsTableTemplateLayoutService,
    InvoiceShortInfoViewService, InvoiceAdditionalInfoLayoutService,
    CustomerBillingAddressViewService, ShippingAddressViewService,
    CompanyInfoViewService, LineViewService, InvoiceItemRowsTemplateLayoutService,
    CustomerMemoViewService, CustomerNameViewService,
    TotalsViewService, LogoViewService, TextViewService, ShippingInfoViewService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceEmailPaymentTemplateComponent extends ComponentWithSubscriptions implements OnInit, AfterViewChecked {
  showGrid;
  @ViewChild('grid') grid: GridsterComponent;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnum = InvoiceEmailPaymentTemplateComponentsEnum;
  private cookieName;
  static readonly HIDE_GRID_KEY: string = 'HIDE_GRID';
  styles: SafeHtml;
  private defaultEmailPaymentTemplate: InvoiceTemplateModel;
  private addedItem: GridsterItem;


  constructor(private _layoutService: InvoiceEmailTemplateLayoutService,
    private invoiceItemsTableTemplateLayoutService: InvoiceItemsTableTemplateLayoutService,
    private invoiceItemRowsTemplateLayoutService: InvoiceItemRowsTemplateLayoutService,
    private customFieldsTableTemplateLayoutService: CustomFieldsTableTemplateLayoutService,
    private invoiceFullInfoViewService: InvoiceFullInfoViewService,
    private invoiceShortInfoViewService: InvoiceShortInfoViewService,
    private invoiceAdditionalInfoViewService: InvoiceAdditionalInfoLayoutService,
    private billingAddressViewService: CustomerBillingAddressViewService,
    private shippingAddressViewService: ShippingAddressViewService,
    private shippingInfoViewService: ShippingInfoViewService,
    private companyInfoViewService: CompanyInfoViewService,
    private lineViewService: LineViewService,
    private customerMemoViewService: CustomerMemoViewService,
    private customerNameViewService: CustomerNameViewService,
    private totalsViewService: TotalsViewService,
    private logoViewService: LogoViewService,
    private headerViewService: TextViewService,
    protected ch: ChangeDetectorRef,
    @Optional() @Inject(EDITOR_USERNAME) private editorUsername: string | null,
    protected modalService: NgbModal,
    private dialogService: NbDialogService,
    private zone: NgZone,
    private injector: Injector,
              private readonly htmlSanitizer: HtmlSanitizerService) {
    super();
  }

  private _companyInfo: {
    displayName: string;
    address: AddressModel;
    contactInfo: ContactInfoModel;
    logo: {
      value: string,
      type: string
    },
    customFieldsEnabled: boolean;
    advancedFieldsEnabled: boolean;
  };

  get companyInfo() {
    return this._companyInfo;
  }

  set companyInfo(companyInfo) {
    this._companyInfo = companyInfo;
    this.companyInfoViewService.companyInfo = this._companyInfo;
    this.logoViewService.logo = companyInfo.logo;
    this.invoiceItemsTableTemplateLayoutService.customerMemo = this.customerMemoViewService.customerMemo;
    this.layoutService.customFieldsEnabled = companyInfo.customFieldsEnabled;
    this.layoutService.advancedFieldsEnabled = companyInfo.advancedFieldsEnabled;

    this.updateStyles();
  }

  get options(): GridsterConfig {
    return this.layoutService.options;
  }

  get layout(): GridAreaModel[] {
    return this.layoutService.layout;
  }

  get layoutService() {
    return this._layoutService;
  }

  get template(): InvoiceTemplateModel {
    return {
      version: this.layoutService.version,
      components: this.layout,
      titleColor: this.layoutService.titleColor,
      colorEven: this.layoutService.colorEven,
      colorOdd: this.layoutService.colorOdd,
      fontColor: this.layoutService.fontColor,
      fontSize: this.layoutService.fontSize,
      lineHeight: this.layoutService.lineHeight,
      logoSize: this.layoutService.logoSize,
      borderColor: this.layoutService.borderColor,
      gridGap: this.layoutService.gridGap,
      minimizeVerticalSize: this.layoutService.minimizeVerticalSize,
      //Saving into the new flexible layout
      legacyLayout: false,
      saleFullInfoTemplate: this.invoiceFullInfoViewService.template,
      itemTableTemplate: this.invoiceItemsTableTemplateLayoutService.template,
      itemsRowsTemplate: this.invoiceItemRowsTemplateLayoutService.template,
      saleShortInfoTemplate: this.invoiceShortInfoViewService.template,
      saleAdditionalInfoTemplates: this.invoiceAdditionalInfoViewService.templates,
      customFieldsTemplates: this.customFieldsTableTemplateLayoutService.templates,
      billToTemplate: this.billingAddressViewService.template,
      shipToTemplate: this.shippingAddressViewService.template,
      shippingInfoTemplate: this.shippingInfoViewService.template,
      companyInfoTemplates: this.companyInfoViewService.templates,
      lineTemplates: this.lineViewService.templates,
      customerMemoTemplate: this.customerMemoViewService.template,
      customerNameTemplates: this.customerNameViewService.templates,
      totalsTemplate: this.totalsViewService.template,
      textTemplates: this.headerViewService.templates
    };
  }

  get logo() {
    return this.companyInfo && this.companyInfo.logo ? this.companyInfo.logo : null;
  }

  reInit(data: {
    emailPaymentTemplate: InvoiceTemplateModel, defaultEmailPaymentTemplate: InvoiceTemplateModel, companyInfo: {
      displayName: string;
      address: AddressModel;
      contactInfo: ContactInfoModel;
      logo: {
        value: string,
        type: string
      },
      customFieldsEnabled: boolean;
      advancedFieldsEnabled: boolean;
    },
    availableCustomFieldNames?: string[]
  }) {
    if (data.emailPaymentTemplate) {
      this.customFieldsTableTemplateLayoutService.availableCustomFieldNames = data.availableCustomFieldNames ?? [];
      this.layoutService.layout = data.emailPaymentTemplate.components;
      this.defaultEmailPaymentTemplate = data.defaultEmailPaymentTemplate;
      this.companyInfo = data.companyInfo;
      this.invoiceItemsTableTemplateLayoutService.initTemplate(data.emailPaymentTemplate.itemTableTemplate, data.emailPaymentTemplate);
      this.invoiceItemRowsTemplateLayoutService.initTemplate(data.emailPaymentTemplate.itemsRowsTemplate, data.emailPaymentTemplate);
      this.invoiceFullInfoViewService.initTemplate(data.emailPaymentTemplate.saleFullInfoTemplate, data.emailPaymentTemplate);
      this.invoiceShortInfoViewService.initTemplate(data.emailPaymentTemplate.saleShortInfoTemplate, data.emailPaymentTemplate);
      this.invoiceAdditionalInfoViewService.initTemplates(data.emailPaymentTemplate.saleAdditionalInfoTemplates, data.emailPaymentTemplate, this.defaultEmailPaymentTemplate.saleAdditionalInfoTemplates[0]);
      this.billingAddressViewService.initTemplate(data.emailPaymentTemplate.billToTemplate, data.emailPaymentTemplate);
      this.shippingAddressViewService.initTemplate(data.emailPaymentTemplate.shipToTemplate, data.emailPaymentTemplate);
      this.companyInfoViewService.initTemplates(data.emailPaymentTemplate.companyInfoTemplates, data.emailPaymentTemplate);
      this.lineViewService.initTemplates(data.emailPaymentTemplate.lineTemplates, this.defaultEmailPaymentTemplate.fontColor);
      this.customerMemoViewService.initTemplate(data.emailPaymentTemplate.customerMemoTemplate, data.emailPaymentTemplate);
      this.customerNameViewService.initTemplates(data.emailPaymentTemplate.customerNameTemplates, data.emailPaymentTemplate);
      this.totalsViewService.initTemplate(data.emailPaymentTemplate.totalsTemplate, data.emailPaymentTemplate);
      this.logoViewService.initTemplate(this.companyInfo.logo, data.emailPaymentTemplate.logoSize);
      this.headerViewService.initTemplates(data.emailPaymentTemplate.textTemplates, this.defaultEmailPaymentTemplate.fontColor);
      this.shippingInfoViewService.initTemplate(data.emailPaymentTemplate.shippingInfoTemplate, data.emailPaymentTemplate)
      this.customFieldsTableTemplateLayoutService.initTemplates(data.emailPaymentTemplate.customFieldsTemplates, data.emailPaymentTemplate);
      this.layoutService.initSettings(data.emailPaymentTemplate);
      this.updateStyles();
    }
  }

  ngOnInit() {
    this.cookieName = SYSTEM_PREFIX + InvoiceEmailPaymentTemplateComponent.HIDE_GRID_KEY + (this.editorUsername || '');
    this.showGrid = !ObjectHelper.isDefined(localStorage.getItem(this.cookieName));
    this.updateStyles();
    this.subscriptions.add(
      this.layoutService.settingsChanged.subscribe(() => {
        this.updateStyles();
      })
    );
    this.subscriptions.add(
      this.layoutService.fontColorChanged.subscribe(() => {
        this.updateComponentsColor('fontColor');
      })
    );
    this.subscriptions.add(
      this.layoutService.colorEvenChanged.subscribe(() => {
        this.updateComponentsColor('colorEven');
      })
    );
    this.subscriptions.add(
      this.layoutService.colorOddChanged.subscribe(() => {
        this.updateComponentsColor('colorOdd');
      })
    );
    this.subscriptions.add(
      this.layoutService.titleColorChanged.subscribe(() => {
        this.updateComponentsColor('titleColor');
      })
    );
    this.subscriptions.add(
      this.layoutService.borderColorChanged.subscribe(() => {
        this.updateComponentsColor('borderColor');
      })
    );

    this.subscriptions.add(
      this.layoutService.logoSizeChanged.subscribe(() => {
        this.logoViewService.logoSize = this.layoutService.logoSize;
      })
    );
  }

  private get viewServices(): InvoiceEmailTemplateViewCommonService[] {
    return [this.invoiceItemsTableTemplateLayoutService,
      this.customFieldsTableTemplateLayoutService,
      this.invoiceFullInfoViewService,
      this.invoiceShortInfoViewService,
      this.invoiceAdditionalInfoViewService,
      this.billingAddressViewService,
      this.shippingAddressViewService,
      this.companyInfoViewService,
      this.invoiceItemRowsTemplateLayoutService,
      this.customerMemoViewService,
      this.customerNameViewService,
      this.totalsViewService,
      this.shippingInfoViewService];
  }

  customAddHandler: Record<string, () => void> = {
    [InvoiceEmailPaymentTemplateComponentsEnum.LINE]: () => this.addLine(),
    [InvoiceEmailPaymentTemplateComponentsEnum.TEXT]: () => this.addText(),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS]: () => this.addCustomFields(),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME]: () => this.addCustomerName(),
    [InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO]: () => this.addCompanyInfo(),
    [InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL]: () => this.addSaleAdditionalInfo()
  };

  customEditHandler: Record<string, (ctx: any, id: string, event: Event, btnId: string) => void> = {
    [InvoiceEmailPaymentTemplateComponentsEnum.LINE]: this.editLine.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.TEXT]: this.editText.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS]: this.editCustomFields.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME]: this.editCustomerName.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO]: this.editCompanyInfo.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL]: this.editSaleAdditionalInfo.bind(this)
  };

  customDeleteHandler: Record<string, (ctx: any, event: Event, id: string) => void> = {
    [InvoiceEmailPaymentTemplateComponentsEnum.LINE]: this.deleteLine.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.TEXT]: this.deleteText.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS]: this.deleteCustomFields.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME]: this.deleteCustomerName.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.COMPANY_INFO]: this.deleteCompanyInfo.bind(this),
    [InvoiceEmailPaymentTemplateComponentsEnum.SALE_ADDITIONAL]: this.deleteSaleAdditionalInfo.bind(this)
  };

  componentTemplateResetHandler: Record<string, () => void> = {
    [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS]: () => this.invoiceItemsTableTemplateLayoutService.initTemplate(this.defaultEmailPaymentTemplate.itemTableTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS]: () => this.invoiceItemRowsTemplateLayoutService.initTemplate(this.defaultEmailPaymentTemplate.itemsRowsTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.SALE_FULL_INFO]: () => this.invoiceFullInfoViewService.initTemplate(this.defaultEmailPaymentTemplate.saleFullInfoTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.SALE_SHORT_INFO]: () => this.invoiceShortInfoViewService.initTemplate(this.defaultEmailPaymentTemplate.saleShortInfoTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.BILLING_ADDRESS]: () => this.billingAddressViewService.initTemplate(this.defaultEmailPaymentTemplate.billToTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS]: () => this.shippingAddressViewService.initTemplate(this.defaultEmailPaymentTemplate.shipToTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO]: () => this.shippingInfoViewService.initTemplate(this.defaultEmailPaymentTemplate.shippingInfoTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_MEMO]: () => this.customerMemoViewService.initTemplate(this.defaultEmailPaymentTemplate.customerMemoTemplate, this.defaultEmailPaymentTemplate),
    [InvoiceEmailPaymentTemplateComponentsEnum.TOTALS]: () => this.totalsViewService.initTemplate(this.defaultEmailPaymentTemplate.totalsTemplate, this.defaultEmailPaymentTemplate)
  };

  private getItemId(item: GridsterItem) {
    return item.lineId || item.textId || item.customFieldsId || item.customerNameId || item.companyInfoId
      || item.saleAdditionalInfoId || item.id;

  }

  getContextForComponent(item: GridsterItem): TemplateComponentContext {
    const id = this.getItemId(item);
    const editFunction =
      this.customEditHandler[item.id] ?? this.editTemplate.bind(this);

    const deleteFunction =
      this.customDeleteHandler[item.id] ?? this.deleteComponent.bind(this);

    return {
      context: this,
      itemId: item.id,
      id,
      editButtonId: `EDIT_${item.id}_${id}`,
      editFunction,
      deleteFunction
    };
  }


  private updateComponentsColor(colorPropertyName: string) {
    this.viewServices.forEach(viewService => {
      viewService[colorPropertyName] = this.layoutService[colorPropertyName];
    });
    this.ch.detectChanges();
  }

  deleteComponent(context, $event, componentRef) {
    $event.preventDefault();
    $event.stopPropagation();
    context.layoutService.deleteItem(context.layoutService.layout, componentRef);
    context.ch.detectChanges();
    return false;
  }

  onShowGridChanged() {
    if (this.showGrid) {
      localStorage.setItem(this.cookieName, '1');
    } else {
      localStorage.removeItem(this.cookieName);
    }
    this.showGrid = !this.showGrid;
    this.ch.detectChanges();
  }

  handleAdd(componentId: string): void {
    const handler = this.customAddHandler[componentId];
    if (handler) {
      handler();
    } else {
      this.addItem(componentId);
    }
  }

  showAddButton(componentId: string): boolean {
    if (componentId === InvoiceEmailPaymentTemplateComponentsEnum.CUSTOM_FIELDS) {
      return this.layoutService.customFieldsEnabled;
    }
    if (componentId === InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO || componentId === InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME) {
      return this.layoutService.advancedFieldsEnabled;
    }
    const wasAdded = this.layoutService.wasAdded(this.layoutService.layout, componentId);
    const canAddMultiple = ObjectHelper.isDefined(InvoiceEmailPaymentTemplateComponentsMultiple.find(c => c == InvoiceEmailPaymentTemplateComponentsEnum[componentId]));
    return !wasAdded || canAddMultiple;
  }


  addLine() {
    const lineId = this.lineViewService.createLine(this.defaultEmailPaymentTemplate.fontColor);
    this.addedItem = this.layoutService.addLine(lineId);
    this.ch.detectChanges();
  }

  addText() {
    const textId = this.headerViewService.createText();
    this.addedItem = this.layoutService.addText(textId);
    this.ch.detectChanges();
  }

  addCustomFields() {
    const customFieldsId = this.customFieldsTableTemplateLayoutService.createCustomFields(this.defaultEmailPaymentTemplate);
    this.addedItem = this.layoutService.addCustomFields(customFieldsId);
    this.ch.detectChanges();
  }

  addCustomerName() {
    const customerNameId = this.customerNameViewService.createTemplate(this.defaultEmailPaymentTemplate);
    this.addedItem = this.layoutService.addCustomerName(customerNameId);
    this.ch.detectChanges();
  }

  addCompanyInfo() {
    const companyInfoId = this.companyInfoViewService.createCompanyInfoTemplate();
    this.addedItem = this.layoutService.addCompanyInfo(companyInfoId);
    this.ch.detectChanges();
  }

  addSaleAdditionalInfo() {
    const additionalInfoId = this.invoiceAdditionalInfoViewService.createAdditionalInfoTemplate();
    this.addedItem = this.layoutService.addSaleAdditionalInfo(additionalInfoId);
    this.ch.detectChanges();
  }

  addItem(componentId: string) {
    if (this.defaultEmailPaymentTemplate) {
      this.componentTemplateResetHandler[componentId]?.();
    }
    this.addedItem = this.layoutService.addItem(this.layoutService.layout, componentId);
    this.ch.detectChanges();
  }

  private updateStyles(): void {
    this.styles = this.htmlSanitizer.trustHtml(`
                  <style>
                        .gridster * {
                        font-size: ${this.layoutService.fontSize}pt;
                        line-height: ${this.layoutService.lineHeight}
                        }
                  </style>
                `);
    this.ch.detectChanges();
  }


  protected get InvoiceEmailPaymentTemplateLogoSizeEnumKeys(): string[] {
    return Object.keys(InvoiceEmailPaymentTemplateLogoSizeEnum);
  }

  protected getInvoiceEmailPaymentTemplateLogoSizeEnumName(size: string) {
    return InvoiceEmailPaymentTemplateLogoSizeEnumName.get(size);
  }

  public resetToDefaults(): boolean {
    this.reInit(
      {
        emailPaymentTemplate: this.defaultEmailPaymentTemplate,
        defaultEmailPaymentTemplate: this.defaultEmailPaymentTemplate,
        companyInfo: this._companyInfo
      });
    return false;
  }

  editTemplate(context, itemId: InvoiceEmailPaymentTemplateComponentsEnum, $event, editButtonId: string) {
    $event.preventDefault();
    $event.stopPropagation();
    document.getElementById(editButtonId).focus({preventScroll: true});
    switch (itemId) {
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_FULL_INFO:
        context.openEditTemplateModal(itemId, InvoiceFullInfoEditComponent, context.invoiceFullInfoViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.ITEMS:
        context.openEditTemplateModal(itemId, InvoiceItemsEditTableTemplateComponent, context.invoiceItemsTableTemplateLayoutService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.ITEMS_ROWS:
        context.openEditTemplateModal(itemId, InvoiceItemRowsEditComponent, context.invoiceItemRowsTemplateLayoutService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.TOTALS:
        context.openEditTemplateModal(itemId, TotalsEditComponent, context.totalsViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.SALE_SHORT_INFO:
        context.openEditTemplateModal(itemId, InvoiceShortInfoEditComponent, context.invoiceShortInfoViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.BILLING_ADDRESS:
        context.openEditTemplateModal(itemId, CustomerBillingAddressEditComponent, context.billingAddressViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_ADDRESS:
        context.openEditTemplateModal(itemId, CustomerShippingAddressEditComponent, context.shippingAddressViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_MEMO:
        context.openEditTemplateModal(itemId, CustomerMemoEditComponent, context.customerMemoViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.CUSTOMER_NAME:
        context.openEditTemplateModal(itemId, CustomerNameEditComponent, context.customerNameViewService);
        break;
      case InvoiceEmailPaymentTemplateComponentsEnum.SHIPPING_INFO:
        context.openEditTemplateModal(itemId, ShippingInfoEditComponent, context.shippingInfoViewService);
        break;
    }
    return false;
  }

  private getRenderedBlockWidth(itemId): number {
    const block = this.grid?.grid?.find(i => i.item.id === itemId);
    const content = block?.el?.querySelector('.email-item') as HTMLElement;
    return content?.clientWidth || this.layoutService.getComponentRenderWidth(itemId);
  }

  private openEditTemplateModal(itemId, editComponent, viewService) {
    const modalOptions: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static'
    };
    if (viewService instanceof ItemsGridLayoutCommonService) {
      modalOptions.windowClass = 'qbo-items-modal';
      viewService.setRenderWidth(this.getRenderedBlockWidth(itemId));
      viewService.setRenderTypography(this.layoutService.fontSize, this.layoutService.lineHeight);
      modalOptions.injector = Injector.create({
        parent: this.injector,
        providers: [{provide: viewService.constructor as Type<any>, useValue: viewService}]
      });
    }
    const modalRef = this.modalService.open(editComponent, modalOptions);
    modalRef.componentInstance.viewService = viewService;
    modalRef.result.then(result => {
      const item = this.grid.grid.find(i => i.item.id == itemId);
      this.layoutService.enforceMinimumCols(item);
      this.ch.detectChanges();
    }, reason => {
    });
    return false;
  }


  editLine(context, lineId: string, $event, editButtonId: string) {
    DOMHelper.stopEvent($event);
    DOMHelper.focusById(editButtonId);
    this.openNgbEditModal(context, LineEditComponent, context.lineViewService, lineId, {backdrop: 'static'});
    return false;
  }

  editText(context, textId: string, $event, editButtonId: string) {
    DOMHelper.stopEvent($event);
    DOMHelper.focusById(editButtonId);
    this.openNbDialogEdit(context, TextEditComponent, context.headerViewService, textId);
    return false;
  }

  editCustomFields(context, customFieldsId: string, $event, editButtonId: string) {
    DOMHelper.stopEvent($event);
    DOMHelper.focusById(editButtonId);
    this.openNgbEditModal(context, CustomFieldsTableTemplateComponent, context.customFieldsTableTemplateLayoutService, customFieldsId, {
      backdrop: 'static', size: 'lg'
    });
    return false;
  }

  editCustomerName(context, customerNameId: string, $event, editButtonId: string) {
    DOMHelper.stopEvent($event);
    DOMHelper.focusById(editButtonId);
    this.openNgbEditModal(context, CustomerNameEditComponent, context.customerNameViewService, customerNameId, {
      backdrop: 'static', size: 'lg'
    });
    return false;
  }

  editCompanyInfo(context, companyInfoId: string, $event, editButtonId: string) {
    DOMHelper.stopEvent($event);
    DOMHelper.focusById(editButtonId);
    this.openNgbEditModal(context, CompanyInfoEditComponent, context.companyInfoViewService, companyInfoId, {
      backdrop: 'static', size: 'lg'
    });
    return false;
  }

  editSaleAdditionalInfo(context, additionalInfoId: string, $event, editButtonId: string) {
    DOMHelper.stopEvent($event);
    DOMHelper.focusById(editButtonId);
    this.openNgbEditModal(context, InvoiceAdditionalInfoEditComponent, context.invoiceAdditionalInfoViewService, additionalInfoId, {
      backdrop: 'static', size: 'lg'
    });
    return false;
  }

  deleteLine(context, $event, lineId) {
    DOMHelper.stopEvent($event);
    context.lineViewService.initTemplates(context.lineViewService.templates.filter(line => line.id != lineId), context.defaultEmailPaymentTemplate.fontColor);
    context.layoutService.deleteLine(lineId);
    context.ch.detectChanges();
    return false;
  }

  deleteText(context, $event, textId) {
    DOMHelper.stopEvent($event);
    context.headerViewService.initTemplates(context.headerViewService.templates.filter(text => text.id != textId), context.defaultEmailPaymentTemplate.fontColor);
    context.layoutService.deleteText(textId);
    context.ch.detectChanges();
    return false;
  }


  deleteCustomFields(context, $event, customFieldsId) {
    DOMHelper.stopEvent($event);
    context.customFieldsTableTemplateLayoutService.initTemplates(context.customFieldsTableTemplateLayoutService.templates.filter(customFields => customFields.id != customFieldsId), context.defaultEmailPaymentTemplate);
    context.layoutService.deleteCustomFields(customFieldsId);
    context.ch.detectChanges();
    return false;
  }

  deleteCustomerName(context, $event, customerNameId) {
    DOMHelper.stopEvent($event);
    context.customerNameViewService.initTemplates(context.customerNameViewService.templates.filter(customerName => customerName.id != customerNameId), context.defaultEmailPaymentTemplate);
    context.layoutService.deleteCustomerName(customerNameId);
    context.ch.detectChanges();
    return false;
  }

  deleteCompanyInfo(context, $event, companyInfoTemplateId: string) {
    DOMHelper.stopEvent($event);
    context.companyInfoViewService.initTemplates(context.companyInfoViewService.templates.filter(companyInfoTemplate => companyInfoTemplate.id != companyInfoTemplateId), context.defaultEmailPaymentTemplate);
    context.layoutService.deleteCompanyInfo(companyInfoTemplateId);
    context.ch.detectChanges();
    return false;
  }

  deleteSaleAdditionalInfo(context, $event, additionalInfoId: string) {
    DOMHelper.stopEvent($event);
    context.invoiceAdditionalInfoViewService.initTemplates(context.invoiceAdditionalInfoViewService.templates.filter(invoiceAdditionalInfoTemplate => invoiceAdditionalInfoTemplate.id != additionalInfoId), context.defaultEmailPaymentTemplate, this.defaultEmailPaymentTemplate.saleAdditionalInfoTemplates[0]);
    context.layoutService.deleteSaleAdditionalInfo(additionalInfoId);
    context.ch.detectChanges();
    return false;
  }

  private getEmailTemplateHTMLElement(id: string) {
    const elements = document.getElementsByClassName('email-item');
    return Array.from(elements).find(element => element.getAttribute('id') == id);
  }

  private scrollToElement(componentId: string): void {
    this.zone.runOutsideAngular(() => {
      const scrollContainer = document.documentElement || document.body;
      const gap = 50;
      const maxRetries = 10;
      let attempts = 0;

      const interval = setInterval(() => {
        const targetElement = this.getEmailTemplateHTMLElement(componentId);
        if (targetElement) {
          clearInterval(interval);

          const targetPosition = targetElement.getBoundingClientRect().top + scrollContainer.scrollTop - gap;
          scrollContainer.scrollTo({
            top: targetPosition,
            behavior: getScrollBehavior()
          });
        } else if (attempts >= maxRetries) {
          clearInterval(interval);
          console.debug(`Element not found ${componentId}`);
        }
        attempts++;
      }, 100);
    });
  }

  ngAfterViewChecked() {
    if (this.addedItem) {
      const id = this.getItemId(this.addedItem);
      this.addedItem = null;

      this.scrollToElement(id);

      setTimeout(() => {
        const comp = this.grid.grid.find(c => this.getItemId(c.item) === id);

        if (comp) {
          this.layoutService.enforceRowsToContent(comp);
        }
      }, 100);
    }
  }


  openNgbEditModal<T>(
    context: any,
    component: Type<T>,
    viewService: any,
    entityId: string,
    options: NgbModalOptions = {backdrop: 'static'}
  ) {
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {provide: TEMPLATE_EDIT_COMPONENT_VIEW_SERVICE, useValue: viewService},
        {provide: TEMPLATE_EDIT_COMPONENT_ID, useValue: entityId},
      ],
    });
    const modalRef = this.modalService.open(component, {...options, injector});
    modalRef.result.finally(() => context.ch.detectChanges());
  }

  openNbDialogEdit(
    context: any,
    component: any,
    viewService: any,
    entityId: string,
    dialogOpts: any = {}
  ) {
    const modalRef = context.dialogService.open(component, {
      context: {
        viewService,
        afterInit: () => {
          modalRef.componentRef.instance.reInit(entityId);
        }
      },
      closeOnBackdropClick: false,
      hasBackdrop: true,
      hasScroll: true,
      dialogClass: 'top-dialog',
      ...dialogOpts
    });
    modalRef.onClose.subscribe(() => context.ch.detectChanges());
  }

  onMinimizeVerticalSizeChanges(minimizeVerticalSize: boolean) {
    this.layoutService.minimizeVerticalSize = minimizeVerticalSize;
    this.layoutService.enforceRowsToAll(this.grid);
  }

  onFontSizeChanges(fontSize: number) {
    this.layoutService.fontSize = fontSize;
    this.layoutService.enforceRowsToAll(this.grid);
  }

  onLineHeightChanges(lineHeight: number) {
    this.layoutService.lineHeight = lineHeight;
    this.layoutService.enforceRowsToAll(this.grid);
  }

  protected readonly Object = Object;
  protected readonly InvoiceEmailPaymentTemplateComponentsEnumValue = InvoiceEmailPaymentTemplateComponentsEnumValue;
}
