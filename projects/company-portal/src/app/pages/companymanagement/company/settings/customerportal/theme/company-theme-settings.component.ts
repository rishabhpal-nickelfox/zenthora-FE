import {
  ExtendedTableFilter,
  ExtendedTableHeader
} from "../../../../../../../../../common/src/lib/table/table.component";
import moment from "moment";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterSelectComponent} from "../../../../../../../../../common/src/lib/table/filter/filter-select.component";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {FilterInputComponent} from "../../../../../../../../../common/src/lib/table/filter/filter-input.component";
import {
  PaymentSourceEnum,
  PaymentSourceEnumValue
} from "../../../../../../../../../common/src/lib/enums/sale/payment-source.enum";
import {
  TransactionPaymentMethodEnum,
  TransactionPaymentMethodEnumValue
} from "../../../../../../../../../common/src/lib/enums/sale/transaction-payment-method.enum";
import {
  FilterFloatInputComponent
} from "../../../../../../../../../common/src/lib/table/filter/filter-float-input.component";
import {
  TransactionPaymentStatusEnum,
  TransactionPaymentStatusEnumValue
} from "../../../../../../../../../common/src/lib/enums/sale/transaction-payment-status.enum";
import {CompanyLabels} from "../../../company-labels";
import {Component, ElementRef, Input, OnInit} from "@angular/core";
import {
  ComponentWithSubscriptions
} from "../../../../../../../../../common/src/lib/components/component-with-subscriptions";
import {TestService} from "./test.service";
import {EntityModel} from "../../../../../../models/companymanage/entity.model";
import {
  CustomerPageMenuService
} from "../../../../../../../../../customer-portal/src/services/customer-page-menu.service";
import {ThemeHelperService} from "../../../../../../../../../common/src/lib/helpers/theme-helper.service";
import {ObjectHelper} from "../../../../../../../../../common/src/lib/helpers/object.helper";

@Component({
  standalone: false,
  selector: 'app-company-theme-settings',
  templateUrl: './company-theme-settings.component.html',
  styleUrls: ['./company-theme-settings.component.scss']
})
export class CompanyThemeSettingsComponent extends ComponentWithSubscriptions implements OnInit {

  protected companyLogo: string;
  protected companyName: string;
  private _theme: Map<string, string>;
  private static readonly COMPANY_PREFIX = '--company-';

  @Input() set companyInfo(_companyInfo: EntityModel) {
    if (ObjectHelper.isDefined(_companyInfo)) {
      this.companyLogo = _companyInfo.logo && _companyInfo.logo.value ? 'data:' + _companyInfo.logo.type + ';base64,' + _companyInfo.logo.value : null;
      this.companyName = _companyInfo.legalName;
      if (_companyInfo.theme) {
        this.theme = _companyInfo.theme;
      }
    }
  }


  menuItems = [];

  constructor(protected testService: TestService, protected themeHelperService: ThemeHelperService, protected elementRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    this.theme = this.themeHelperService.getDefaultTheme();
    this.menuItems = CustomerPageMenuService.getFullArrayOfMenuTitles().map(title => {
      return {
        title: title,
        link: null
      }
    });

  }


  protected readonly Labels = CompanyLabels;

  headers = [];
  filters = [];


  initHeaders(): ExtendedTableHeader[] {
    const headers: ExtendedTableHeader[] = [];
    headers.push(new ExtendedTableHeader({
      key: 'TRANSACTION_TIMESTAMP',
      value: `Transaction Timestamp (${moment.tz.guess()})`,
      sortProperty: 'transactionTimestamp'
    }));
    headers.push(new ExtendedTableHeader({key: 'DOC_TYPE', value: 'Doc Type', sortProperty: 'docType'}));
    headers.push(new ExtendedTableHeader({key: 'DOC_NUMBER', value: 'Doc Number', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'SOURCE', value: 'Source', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'PAYMENT_METHOD', value: 'Payment Method', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'LAST4', value: 'Last 4', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'AMOUNT', value: 'Amount', sortProperty: 'amount'}));
    headers.push(new ExtendedTableHeader({key: 'STATUS', value: 'Status', sortProperty: null}));
    headers.push(new ExtendedTableHeader({key: 'AUTH_CODE', value: 'Auth Code', sortProperty: null}));
    return headers;
  }

  initFilters(): ExtendedTableFilter[] {
    const filters = [];
    filters.push(...[
      {
        filterProperty: ['transactionTimestampFrom', 'transactionTimestampTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {placeholder: "Date Range"}
      },
      {
        filterProperty: 'docType',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(DocTypeEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => DocTypeEnumValue.get(value)
        }
      },
      {
        filterProperty: 'docNumber',
        componentType: FilterInputComponent,
        componentParams: {placeholder: "Doc Number"}
      },
      {
        filterProperty: 'source',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(PaymentSourceEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => PaymentSourceEnumValue.get(value)
        }
      },
      {
        filterProperty: 'paymentMethod',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(TransactionPaymentMethodEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => TransactionPaymentMethodEnumValue.get(value)
        }
      },
      {
        filterProperty: 'last4',
        componentType: FilterInputComponent,
        componentParams: {placeholder: "Last 4"}
      },
      {
        filterProperty: 'amount',
        componentType: FilterFloatInputComponent,
        componentParams: {placeholder: "Amount"}
      },
      {
        filterProperty: 'status',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(TransactionPaymentStatusEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => TransactionPaymentStatusEnumValue.get(value)
        }
      },
      {
        filterProperty: 'authCode',
        componentType: FilterInputComponent,
        componentParams: {placeholder: "Auth Code"}
      }
    ]);

    return filters;
  }

  get themeBorderColor(): string {
    return this._theme.get('theme-border-color');
  }

  set themeBorderColor(value: string) {
    this._theme.set('theme-border-color', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-border-color`, value);
  }

  get themeFontColor2(): string {
    return this._theme.get('theme-font-color-2');
  }

  set themeFontColor2(value: string) {
    this._theme.set('theme-font-color-2', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-font-color-2`, value);
  }

  get themeFontColor(): string {
    return this._theme.get('theme-font-color');
  }

  set themeFontColor(value: string) {
    this._theme.set('theme-font-color', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-font-color`, value);
  }

  get themeBackgroundColor(): string {
    return this._theme.get('theme-background-color');
  }

  set themeBackgroundColor(value: string) {
    this._theme.set('theme-background-color', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-background-color`, value);
  }

  get themeColor5(): string {
    return this._theme.get('theme-color5');
  }

  set themeColor5(value: string) {
    this._theme.set('theme-color5', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-color5`, value);
  }

  get themeColor4(): string {
    return this._theme.get('theme-color4');
  }

  set themeColor4(value: string) {
    this._theme.set('theme-color4', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-color4`, value);
  }

  get themeColor3(): string {
    return this._theme.get('theme-color3');
  }

  set themeColor3(value: string) {
    this._theme.set('theme-color3', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-color3`, value);
  }

  get themeColor2(): string {
    return this._theme.get('theme-color2');
  }

  set themeColor2(value: string) {
    this._theme.set('theme-color2', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-color2`, value);
  }

  get themeColor1(): string {
    return this._theme.get('theme-color1');
  }

  set themeColor1(value: string) {
    this._theme.set('theme-color1', value);
    this.elementRef.nativeElement.style.setProperty(`${CompanyThemeSettingsComponent.COMPANY_PREFIX}theme-color1`, value);
  }

  get theme(): Map<string, string> {
    return this._theme;
  }

  set theme(theme: Map<string, string>){
    this._theme = new Map<string, string>();
    this.themeColor1 = theme.get('theme-color1');
    this.themeColor2 = theme.get('theme-color2');
    this.themeColor3 = theme.get('theme-color3');
    this.themeColor4 = theme.get('theme-color4');
    this.themeColor5 = theme.get('theme-color5');
    this.themeBackgroundColor = theme.get('theme-background-color');
    this.themeFontColor = theme.get('theme-font-color');
    this.themeFontColor2 = theme.get('theme-font-color-2');
    this.themeBorderColor = theme.get('theme-border-color');
  }

  resetToDefaults() {
    this.theme = this.themeHelperService.getDefaultTheme();
    return false;
  }
}
