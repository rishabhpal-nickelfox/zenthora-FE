import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Provider} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {MockBackendInterceptor} from './mock-backend.interceptor';

// Swapped for mock-backend.providers.prod.ts in the `production` build configuration so the mock is not bundled there.
export const MOCK_BACKEND_PROVIDERS: Provider[] = environment.mockBackend
  ? [{provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true}]
  : [];
