import {Injectable, NgZone} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {filter, timer} from 'rxjs';

@Injectable()
export class CheckForUpdateService {

  constructor(public updates: SwUpdate, private ngZone: NgZone) {
    if (updates.isEnabled) {
      this.ngZone.runOutsideAngular(() => {
        timer(30000, 30000).subscribe(() => updates.checkForUpdate().then(() => console.log('checking for updates')));
      });
    }
  }

  public checkForUpdates(): void {
    this.updates.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        this.promptUser();
      });
  }

  private promptUser(): void {
    console.log('updating to new version');
    this.updates.activateUpdate().then(() => {
      document.location.reload();
    });
  }
}
