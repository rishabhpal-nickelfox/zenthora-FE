import {ApplicationRef, Inject, Injectable, NgZone} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {BaseInactivityService} from "../../../common/src/lib/utils/base-inactivity.service";
import {CustomerAuthenticationService} from "./customer-authentication.service";
import {
  CustomerPreFilledLoginModal,
  CustomerPreFilledLoginModel
} from "../app/modal/login/prefilled/customer-pre-filled-login-modal.component";
import {ROUTING_SERVICE_TOKEN} from "../../../common/src/lib/utils/base-routing.service";
import {CustomerRoutingService} from "./customer-routing.service";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";
import {CustomerCurrentDataService} from "./customer-current-data.service";
import {isDefined} from "../../../common/src/lib/helpers/object.helper";

@Injectable()
export class CustomerUserInactivityService extends BaseInactivityService {

  constructor(protected authService: CustomerAuthenticationService,
              protected currentDataService: CustomerCurrentDataService,
              protected modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: CustomerRoutingService,
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
    return this.authService.isLoggedIn()
      && !this.routingService.isLoginPageOpened
      && !this.routingService.isPathOpened(this.routingService.paymentFormPagePath);
  }

  protected createLoginModal() {
    const currentCustomer = this.currentDataService.currentCustomer;
    const companyId = currentCustomer?.companyRole?.customerId;
    this.loginModal = this.modalService.open(CustomerPreFilledLoginModal, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'not-blurred'
    });
    this.loginModal.componentInstance.reInit(new CustomerPreFilledLoginModel(currentCustomer?.email));
    this.loginModal.result.then(() => {
      this.loginModal = null;
      this.selectPreviousCompany(companyId);
    }, () => {
      this.loginModal = null;
      if (this.routingService.isPortalPageOpened) {
        this.ngZone.run(() => this.routingService.navigateLoginPageAndBroadcast());
      }
    });
  }

  private selectPreviousCompany(companyId: number) {
    if (!isDefined(companyId)) {
      return;
    }
    this.ngZone.run(() => this.authService.selectCompany(companyId).subscribe());
  }

  protected logout() {
    this.authService.logout();
  }


}
