import {ObjectOperatingService} from "../../../common/src/lib/utils/object-operating.service";
import {HttpClient} from "@angular/common/http";
import {CustomerServiceUrl} from "./customer-service-url";
import {Observable} from "rxjs";
import {UserModel} from "../models/user.model";
import {Inject, Injectable} from "@angular/core";
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from "../../../common/src/lib/utils/base-settings-provider.service";

@Injectable()
export class UserService extends ObjectOperatingService {
  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super(http);
  }


  get baseUrl(): string {
    return `${this.settingsProvider.apiUrl}/${CustomerServiceUrl.USER}`;
  }


  create(user: UserModel): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.baseUrl}/invite`,
      JSON.stringify(
        UserModel.toJSON(user)
      )
    );
  }

  getAdditionalInfo(id: number) {
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(user => UserModel.fromJSON(user));
  }

  update(user: UserModel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${user.id}`,
      JSON.stringify(
        UserModel.toJSON(user)
      )
    );
  }

  reinvite(userId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/reinvite`, null);
  }

  revoke(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }

}
