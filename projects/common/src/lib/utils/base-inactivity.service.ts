import {ApplicationRef, Inject, NgZone} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SimpleModalComponent} from '../modals/simple/simple-modal.component';
import {timer} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "./base-routing.service";
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "./base-settings-provider.service";

export abstract class BaseInactivityService {

  private windowEvents = ['mousemove', 'keydown', 'scroll'];
  private inactivityAlert;
  private inactivityAlertTimer;
  private inactivityAlertTimerSubscription;
  private isTimeout;

  protected constructor(protected modalService: NgbModal,
                        @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
                        protected ngZone: NgZone,
                        protected ref: ApplicationRef,
                        @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    this.addEventListeners();
  }

  abstract get loginModal();

  abstract set loginModal(modal: NgbModalRef);

  abstract get inactivityTime();

  abstract set inactivityTime(time: number);

  init() {
    this.resetInactivityObservableState();
    this.ngZone.runOutsideAngular(() => {
      timer(0, 1000).subscribe(() => {
        this.check();
      });
    });
  }

  protected abstract pathCheckCondition(): boolean;

  protected abstract createLoginModal();

  protected abstract logout();

  protected onInactivityAlertTimeout() {
    this.createLoginModal();
    this.logout();
  }

  private addEventListeners() {
    this.windowEvents.forEach(event => {
      window.addEventListener(event, (e) => {
        this.resetInactivityObservableState();
      });
    });
  }

  private check() {
    const now = Date.now();
    const timeLeft = this.inactivityTime + this.settingsProvider.inactivityTimeoutSeconds * 1000;
    this.isTimeout = timeLeft - now < 0;
    if (this.isTimeout && !this.isInactivityModalOpened() &&
      this.pathCheckCondition()) {
      this.onInactivityTimeout();
    }
  }

  private isInactivityModalOpened(): boolean {
    return this.inactivityAlert || this.loginModal;
  }

  private onInactivityTimeout() {
    (document.activeElement as HTMLElement)?.blur();
    this.inactivityAlert = this.openDialog();
    this.inactivityAlertTimerSubscription = this.inactivityAlertTimer.subscribe(counter => {

        this.inactivityAlert.componentInstance.body = 'You will be logged out in ' + counter + ' seconds';
        if (!this.isTimeout) {
          this.resetInactivityObservableState();
        }
        if (counter === 0) {
          if (this.inactivityAlert) {
            this.inactivityAlert.close();
          }
          this.onInactivityAlertTimeout();
        }
        this.ref.tick();
      }
    );
  }

  private resetInactivityObservableState() {
    this.inactivityTime = Date.now();
    if (this.inactivityAlert) {
      this.inactivityAlert.close();
      this.inactivityAlert = null;
    }

    this.inactivityAlertTimer = null;
    let counter = this.settingsProvider.inactivityAlertTimeSeconds;
    if (this.inactivityAlertTimerSubscription) {
      this.inactivityAlertTimerSubscription.unsubscribe();
    }

    this.inactivityAlertTimer = timer(0, 1000).pipe(map(() => --counter)).pipe(take(counter));
  }

  private openDialog() {
    const modal = this.modalService.open(SimpleModalComponent);

    modal.componentInstance.header = 'Inactivity detected';
    return modal;
  }

}
