import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {CompanyPortalAppModule} from './app/company-portal-app.module';
import {environment} from "../../../environments/environment";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(CompanyPortalAppModule)
  .catch(err => console.error(err));
