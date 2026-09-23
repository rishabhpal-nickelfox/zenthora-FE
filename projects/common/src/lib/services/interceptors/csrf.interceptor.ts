import {Inject, Injectable} from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, finalize, shareReplay, switchMap, tap} from 'rxjs/operators';
import {BaseSettingsProvider, SETTINGS_PROVIDER_TOKEN} from "../../utils/base-settings-provider.service";
import {CSRF_TOKEN_ERROR} from "../../enums/error-message.enum";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  private refresh$: Observable<void> = null;
  private csrfToken: string = null;

  private initCsrfToken(): Observable<void> {
    return this.http.get<{ token: string }>(this.baseUrl).pipe(
      tap(resp => {
        if (resp?.token) {
          this.csrfToken = resp.token;
        }
      }),
      switchMap(() => of(void 0))
    );
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/csrf-init`;
  }

  constructor(
    private http: HttpClient,
    @Inject(SETTINGS_PROVIDER_TOKEN) private settingsProvider: BaseSettingsProvider
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith(this.baseUrl)) {
      return next.handle(request);
    }
    if (this.settingsProvider.initialized && request.url.includes(this.settingsProvider.apiUrl)) {
      if (this.isChangingRequest(request.method)) {
        return this.ensureCsrfToken().pipe(
          switchMap(() => this.retryWithCsrf(request, next)),
          catchError((error: HttpErrorResponse) => this.handleError(error, request, next))
        );
      }
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, request, next))
    );
  }

  private ensureCsrfToken(forceRefresh = false): Observable<void> {
    if (this.csrfToken && !forceRefresh) {
      return of(void 0);
    }
    if (this.refresh$) {
      return this.refresh$;
    }
    this.refresh$ = this.initCsrfToken().pipe(
      shareReplay(1),
      finalize(() => {
        this.refresh$ = null;
      })
    );

    return this.refresh$;
  }


  private handleError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (error.status === 403 && error.error?.errorCode === CSRF_TOKEN_ERROR) {
      return this.ensureCsrfToken(true).pipe(
        switchMap(() => this.retryWithCsrf(request, next)),
        catchError((refreshError) => throwError(refreshError))
      );
    }
    return throwError(error);
  }

  private retryWithCsrf(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.csrfToken) {
      request = this.addCsrfToken(request, this.csrfToken);
    }
    return next.handle(request);
  }


  private addCsrfToken(request: HttpRequest<any>, csrfToken: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('X-CSRF-TOKEN-EPS', csrfToken),
      withCredentials: true
    });
  }

  private isChangingRequest(method: string): boolean {
    return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase());
  }
}
