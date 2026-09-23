import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {CustomerPortalAppModule} from './app/customer-portal-app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(CustomerPortalAppModule)
  .catch(err => console.error(err));
