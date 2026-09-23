import {UIKeyService} from '../../../../services/ui-key.service';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {UserSystemComponent} from './system/table/user-system.component';
import {UserCompanyComponent} from './company/table/user-company.component';
import {UserManagementUiKeyService} from '../../../../services/usermanagement/user-management-ui-key.service';
import {
  ComponentWithSubscriptions
} from "../../../../../../common/src/lib/components/component-with-subscriptions";
import {TableViewSettingsService} from "../../../../../../common/src/lib/utils/table-view-settings.service";
import {CompanyTableViewSettingsService} from "../../../../services/company-table-view-settings.service";
import {Observable} from "rxjs";
import {ComponentCanDeactivate} from "../../../../../../common/src/lib/pages/can-deactivate.component";
import {ObjectHelper} from "../../../../../../common/src/lib/helpers/object.helper";


@Component({
  standalone: false,
  selector: 'app-user',
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TableViewSettingsService,
      useClass: CompanyTableViewSettingsService,
      multi: false
    }
  ]
})
export class UserComponent extends ComponentWithSubscriptions implements OnInit, ComponentCanDeactivate {

  constructor(private uiKeyService: UIKeyService, private ch: ChangeDetectorRef, private userManagementUiKeyService: UserManagementUiKeyService) {
    super();
  }

  get showCompanyUser(): boolean {
    return this.userManagementUiKeyService.showUserManagement() && !this.uiKeyService.isSystemUserAdmin();
  }

  get showSystemUser(): boolean {
    return this.userManagementUiKeyService.showUserManagement() && this.uiKeyService.isSystemUserAdmin();
  }

  private _userSystemComponent;

  get userSystemComponent(): UserSystemComponent {
    return this._userSystemComponent;
  }

  @ViewChild(UserSystemComponent) set userSystemComponent(c: UserSystemComponent) {
    this._userSystemComponent = c;
  }


  private _userCompanyComponent;

  get userCompanyComponent(): UserCompanyComponent {
    return this._userCompanyComponent;
  }

  @ViewChild(UserCompanyComponent) set createEditComponent(c: UserCompanyComponent) {
    this._userCompanyComponent = c;
  }


  ngOnInit(): void {
    this.subscriptions.add(this.uiKeyService.uiKeysChanged.subscribe(() => this.ch.detectChanges()));
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.showSystemUser && ObjectHelper.isDefined(this.userSystemComponent) && this.userSystemComponent.canDeactivate()
      || this.showCompanyUser && ObjectHelper.isDefined(this.userCompanyComponent) && this.userCompanyComponent.canDeactivate();

  }
}
