import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from "@angular/core";
import {SalePreviewViewModel} from "../../../../common/src/lib/models/sale/preview/sale-preview-view.model";
import {finalize, map} from "rxjs/operators";
import {DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {DetailViewComponent} from "../../../../common/src/lib/pages/detail-view.component";
import {ActivatedRoute} from "@angular/router";
import {SETTINGS_PROVIDER_TOKEN} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {SalePdfService} from "../../services/pdf/sale-pdf.service";
import {PaymentStatusEnum} from "../../../../common/src/lib/enums/sale/payment-status.enum";
import {SaleToPdfLabels} from "./sale-to-pdf-labels";
import {CustomerSettingsProvider} from "../../services/customer-settings-provider.service";
import {CustomerRoutingService} from "../../services/customer-routing.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {NbThemeService} from "@nebular/theme";

@Component({
  standalone: false,
  selector: 'app-sale-to-pdf',
  templateUrl: './sale-to-pdf.component.html',
  styleUrls: []
})
export class SaleToPdfComponent extends DetailViewComponent implements OnInit {

  salePreviewModel: SalePreviewViewModel;
  readonly DocTypeEnumValue = DocTypeEnumValue;
  loading = false;
  key: string;
  private _href: SafeUrl;

  constructor(protected elementRef: ElementRef, protected salePdfService: SalePdfService, protected router: ActivatedRoute, protected cd: ChangeDetectorRef,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: CustomerSettingsProvider,
              @Inject(ROUTING_SERVICE_TOKEN) private routingService: CustomerRoutingService,
              private sanitizer: DomSanitizer,
              private themeService: NbThemeService) {
    super(elementRef);
  }

  private _docType: DocTypeEnum;

  get docType(): DocTypeEnum {
    return this._docType;
  }

  ngOnInit(): void {
    console.log(this.themeService.currentTheme)
    this.reInit();
  }

  protected onReInit() {
    this.key = String(this.router.snapshot.paramMap.get('key'));
    this.subscriptions.add(
      this.salePdfService.getByKey(this.key).pipe(finalize(() => {
        this.cd.detectChanges();
      })).pipe(map(result => {
        this.salePreviewModel = result;
        this._docType = this.salePreviewModel.saleData.saleShortInfo.docType;
        this._href = this.sanitizer.bypassSecurityTrustUrl(`${this.settingsProvider.baseUrl}/pay/${this.key}`);

      }))
        .subscribe());
  }

  get showPayment(): boolean {
    return this.salePreviewModel?.status != PaymentStatusEnum.PAID && this.salePreviewModel?.status != PaymentStatusEnum.CANCELLED;
  }

  protected readonly Labels = SaleToPdfLabels;

  get href(): SafeUrl {
    return this._href;
  }

}
