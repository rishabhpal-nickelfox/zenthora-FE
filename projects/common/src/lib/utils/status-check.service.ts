import {Inject, Injectable, NgZone} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {filter, firstValueFrom, timer} from 'rxjs';
import {UnderMaintenanceService} from './under-maintenance.service';
import {SYSTEM_PREFIX} from '../common-environment';
import {isEmptyString, versionCompare} from "../helpers/string.helper";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {isDefined} from "../helpers/object.helper";
import {COMMON_CONFIG, CommonConfig} from "../common-config.token";

@Injectable()
export class StatusCheckService {
  private readonly statusUrl: string;
  private isReloading = false;

  constructor(
    private updates: SwUpdate,
    private ngZone: NgZone,
    private http: HttpClient,
    private cookieService: CookieService,
    private underMaintenanceService: UnderMaintenanceService,
    @Inject(COMMON_CONFIG) private config: CommonConfig
  ) {
    this.statusUrl = StatusCheckService.toAbsoluteUrl(this.config.statusCheckURL);

    if (!this.config.production) {
      console.log('Update check disabled in development mode.');
      return;
    }

    this.initStatusCheck();

    if (updates.isEnabled) {
      this.enableServiceWorkerUpdates();
    }
  }

  private static toAbsoluteUrl(url: string): string {
    if (isEmptyString(url)) {
      return '/status.json';
    }
    if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return '/' + url;
  }

  private enableServiceWorkerUpdates(): void {
    this.ngZone.runOutsideAngular(() => {
      timer(this.config.statusCheckFrequency, this.config.statusCheckFrequency).subscribe(() =>
        this.updates.checkForUpdate().then((hasUpdate) => {
          if (hasUpdate) {
            console.log('New update detected via Service Worker.');
            this.triggerReload('Service Worker');
          } else {
            console.log('No updates found via Service Worker.');
          }
        }).catch((error) => {
          console.error('Error checking for updates via Service Worker:', error);
          console.log('Falling back to status.json update mechanism.');
          this.checkStatusFile().catch((error) => console.error('Error during periodic status check:', error));
        })
      );
    });

    this.updates.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        this.triggerReload('Service Worker');
      });
  }

  private initStatusCheck(): void {
    this.ngZone.runOutsideAngular(() => {
      this.checkStatusFile().catch((error) => console.error('Error during immediate status check:', error));
      timer(this.config.statusCheckFrequency, this.config.statusCheckFrequency).subscribe(() =>
        this.checkStatusFile().catch((error) => console.error('Error during periodic status check:', error))
      );
    });
  }

  private async checkStatusFile(): Promise<void> {
    try {
      const response: {
        version: string;
        uuid: string;
        maintenance_start: string;
        maintenance_end: string;
        status_json_based_reload_enabled: boolean;
      } = await firstValueFrom(
        this.http.get<{
          version: string;
          uuid: string;
          maintenance_start: string;
          maintenance_end: string,
          status_json_based_reload_enabled: boolean
        }>(
          this.statusUrl + '?t=' + new Date().getTime()
        )
      );

      const newVersion = response.version;
      const newUuid = response.uuid;
      const currentVersion = localStorage.getItem(SYSTEM_PREFIX + 'VERSION');
      const currentUuid = localStorage.getItem(SYSTEM_PREFIX + 'UUID');
      const enableStatusJSONBasedReload = response.status_json_based_reload_enabled || false;

      if (newVersion !== currentVersion || newUuid !== currentUuid) {
        console.log(`New version or UUID detected via status.json: Version=${newVersion}, UUID=${newUuid}`);
        this.checkAndDeleteCookies(currentVersion);
        this.setVersionAndUuid(newVersion, newUuid);

        if (!this.updates.isEnabled) {
          if (enableStatusJSONBasedReload) {
            this.triggerReload('status.json');
          } else {
            console.log('Reload disabled via status.json flag.');
          }
        }
      } else if (!currentVersion || !currentUuid) {
        this.setVersionAndUuid(newVersion, newUuid);
        console.log('Version and UUID set in localStorage without reload.');
      } else {
        console.log('Version and UUID didn\'t change');
      }

      this.underMaintenanceService.underMaintenanceValues = {
        maintenanceStart: response.maintenance_start,
        maintenanceEnd: response.maintenance_end
      };

    } catch (error) {
      console.error('Failed to fetch status.json and retrying on next interval:', error);
    }
  }

  private checkAndDeleteCookies(currentVersion?: string | null): void {
    if (!currentVersion) {
      currentVersion = localStorage.getItem(SYSTEM_PREFIX + 'VERSION');
    }
    if (this.needToDeleteCookies(currentVersion)) {
      console.log('Deleting cookies due to version change.');
      this.cookieService.deleteAll('/', window.location.hostname);
      this.cookieService.deleteAll('/pages', window.location.hostname);
    }
  }

  private setVersionAndUuid(newVersion: string, newUuid: string): void {
    localStorage.setItem(SYSTEM_PREFIX + 'VERSION', newVersion);
    localStorage.setItem(SYSTEM_PREFIX + 'UUID', newUuid);
  }

  private needToDeleteCookies(currentVersion: string | null): boolean {
    if (isDefined(currentVersion) && !isEmptyString(currentVersion)) {
      return versionCompare(currentVersion, this.config.cookieChangedVersion) <= 0;
    }
    return true;
  }

  private triggerReload(reason: string): void {
    if (!this.isReloading) {
      console.log(`Reload triggered: ${reason}`);
      this.isReloading = true;
      if (this.updates.isEnabled) {
        this.updates.activateUpdate().then(() => {
          document.location.reload();
        });
      } else {
        document.location.reload();
      }
    } else {
      console.log('Reload already in progress, skipping duplicate reload.');
    }
  }
}
