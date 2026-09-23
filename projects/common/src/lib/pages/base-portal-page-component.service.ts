import {ChangeDetectorRef, inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ErrorService} from "../utils/errorhandler/error.service";
import {TermService} from "../services/eula/term.service";
import {finalize} from "rxjs/operators";
import {SafeHtml} from "@angular/platform-browser";
import {HtmlContentModalComponent} from "../modals/htmlcontent/html-content-modal.component";
import {ComponentWithSubscriptions} from "../components/component-with-subscriptions";
import {BasePageMenuService} from "../utils/base-page-menu.service";
import {BaseCurrentDataService} from "../utils/base-current-data.service";
import {BaseRoutingService} from "../utils/base-routing.service";
import {HtmlSanitizerService} from "../utils/html-sanitizer.service";
import {PendingChangesService} from "../utils/pending-changes.service";

@Injectable()
export abstract class BasePortalPageComponent extends ComponentWithSubscriptions implements OnInit, OnDestroy {


  sidebarHidden = false;

  eulaLoading = false;

  protected pendingChangesService = inject(PendingChangesService);

  constructor(protected pageMenuService: BasePageMenuService,
              protected currentDataService: BaseCurrentDataService,
              protected termService: TermService,
              protected modalService: NgbModal,
              protected routingService: BaseRoutingService,
              protected themeService: NbThemeService,
              protected htmlSanitizer: HtmlSanitizerService,
              protected errorService: ErrorService,
              protected cd: ChangeDetectorRef) {
    super();
  }

  get zenthoraLogo() {
    return '/assets/zenthoralogo/logo.png';
  }

  get triangleLogo() {
    return '/assets/zenthoralogo/triangles.png';
  }

  get menu() {
    return this.pageMenuService.menu;
  }

  get currentTheme() {
    return this.currentDataService.currentTheme;
  }

  setActivePage(component) {
    this.pendingChangesService.setActivePage(component);
  }

  ngOnInit() {
    this.reInitMenu();
    this.themeService.changeTheme(this.currentTheme);
    this.errorService.alertService.toastrConfig = this.errorService.alertService.defaultToastrConfig;
    this.subscriptions.add(
      this.pageMenuService.menuChanged.subscribe(() => this.cd.detectChanges())
    );

  }

  public reInitMenu() {
    this.pageMenuService.reInit();
  }

  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden;
    return false;
  }

  changeTheme(value) {
    this.currentDataService.currentTheme = value;
    this.themeService.changeTheme(value);
  }

  onEula() {
    this.eulaLoading = true;
    this.subscriptions.add(
      this.termService.getEULA().pipe(finalize(() => {
        this.eulaLoading = false;
        this.cd.detectChanges();
      })).subscribe(eulaBase64 => {
        const eulaHTML = this.htmlSanitizer.sanitizeToSafeHtml(atob(eulaBase64));
        this.openEula(eulaHTML);
      })
    )
  }

  private openEula(eulaHTML: SafeHtml) {
    const modalRef = this.modalService.open(HtmlContentModalComponent, {
      backdrop: 'static',
      size: "xl",
      scrollable: true
    });
    modalRef.componentInstance.header = 'License Agreement';
    modalRef.componentInstance.innerHtml = eulaHTML;
    modalRef.result.then(() => {
    }, reason => {
    });
  }
}
