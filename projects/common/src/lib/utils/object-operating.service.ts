import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseWebService} from "../services/base-web.service";
import {getQueryParams} from "../helpers/url.helper";
import moment from "moment/moment";

@Injectable()
export abstract class ObjectOperatingService implements BaseWebService {
  constructor(protected http: HttpClient) {
  }

  abstract get baseUrl(): string;

  getAllWithPaging(page, size, filters: Map<string, string>, sortField?, sortDirection?): Observable<any> {
    const params = new Map<string, string>(filters);
    params.set('page', page);
    params.set('size', size);
    return this.http.get<any>(this.baseUrl, {params: getQueryParams(params, sortField, sortDirection)});
  }

  getTotalCount(requestResult) {
    return requestResult.totalElements;
  }

  abstract getFromResponse(requestResult);

  abstract create(object: any, ...additional: any): Observable<any>;

  abstract update(object: any, ...additional: any): Observable<any>;

  save(object: any, ...additional: any): Observable<any> {
    if (object.id) {
      return this.update(object, ...additional);
    } else {
      return this.create(object, ...additional);
    }
  }

  abstract getAdditionalInfo(id, ...additional);

  export(filters: Map<string, string>, sortField?: string, sortDirection?: string) {
    return this.http.get<any>(`${this.baseUrl}/export?tzOffset=${moment().utcOffset()}&tzName=${moment.tz.guess()}`, {params: getQueryParams(filters, sortField, sortDirection)});
  }
}
