import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as moment from 'moment-timezone';
import {ComponentWithSubscriptions} from "../../components/component-with-subscriptions";
import {UnderMaintenanceService} from "../../utils/under-maintenance.service";
import {formatDate} from "../../helpers/date.helper";


@Component({
  standalone: false,
    selector: 'app-under-maintenance',
    templateUrl: './under-maintenance.component.html',
    styleUrls: ['../common-auth.component.scss', './under-maintenance.component.scss']
})

export class UnderMaintenanceComponent extends ComponentWithSubscriptions implements OnInit {

    constructor(private underMaintenanceService: UnderMaintenanceService,
                protected elementRef: ElementRef, private _fb: FormBuilder) {
        super();
    }

    get maintenanceEndFormatted() {
        return this.underMaintenanceService.maintenanceEnd ? formatDate(this.underMaintenanceService.maintenanceEnd, 'MMMM D, YYYY, h:mm A') : null;
    }

    get timezone(): string {
        return moment.tz.guess();
    }

    ngOnInit(): void {

    }

}
