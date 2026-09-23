import {Inject, Injectable} from "@angular/core";
import {CanActivate, CanActivateChild} from "@angular/router";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class CompanyPortalSettingsGuard implements CanActivate, CanActivateChild {
  constructor(@Inject(SETTINGS_PROVIDER_TOKEN) private settingsProvider: BaseSettingsProvider) {
  }

  canActivate(): Observable<boolean> {
    return this.settingsProvider.loadConfigs().pipe(
      map(() => true),
      catchError((err) => {
        console.error('[CompanyPortalSettingsGuard] Failed to load configs', err);
        return of(false);
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
