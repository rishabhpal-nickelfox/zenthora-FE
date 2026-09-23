import {Inject, Injectable, NgZone} from '@angular/core';
import * as moment from 'moment-timezone';
import {Moment} from 'moment';
import {timer} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {SYSTEM_PREFIX} from '../common-environment';
import {isEmptyString} from "../helpers/string.helper";
import {formatDate, SDFT} from "../helpers/date.helper";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "./base-routing.service";

@Injectable()
export class UnderMaintenanceService {
    private static readonly _MAINTENANCE_START = 'MAINTENANCE_START';
    private static readonly _MAINTENANCE_END = 'MAINTENANCE_END';
    private static readonly _IS_UNDER_MAINTENANCE = 'IS_UNDER_MAINTENANCE';

    constructor(@Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, private ngZone: NgZone, private toastrService: ToastrService) {
    }

    static get MAINTENANCE_END(): string {
        return SYSTEM_PREFIX + UnderMaintenanceService._MAINTENANCE_END;
    }

    static get MAINTENANCE_START(): string {
        return SYSTEM_PREFIX + UnderMaintenanceService._MAINTENANCE_START;
    }

    static get IS_UNDER_MAINTENANCE(): string {
        return SYSTEM_PREFIX + UnderMaintenanceService._IS_UNDER_MAINTENANCE;
    }

    set underMaintenanceValues(underMaintenanceValues: { maintenanceStart: string, maintenanceEnd: string }) {
        if (this.maintenanceStartString != underMaintenanceValues.maintenanceStart) {
            if (!isEmptyString(underMaintenanceValues.maintenanceStart)) {
                localStorage.setItem(UnderMaintenanceService.MAINTENANCE_START, underMaintenanceValues.maintenanceStart);
                this.toastrService.warning(`A system maintenance is planned for ${formatDate(this.maintenanceStart, SDFT)}. Please save your work.`, 'Maintenance', {
                    tapToDismiss: true,
                    disableTimeOut: true
                });
            } else {
                localStorage.removeItem(UnderMaintenanceService.MAINTENANCE_START);
            }
        }
        if (this.maintenanceEndString != underMaintenanceValues.maintenanceEnd) {
            if (!isEmptyString(underMaintenanceValues.maintenanceEnd)) {
                localStorage.setItem(UnderMaintenanceService.MAINTENANCE_END, underMaintenanceValues.maintenanceEnd);
            } else {
                localStorage.removeItem(UnderMaintenanceService.MAINTENANCE_END);
            }
        }
    }

    get maintenanceEnd(): Moment {
        if (!isEmptyString(this.maintenanceEndString)) {
            return moment(this.maintenanceEndString);
        }
        return null;
    }

    get maintenanceStart(): Moment {
        if (!isEmptyString(this.maintenanceStartString)) {
            return moment(this.maintenanceStartString);
        }
        return null;
    }

    get isUnderMaintenance(): boolean {
        return localStorage.getItem(UnderMaintenanceService.IS_UNDER_MAINTENANCE) == 'true';
    }

    private set isUnderMaintenance(isUnderMaintenance: boolean) {
        localStorage.setItem(UnderMaintenanceService.IS_UNDER_MAINTENANCE, String(isUnderMaintenance));
    }

    private get isMaintenanceStarted(): boolean {
        return !isEmptyString(this.maintenanceStartString) && moment().isSameOrAfter(this.maintenanceStart);
    }

    private get maintenanceEndString() {
        return localStorage.getItem(UnderMaintenanceService.MAINTENANCE_END);
    }

    private get maintenanceStartString() {
        return localStorage.getItem(UnderMaintenanceService.MAINTENANCE_START);
    }

    init() {
        this.ngZone.runOutsideAngular(() => {
            timer(0, 1000).subscribe(() => {
                this.check();
            });
        });
    }

    private check() {
        if (this.isUnderMaintenance != this.isMaintenanceStarted) {
            this.isUnderMaintenance = this.isMaintenanceStarted;
            this.routingService.navigateOnUnderMaintenance();
        }
    }
}
