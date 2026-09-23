import {Injectable} from "@angular/core";
import {BasePendingChangesGuard} from "../../../common/src/lib/guards/base-pending-changes-guard.service";
import {UnderMaintenanceService} from "../../../common/src/lib/utils/under-maintenance.service";
import {CustomerCurrentDataService} from "../services/customer-current-data.service";
import * as hermes from "../../../common/src/assets/hermes/hermes.min";
import {HermesEnum} from "../../../common/src/lib/enums/utils/hermes.enum";
import {PendingChangesService} from "../../../common/src/lib/utils/pending-changes.service";

@Injectable()
export class CustomerPendingChangesGuard extends BasePendingChangesGuard {
  constructor(protected currentDataService: CustomerCurrentDataService,
              protected underMaintenanceService: UnderMaintenanceService,
              protected pendingChangesService: PendingChangesService) {
    super(currentDataService, underMaintenanceService, pendingChangesService);

    hermes.on(HermesEnum.CUSTOMER_LOGOUT, (data) => this.skipNextCheck());
    hermes.on(HermesEnum.CUSTOMER_LOGOUT_AND_REDIRECT, (data) => this.skipNextCheck());
    hermes.on(HermesEnum.CUSTOMER_CHANGE_COMPANY, (data) => this.skipNextCheck());
  }
}
