import {EventEmitter, Inject, Injectable, InjectionToken, Output} from '@angular/core';
import {Route, Router} from '@angular/router';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "./base-settings-provider.service";

export const ROUTING_SERVICE_TOKEN = new InjectionToken<BaseRoutingService>(
  'ROUTING_SERVICE_TOKEN'
);

@Injectable()
export abstract class BaseRoutingService {

  @Output() refreshAfterNavigate: EventEmitter<string> = new EventEmitter();

  constructor(protected router: Router, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    this.router.onSameUrlNavigation = 'reload';
  }

  abstract get homePagePath();


  get currentUrl() {
    return this.router.url;
  }

  abstract get loginPagePath();

  get baseUrl(): string {
    return `${this.settingsProvider.baseUrl}`;
  }

  abstract navigateAfterAuth();

  abstract navigateFirstUrl();

  abstract navigateAfterUpdatingCurrentRole();

  abstract navigateLoginPageAndBroadcast();

  abstract navigateLoginPage();

  abstract navigateToPersonalInfoPage();

  getRouter() {
    return this.router;
  }

  reloadPage() {
    this.navigateWithoutRouteReuse('/');
  }

  navigateWithoutRouteReuse(url: string) {
    const reuseRouteStrategy = this.router.routeReuseStrategy.shouldReuseRoute;
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigate([url]).finally(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = reuseRouteStrategy;
    });
  }

  getCurrentUrl() {
    return this.router.url;
  }

  clearRoutingQueryParams() {
    this.getRouter().navigate([this.router.url.split('?')[0]], {queryParams: {}});
  }

  path(url: string): string {
    const prefix = this.usePrefix ? `/${this.baseUrl}` : '';
    return `${prefix}/${url}`;
  }

  get usePrefix(): boolean {
    return this.settingsProvider.usePortalPrefix;
  }

  get isLoginPageOpened(): boolean {
    return this.isPathOpened(this.loginPagePath);
  }

  isPathOpened(path: string): boolean {
    const currentPath = this.withoutPortalPrefix(this.currentUrl.split('?')[0]);
    const targetPath = this.withoutPortalPrefix(path);
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  }

  protected withoutPortalPrefix(url: string): string {
    const prefix = `/${this.baseUrl}`;
    const path = url.startsWith(prefix) ? url.substring(prefix.length) : url;
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  }

  private getModuleRoutes(): Route[] {
    return (this.router.config.find(routeConfig =>
      routeConfig.path === 'first-module'
    ) as any)._loadedRoutes;
  }

  navigateOnUnderMaintenance() {
    this.navigateLoginPageAndBroadcast();
    if (this.getCurrentUrl() == this.homePagePath || this.getCurrentUrl() == this.loginPagePath) {
      location.reload();
    }
  }

}
