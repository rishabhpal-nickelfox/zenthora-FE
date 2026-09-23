import {Component, Inject, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {SidebarToggleService} from '../../services/sidebar-toggle.service';
import {ErrorService} from '../../../../common/src/lib/utils/errorhandler/error.service';
import {CompanyCurrentDataService} from '../../services/company-current-data.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import * as hermes from '../../../../common/src/assets/hermes/hermes.min.js';
import {HermesEnum} from "../../../../common/src/lib/enums/utils/hermes.enum";
import {finalize, map} from "rxjs/operators";
import {ComponentWithSubscriptions} from "../../../../common/src/lib/components/component-with-subscriptions";
import {CompanyRoutingService} from "../../services/company-routing.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {PendingChangesService} from "../../../../common/src/lib/utils/pending-changes.service";

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent extends ComponentWithSubscriptions implements OnInit, OnDestroy {

  title;
  currentUser;
  changingRole = false;

  @ViewChild('selectRole') roleSelect: NgModel;

  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider,
              private sidebarToggleService: SidebarToggleService,
              private authService: AuthenticationService,
              private currentDataService: CompanyCurrentDataService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              public errorService: ErrorService,
              private pendingChangesService: PendingChangesService,
              private ngZone: NgZone) {
    super();
  }

  ngOnInit() {
    this.title = this.settingsProvider.portalName;
    this.currentUser = this.currentDataService.getCurrentUser();

    hermes.on(HermesEnum.LOGIN, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.LOGOUT, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.CHANGE_PASSWORD, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.CHANGE_ROLE, (data) => {
      this.updateCurrentUser();
      this.ngZone.run(() => this.companyRoutingService.navigateAfterAuth());
    });
    hermes.on(HermesEnum.CHANGE_PASSWORD, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.LOGOUT_AND_REDIRECT, (data) => {
      this.updateCurrentUser();
      this.ngZone.run(() => this.companyRoutingService.navigateLoginPage());
    });
    hermes.on(HermesEnum.SELECT_ROLE, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.UPDATE_CURRENT_ROLE, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.UPDATE_ROLES, (data) => {
      this.updateCurrentUser();
    });
    hermes.on(HermesEnum.COMPANY_ENABLE_DISABLE, (data) => {
      this.ngZone.run(() => this.authService.updateCurrentUserRoles().subscribe());
    });
  }

  toggleSidebar() {
    this.sidebarToggleService.toggle();
    return false;
  }

  get zenthoraLogo() {
    return '/assets/zenthoralogo/logo-white.png';
  }

  showRoleSelect() {
    return this.isLoggedIn() && this.currentUser.currentRole;
  }

  isLoggedIn() {
    return this.currentUser;
  }

  onLogout() {
    this.authService.logout();
    this.companyRoutingService.navigateLoginPageAndBroadcast();
    return false;
  }

  setCurrentRole(roleId) {
    const currentRole = this.currentUser.roles.find(role => {
        return role.id == roleId;
      }
    );

    this.subscriptions.add(
      this.pendingChangesService.confirmLeavingActivePage().subscribe(confirmed => {
        if (confirmed) {
          this.applyCurrentRole(currentRole);
        } else {
          this.resetRoleSelect();
        }
      })
    );
  }

  private resetRoleSelect() {
    this.roleSelect.reset(this.currentUser.currentRole.id);
  }

  private applyCurrentRole(currentRole) {
    this.changingRole = true;

    this.subscriptions.add(
      this.authService.selectRole(currentRole)
        .pipe(finalize(() => {
          this.changingRole = false;
        }))
        .pipe(map(() => {
          this.pendingChangesService.skipNextCheck();
          hermes.send(HermesEnum.CHANGE_ROLE, true, true);
        }))
        .subscribe(() => {
        }, error => {
          this.companyRoutingService.reloadPage();
        })
    );
  }

  get companyRoutingService(): CompanyRoutingService {
    return this.routingService as CompanyRoutingService;
  }

  onShowPersonalInfoPage() {
    this.companyRoutingService.navigateToPersonalInfoPage();
  }

  updateCurrentUser() {
    this.currentUser = this.currentDataService.getCurrentUser();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    hermes.off(HermesEnum.LOGIN);
    hermes.off(HermesEnum.LOGOUT);
    hermes.off(HermesEnum.LOGOUT_AND_REDIRECT);
    hermes.off(HermesEnum.SELECT_ROLE);
    hermes.off(HermesEnum.CHANGE_ROLE);
    hermes.off(HermesEnum.CHANGE_PASSWORD);
    hermes.off(HermesEnum.UPDATE_CURRENT_ROLE);
    hermes.off(HermesEnum.UPDATE_ROLES);
    hermes.off(HermesEnum.COMPANY_ENABLE_DISABLE);
  }
}
