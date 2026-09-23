import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {UiKeyEnum} from '../../../../company-portal/src/enums/usermanagement/ui-key.enum';
import {CustomerPermissionEnum} from '../../../../customer-portal/src/enums/customer-permission.enum';

/**
 * Fake backend so the portals can be explored without the real API.
 * Enabled by `environment.mockBackend`: on in dev (environment.ts) and in the `mock` build configuration
 * (environment.mock.ts, used by `npm run build-*-portal-mock` for demo deploys); off in regular production builds.
 * Any username/password logs in with every permission; data endpoints return empty lists.
 */
// Same origin as the page, so BaseSettingsProvider's root-domain match picks it on any host (localhost, *.vercel.app, ...)
export const MOCK_API_URL = `${window.location.origin}/mock-api`;

const DEMO_ENTITY = {
  id: 1,
  legalName: 'Demo Company',
  vaultCompanyId: 1,
  logoUrl: null,
  customerPortalEnabled: true,
  epsCheckout: false
};

const DEMO_ROLE = {id: 1, name: 'Demo Admin', entity: DEMO_ENTITY, permissions: []};

const COMPANY_PERMISSIONS = Object.values(UiKeyEnum).map(uiKey => ({name: uiKey, uiKey: uiKey, protected: false}));

const CUSTOMER_PERMISSIONS = Object.values(CustomerPermissionEnum);

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (/(company|customer)-config\.json$/.test(request.url)) {
      return next.handle(request).pipe(map(event => event instanceof HttpResponse
        // usePortalPrefix off: the /company-portal/* and /customer-portal/* redirects only exist in server.js, not ng serve
        ? event.clone({body: {...event.body, apiUrls: [MOCK_API_URL], recaptchaEnabled: false, usePortalPrefix: false}})
        : event));
    }

    if (!request.url.startsWith(MOCK_API_URL)) {
      return next.handle(request);
    }

    const path = request.url.substring(MOCK_API_URL.length).split('?')[0];
    console.log(`[MockBackend] ${request.method} ${path}`);
    return of(new HttpResponse({status: 200, body: this.respond(request.method, path)})).pipe(delay(150));
  }

  private respond(method: string, path: string): any {
    switch (path) {
      // Company portal
      case '/auth/login':
        return {mustChangePassword: false};
      case '/users/current/roles':
        return [DEMO_ROLE];
      case '/users/current/roles/current/permissions':
        return COMPANY_PERMISSIONS;
      case '/users/current':
        return {id: 1, username: 'demo@zenthora.local', email: 'demo@zenthora.local', firstName: 'Demo', lastName: 'User', roles: [DEMO_ROLE]};
      case '/roles/current/admin':
        return true;
      case '/entities/current/type':
        return {id: 1, name: 'SYSTEM'};

      // Customer portal
      case '/customer/login':
        return {mustChangePassword: false, customerRoles: [{customerId: 1, name: 'Demo Company', customerPortalEnabled: true}]};
      case '/customer/select-role':
        return {
          permissions: CUSTOMER_PERMISSIONS,
          hasInvoices: true,
          hasSalesOrders: true,
          hasDeposits: true,
          globalPaymentsEnabled: false,
          legalName: 'Demo Company',
          logo: null,
          favicon: null
        };
      case '/customer/current/permissions':
        return {permissions: CUSTOMER_PERMISSIONS};

      case '/status':
        return {};
    }

    return method === 'GET' ? MockBackendInterceptor.emptyList() : {};
  }

  // An empty array that also looks like an empty Spring page, so callers expecting either shape get no data.
  private static emptyList(): any {
    return Object.assign([], {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 10,
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true
    });
  }
}
