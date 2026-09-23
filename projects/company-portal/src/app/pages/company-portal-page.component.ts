import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {UserService} from '../../services/usermanagement/user.service';
import {CompanyCurrentDataService} from '../../services/company-current-data.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ErrorService} from "../../../../common/src/lib/utils/errorhandler/error.service";
import {TermService} from "../../../../common/src/lib/services/eula/term.service";
import {CompanyPageMenuService} from "../../services/company-page-menu.service";
import {SidebarToggleService} from "../../services/sidebar-toggle.service";
import {BasePortalPageComponent} from "../../../../common/src/lib/pages/base-portal-page-component.service";
import {BaseRoutingService, ROUTING_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-routing.service";
import {BasePageMenuService, MENU_SERVICE_TOKEN} from "../../../../common/src/lib/utils/base-page-menu.service";
import {HtmlSanitizerService} from "../../../../common/src/lib/utils/html-sanitizer.service";

@Component({
  standalone: false,
  selector: 'app-company-portal-page',
  templateUrl: './company-portal-page.component.html',
  styleUrls: ['./company-portal-page.component.scss']
})
export class CompanyPortalPageComponent extends BasePortalPageComponent {

  constructor(@Inject(MENU_SERVICE_TOKEN) protected pageMenuService: BasePageMenuService,
              protected currentDataService: CompanyCurrentDataService,
              protected termService: TermService,
              protected userService: UserService,
              protected modalService: NgbModal,
              @Inject(ROUTING_SERVICE_TOKEN) protected routingService: BaseRoutingService,
              protected themeService: NbThemeService,
              protected htmlSanitizer: HtmlSanitizerService,
              protected errorService: ErrorService,
              protected sidebarToggleService: SidebarToggleService,
              protected cd: ChangeDetectorRef) {
    super(pageMenuService, currentDataService, termService, modalService, routingService, themeService, htmlSanitizer, errorService, cd);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(
      this.sidebarToggleService.toggle$.subscribe(() => this.toggleSidebar())
    );
  }

  get logoUrl() {
    return this.currentDataService.getCurrentUser()
    && this.currentDataService.getCurrentUser().currentRole ?
      this.currentDataService.getCurrentUser().currentRole.entity.logoUrl : null;
  }
}
