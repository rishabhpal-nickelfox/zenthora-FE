import {ApplicationRef, Inject, Injectable, NgZone} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {LoginModalComponent} from '../app/modal/login/login-modal.component';
import {CompanyCurrentDataService} from './company-current-data.service';
import {AuthenticationService} from './authentication.service';
import {BaseInactivityService} from "../../../common/src/lib/utils/base-inactivity.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class CompanyUserInactivityService extends BaseInactivityService {

  constructor(protected currentDataService: CompanyCurrentDataService, protected authService: AuthenticationService, protected modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected ngZone: NgZone,
              protected ref: ApplicationRef,
              @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(modalService, routingService, ngZone, ref, settingsProvider);
  }


  get inactivityTime() {
    return this.currentDataService.inactivityTime;
  }

  set inactivityTime(time: number) {
    this.currentDataService.inactivityTime = time;
  }

  private _loginModal: NgbModalRef;

  get loginModal(): NgbModalRef {
    return this._loginModal;
  }

  set loginModal(modal: NgbModalRef) {
    this._loginModal = modal;
  }

  protected pathCheckCondition(): boolean {
    return this.authService.isLoggedIn() && !this.routingService.isLoginPageOpened;
  }

  protected createLoginModal(){
    this.loginModal = this.modalService.open(LoginModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'not-blurred'
    });
    this.loginModal.componentInstance.role = this.getLastRole();
    this.loginModal.result.then(() => this.loginModal = null, reason => {
      this.loginModal = null;
      if (reason === LoginModalComponent.ATTEMPTS_EXCEEDED) {
        this.ngZone.run(() => this.routingService.navigateLoginPageAndBroadcast());
      }
    });
  }

  protected logout(){
    this.authService.logout();
  }

  protected getLastRole(): { id: number; name: string; } {
    const currentUser = this.currentDataService.getCurrentUser();
    if (currentUser && currentUser.currentRole) {
      this.currentDataService.setInactivityRole(currentUser.currentRole);
      return currentUser.currentRole;
    }
    return this.currentDataService.getInactivityRoleFromStorage();

  }

}
