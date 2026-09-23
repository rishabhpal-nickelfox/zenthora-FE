import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class ContentTypeInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
