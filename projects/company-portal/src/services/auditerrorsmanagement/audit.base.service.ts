import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {convertJSONToAuditRecord} from '../../app/models/usermanagement/audit.model';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {Observable, throwError} from "rxjs";

@Injectable()
export abstract class AuditBaseService extends ObjectOperatingService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  getFromResponse(res: any) {
    const auditRecords = [];
    res.content.forEach(auditRecordResult => {
      auditRecords.push(convertJSONToAuditRecord(auditRecordResult));
    });
    return auditRecords;
  }

  create(object: any): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(object: any): Observable<never> {
    return throwError('Unsupported operation');
  }


  getAdditionalInfo(id): Observable<never> {
    return throwError('Unsupported operation');
  }
}
