import {Injectable} from "@angular/core";
import {BasePendingChangesGuard} from "../../../common/src/lib/guards/base-pending-changes-guard.service";
import {UnderMaintenanceService} from "../../../common/src/lib/utils/under-maintenance.service";
import {CompanyCurrentDataService} from "../services/company-current-data.service";
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import * as hermes from '../../../common/src/assets/hermes/hermes.min.js';
import {PendingChangesService} from "../../../common/src/lib/utils/pending-changes.service";

@Injectable()
export class CompanyPendingChangesGuard extends BasePendingChangesGuard {
  constructor(protected currentDataService: CompanyCurrentDataService,
              protected underMaintenanceService: UnderMaintenanceService,
              protected pendingChangesService: PendingChangesService) {
    super(currentDataService, underMaintenanceService, pendingChangesService)

    hermes.on(HermesEnum.LOGOUT, (data) => this.skipNextCheck());
    hermes.on(HermesEnum.LOGOUT_AND_REDIRECT, (data) => this.skipNextCheck());
    hermes.on(HermesEnum.SELECT_ROLE, (data) => this.skipNextCheck());
  }
}
