import {CanDeactivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UnderMaintenanceService} from "../utils/under-maintenance.service";
import {BaseCurrentDataService} from "../utils/base-current-data.service";
import {ComponentCanDeactivate} from "../pages/can-deactivate.component";
import {PendingChangesService} from "../utils/pending-changes.service";

@Injectable()
export abstract class BasePendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(protected currentDataService: BaseCurrentDataService,
              protected underMaintenanceService: UnderMaintenanceService,
              protected pendingChangesService: PendingChangesService) {
  }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    if (this.underMaintenanceService.isUnderMaintenance) {
      return true;
    }
    if (this.pendingChangesService.consumeSkip()) {
      return true;
    }
    return this.currentDataService.isLoggedIn() ? this.pendingChangesService.confirmLeaving(component) : true;
  }

  protected skipNextCheck() {
    this.pendingChangesService.skipNextCheck();
  }
}
