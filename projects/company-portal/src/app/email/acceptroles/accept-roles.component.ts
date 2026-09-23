import {ActivatedRoute} from '@angular/router';
import {Component, Inject, OnInit} from '@angular/core';
import {AlertService} from '../../../../../common/src/lib/utils/alert.service';
import {finalize} from 'rxjs/operators';
import {UserService} from '../../../services/usermanagement/user.service';
import {ErrorService} from "../../../../../common/src/lib/utils/errorhandler/error.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../../common/src/lib/utils/base-routing.service";

@Component({
  standalone: false,
    selector: 'app-accept-roles',
    templateUrl: './accept-roles.component.html'
})
export class AcceptRolesComponent implements OnInit {
    constructor(protected router: ActivatedRoute, @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService, private errorService: ErrorService, private alertService: AlertService,
                private userService: UserService) {

    }

    ngOnInit(): void {
        const token = this.router.snapshot.paramMap.get('token');
        this.userService.acceptRoles(token)
            .pipe(finalize(() => this.routingService.navigateFirstUrl())).subscribe(result => {
            this.alertService.showSuccess('Success', '');
        });

    }
}
