import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from "@angular/core";
import {FormPageStateService} from "../../../../../../../../common/src/lib/utils/form-page-state.service";
import {ServerErrorService} from "../../../../../../../../common/src/lib/utils/server-error.service";
import {EntityModel} from "../../../../../models/companymanage/entity.model";
import {
  FieldValidationErrorService
} from "../../../../../../../../common/src/lib/utils/errorhandler/field-validation-error.service";
import {ErrorService} from "../../../../../../../../common/src/lib/utils/errorhandler/error.service";
import {EntityService} from "../../../../../../services/companymanagement/entity.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {catchError, finalize, map} from "rxjs/operators";
import {
  ApiTokenRevokeStatusEnum,
  ApiTokenRevokeStatusName
} from "../../../../../models/apitoken/api-token-revoke-status.enum";
import {CompanySettingsApiTokenCreateEditComponent} from "./company-settings-api-token-create-edit.component";
import {CompanySettingsApiTokenTableComponent} from "./company-settings-api-token-table.component";
import {ApiTokenModel} from "../../../../../models/apitoken/api-token.model";
import {ApiTokenService} from "../../../../../../services/apitoken/api-token.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExtendedTableFilter, ExtendedTableHeader} from "../../../../../../../../common/src/lib/table/table.component";
import {
  FilterIntegerInputComponent
} from "../../../../../../../../common/src/lib/table/filter/filter-integer-input.component";
import {FilterInputComponent} from "../../../../../../../../common/src/lib/table/filter/filter-input.component";
import {
  FilterTimestampRangeOpenBoundariesComponent
} from "../../../../../../../../common/src/lib/table/filter/filter-timestamp-range-open-boundaries.component";
import {FilterSelectComponent} from "../../../../../../../../common/src/lib/table/filter/filter-select.component";
import {isDefined} from "../../../../../../../../common/src/lib/helpers/object.helper";
import {ConfirmModalComponent} from "../../../../../../../../common/src/lib/modals/confirm/confirm-modal.component";
import {NbCardListPage} from "../../../../../../../../common/src/lib/pages/nb-card-list-page";
import {TableViewSettingsService} from "../../../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../../../services/company-table-view-settings.service";
import {ComponentCanDeactivate} from "../../../../../../../../common/src/lib/pages/can-deactivate.component";
import {Observable, throwError} from "rxjs";
import {
  BaseRoutingService,
  ROUTING_SERVICE_TOKEN
} from "../../../../../../../../common/src/lib/utils/base-routing.service";

import {DateTime} from 'luxon';

@Component({
  standalone: false,
  selector: 'app-company-settings-api-tokens',
  templateUrl: './company-settings-api-tokens.component.html',
  styleUrls: ['../../../../../../../../common/src/lib/table/table.component.scss', './company-settings-api-tokens.component.scss'],
  providers: [FormPageStateService, ServerErrorService, {
    provide: TableViewSettingsService,
    useClass: CompanyTableViewSettingsService,
    multi: false
  }]
})
export class CompanySettingsApiTokensComponent extends NbCardListPage implements OnInit, ComponentCanDeactivate {
  company: EntityModel;
  form;
  dictionaries;
  headers;
  filters;
  defaultStatusFilterValue = ApiTokenRevokeStatusEnum.ACTIVE.toString();
  showCreateEditForm = false;

  @ViewChild(CompanySettingsApiTokenCreateEditComponent, {static: true}) editComponent: CompanySettingsApiTokenCreateEditComponent;
  @ViewChild('table', {static: true}) protected table: CompanySettingsApiTokenTableComponent;
  private apiToken: ApiTokenModel;


  constructor(public formPageStateService: FormPageStateService,
              private fieldValidationErrorService: FieldValidationErrorService,
              protected elementRef: ElementRef,
              public errorService: ErrorService,
              private entityService: EntityService,
              public ch: ChangeDetectorRef,
              private _fb: FormBuilder,
              private apiTokenService: ApiTokenService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected modalService: NgbModal) {
    super(elementRef, routingService);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this.showCreateEditForm && this.editComponent.objectChanged());
  }

  ngOnInit(): void {
    this.reInit();
  }


  getForm(): FormGroup {
    return this.form;
  }


  initHeaders(): ExtendedTableHeader[] {
    return [
      new ExtendedTableHeader({key: 'ID', value: 'ID', sortProperty: 'id'}),
      new ExtendedTableHeader({key: 'NAME', value: 'Name', sortProperty: 'name'}),
      new ExtendedTableHeader({
        key: 'LAST_USE',
        value: 'Last use (' + DateTime.local().zoneName + ')',
        sortProperty: 'lastUse'
      }),
      new ExtendedTableHeader({key: 'STATUS', value: 'Status', sortProperty: null})
    ];
  }

  initFilters(): ExtendedTableFilter[] {
    return [
      {
        filterProperty: 'id',
        componentType: FilterIntegerInputComponent,
        componentParams: {placeholder: 'ID'}
      },
      {
        filterProperty: 'name',
        componentType: FilterInputComponent,
        componentParams: {placeholder: 'Name'}
      },
      {
        filterProperty: ['lastUseFrom', 'lastUseTo'],
        componentType: FilterTimestampRangeOpenBoundariesComponent,
        componentParams: {nullable: true}
      },
      {
        filterProperty: 'status',
        componentType: FilterSelectComponent,
        componentParams: {
          placeholder: 'All',
          options: Object.keys(ApiTokenRevokeStatusEnum),
          optionValueFunction: (value) => value,
          optionNameFunction: (value) => ApiTokenRevokeStatusName.get(value)
        }
      }
    ];
  }

  get service() {
    return this.apiTokenService;
  }

  onCreate() {
    this.apiToken = new ApiTokenModel();
    this.editComponent.reInit(this.apiToken);
    this.showCreateEditForm = true;
  }

  onEdit(apiToken) {
    if (this.isActive(apiToken)) {
      this.apiToken = apiToken;
      this.editComponent.reInit(this.apiToken);
      this.showCreateEditForm = true;
    } else {
      this.apiToken = null;
      this.showCreateEditForm = false;
    }
    return false;
  }

  onApiTokenSaved(model) {
    this.subscriptions.add(
      this.apiTokenService.save(model).pipe(finalize(() => {
        this.editComponent.afterSubmit();
      })).pipe(map(data => {
        this.apiToken.id = data.id;
        this.apiToken.name = model.name;
        this.apiToken.refreshToken = data.refreshToken;
        this.editComponent.reInit(this.apiToken);
        this.table.refresh();
      })).pipe(catchError(error => {
        this.fieldValidationErrorService.error(error, this.editComponent);
        return throwError(error);
      })).subscribe()
    );
  }

  onEditCancel(event) {
    this.showCreateEditForm = false;
  }

  isActive(rowData) {
    return !isDefined(rowData.revoked);
  }

  onShowRevokeDialog(rowData) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.header = 'Revoke Token';
    modalRef.componentInstance.body = `Are you sure you want to revoke Token ${rowData.name}?`;
    modalRef.componentInstance.okButtonText = 'Yes';
    modalRef.result.then(result => {
      this.subscriptions.add(
        this.apiTokenService.revoke(rowData.id).subscribe(success => {
          this.table.refresh();
        }));
    }, reason => {
    });
  }

  get showCreateButton(): boolean {
    return !this.tokenLimitExceeded && !this.showCreateEditForm;
  }

  get tokenLimitExceeded(): boolean {
    return isDefined(this.table.tokenLimit) && this.table.tokenLimit <= this.table.activeTokensCount;
  }

  reInit() {
    this.apiToken = new ApiTokenModel();
    this.headers = this.initHeaders();
    this.filters = this.initFilters();
    this.table.setStaticFilter('status', this.defaultStatusFilterValue);
  }
}
