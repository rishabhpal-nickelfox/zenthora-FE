import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../../common/src/lib/utils/base-settings-provider.service";
import {convertJSONToEmailModel, EmailModel} from "../../../../common/src/lib/models/email/email.model";
import {Observable, throwError} from "rxjs";
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class EmailService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.EMAIL}`;
  }

  getFromResponse(requestResult) {
    const emails = [];
    requestResult.content.forEach(emailResult => {
      emails.push(convertJSONToEmailModel(emailResult));
    });
    return emails;
  }

  create(emailModel: EmailModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  update(emailModel: EmailModel): Observable<never> {
    return throwError('Unsupported operation');
  }

  getAdditionalInfo(id): Observable<never> {
    return throwError('Unsupported operation');
  }
}
