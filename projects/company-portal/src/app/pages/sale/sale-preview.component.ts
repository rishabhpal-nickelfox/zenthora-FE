import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit} from "@angular/core";
import {SaleService} from "../../../services/sale/sale.service";
import {SalePreviewViewModel} from "../../../../../common/src/lib/models/sale/preview/sale-preview-view.model";
import {finalize} from "rxjs/operators";
import {SalePrintService, DocTypeEnum, DocTypeEnumValue} from "@eps/common";
import {SaleModel} from "../../../../../common/src/lib/models/sale/sale-model";
import {DetailViewComponent} from "../../../../../common/src/lib/pages/detail-view.component";

@Component({
  standalone: false,
  selector: 'app-sale-preview',
  templateUrl: './sale-preview.component.html',
  styleUrls: [],
  providers: [SalePrintService],
  outputs: ['cancelEvent']
})
export class SalePreviewComponent extends DetailViewComponent implements OnInit {

  salePreviewModel: SalePreviewViewModel;
  readonly DocTypeEnumValue = DocTypeEnumValue;
  loading = false;

  constructor(protected elementRef: ElementRef, protected saleService: SaleService, protected cd: ChangeDetectorRef) {
    super(elementRef);
  }

  private _docId: string;

  get docId(): string {
    return this._docId;
  }

  private _docType: DocTypeEnum;

  get docType(): DocTypeEnum {
    return this._docType;
  }

  ngOnInit(): void {
  }

  protected onReInit(sale: SaleModel) {
    this._docId = sale.docId;
    this._docType = sale.docType;

    this.loading = true;
    this.subscriptions.add(
      this.saleService.getAdditionalInfo(sale.id).pipe(finalize(() => {
        this.loading = false;
        this.cd.detectChanges();
      })).subscribe(result => {
        this.salePreviewModel = result;
      })
    );
  }
}
