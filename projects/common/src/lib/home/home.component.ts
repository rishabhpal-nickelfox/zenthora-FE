import {Component, Inject, OnInit} from '@angular/core';
import {AUTHENTICATION_SERVICE_TOKEN, BaseAuthenticationService} from "../services/base-authentication.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../utils/base-routing.service";

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(@Inject(AUTHENTICATION_SERVICE_TOKEN) protected authService: BaseAuthenticationService,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService) {

  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.routingService.navigateAfterAuth();
    } else {
      this.routingService.navigateLoginPageAndBroadcast();
    }
  }

}
