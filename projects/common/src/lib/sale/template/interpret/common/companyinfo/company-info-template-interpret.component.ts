import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ComponentWithSubscriptions} from "../../../../../components/component-with-subscriptions";
import {CompanyInfoRowsEnum} from "../../../../../enums/sale/company-info-rows.enum";
import {isDefined} from "../../../../../helpers/object.helper";
import {CompanyInfoTemplateData} from "../../../../../models/sale/template/sale-email-template-data.model";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-company-info-template-interpret',
  templateUrl: './company-info-template-interpret.component.html'
})
export class CompanyInfoTemplateInterpretComponent extends ComponentWithSubscriptions implements OnInit {
  @Input() companyInfoRows: CompanyInfoRowsEnum[] = [];
  @Input() companyInfo: CompanyInfoTemplateData;

  protected readonly CompanyInfoRowsEnum = CompanyInfoRowsEnum;

  ngOnInit(): void {
  }

  isCompanyInfoRowPresented(column: string): boolean {
    return isDefined(this.companyInfoRows.find(c => c == column));
  }

  isAnyCompanyInfoRowPresented(columns: string[]): boolean {
    return isDefined(columns.find(column => this.isCompanyInfoRowPresented(column)));
  }

}
