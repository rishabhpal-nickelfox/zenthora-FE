import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ObjectOperatingService} from '../../../../common/src/lib/utils/object-operating.service';
import {UserModel} from '../../app/models/usermanagement/user.model';
import {of} from 'rxjs';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../../common/src/lib/utils/base-settings-provider.service';
import {map} from "rxjs/operators";
import {
  EmailChangePasswordRequestModel
} from "../../../../common/src/lib/models/password/email-change-password-request.model";
import {UIKeyService} from "../ui-key.service";
import {
  UserCompanyAdminCreateRequest,
  UserCompanyAdminUpdateRequest,
  UserSystemAdminCreateRequest,
  UserSystemAdminUpdateRequest
} from "../../app/models/usermanagement/user-request.model";
import {RecaptchaService} from "../../../../common/src/lib/utils/recaptcha.service";
import {RecaptchaActionEnum} from "../../../../common/src/lib/enums/utils/recaptcha-action.enum";
import {isDefined} from '../../../../common/src/lib/helpers/object.helper';
import {CompanyServiceUrl} from "../company-service-url";

@Injectable()
export class UserService extends ObjectOperatingService {

  constructor(protected http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider, private uiKeyService: UIKeyService) {
    super(http);
  }

  get baseUrl() {
    return `${this.settingsProvider.apiUrl}/${CompanyServiceUrl.USER}`;
  }

  getFromResponse(requestResult) {
    return requestResult.content.map(userResult => UserModel.fromJSON(userResult));
  }


  create(user: UserModel) {
    if (this.uiKeyService.isSystemUserAdmin()) {
      return this.createBySystemAdmin(user);
    } else {
      return this.createByCompanyAdmin(user);
    }
  }

  update(user: UserModel, resetPassword: boolean, mustChangePassword: boolean) {
    if (this.uiKeyService.isSystemUserAdmin()) {
      return this.updateBySystemAdmin(user, resetPassword, mustChangePassword);
    } else {
      return this.updateByCompanyAdmin(user);
    }
  }

  enable(userId) {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/enable`, null);
  }

  disable(userId) {
    return this.http.patch<any>(`${this.baseUrl}/${userId}/disable`, null);
  }

  getCandidates(email, page) {
    return this.http.get<any>(this.baseUrl + '/' + 'candidates',
      {params: new HttpParams().set('size', String(5)).set('page', String(page)).set('email', email)});
  }


  getAdditionalInfo(id) {
    return isDefined(id) ? this.http.get<any>(`${this.baseUrl}/${id}`).pipe(map(requestResults =>
      UserModel.fromJSON(requestResults))) : of(new UserModel());
  }


  createBySystemAdmin(user: UserModel) {
    return this.http.post<any>(this.baseUrl,
      JSON.stringify(
        UserSystemAdminCreateRequest.toJSON(user)
      )
    );
  }

  updateBySystemAdmin(user: UserModel, resetPassword: boolean, mustChangePassword: boolean) {
    return this.http.put<any>(`${this.baseUrl}/${user.id}`,
      JSON.stringify(
        UserSystemAdminUpdateRequest.toJSON(user, resetPassword, mustChangePassword)
      )
    );
  }


  createByCompanyAdmin(user: UserModel) {
    return this.http.post<any>(this.baseUrl,
      JSON.stringify(
        UserCompanyAdminCreateRequest.toJSON(user)
      )
    );
  }

  updateByCompanyAdmin(user: UserModel) {
    return this.http.put<any>(`${this.baseUrl}/${user.id}/roles`,
      JSON.stringify(UserCompanyAdminUpdateRequest.toJSON(user))
    );
  }

  sendInvitation(user) {
    return this.http.post<any>(`${this.baseUrl}/${user.username}/invite`,
      user.roles.map(role => role.id)
    );
  }

  resendInvitation(user) {
    return this.http.post<any>(`${this.baseUrl}/${user.username}/reinvite`, null);
  }

  acceptRoles(token: string) {
    return this.http.get<any>(`${this.settingsProvider.apiUrl}/${CompanyServiceUrl.ACCEPT_ROLES}/${token}`);
  }

  changePassword(token: string, model: EmailChangePasswordRequestModel, recaptchaToken?: string) {
    let headers = new HttpHeaders();
    if (this.settingsProvider.isRecaptchaEnabled()) {
      headers = headers.set(RecaptchaService.RECAPTCHA_ACTION_HEADER, RecaptchaActionEnum.CHANGE_PASSWORD);
      headers = headers.set(RecaptchaService.RECAPTCHA_TOKEN_HEADER, recaptchaToken);
    }
    return this.http.post<any>(`${this.baseUrl}/change-password/${token}`, JSON.stringify(model), {headers: headers});
  }
}
