import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserModel} from '../app/models/usermanagement/user.model';
import {convertJSONToRole} from '../app/models/usermanagement/role.model';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {EntityTypeModel} from '../app/models/companymanage/entity-type.model';
import {
  BaseSettingsProvider,
  SETTINGS_PROVIDER_TOKEN
} from '../../../common/src/lib/utils/base-settings-provider.service';
import * as hermes from '../../../common/src/assets/hermes/hermes.min';
import {CurrentUserUpdateRequest} from '../app/models/usermanagement/user-request.model';
import {CurrentUserModel} from '../app/models/usermanagement/current.model';
import {HermesEnum} from '../../../common/src/lib/enums/utils/hermes.enum';
import {isDefined} from "../../../common/src/lib/helpers/object.helper";
import {BaseCurrentDataService} from "../../../common/src/lib/utils/base-current-data.service";
import {SYSTEM_PREFIX} from "../../../../environments/environment";

@Injectable()
export class CompanyCurrentDataService extends BaseCurrentDataService{

  static CURRENT_USER = 'currentUser';
  static INACTIVITY_TIME = 'inactivityTime';
  static INACTIVITY_ROLE = 'inactivityRole';


  constructor(private http: HttpClient, @Inject(SETTINGS_PROVIDER_TOKEN) protected settingsProvider: BaseSettingsProvider) {
    super();
  }

  get inactivityTime() {
    return parseInt(localStorage.getItem(CompanyCurrentDataService.INACTIVITY_TIME));
  }

  set inactivityTime(value) {
    localStorage.setItem(CompanyCurrentDataService.INACTIVITY_TIME, String(value));
  }

  get attempts(): number {
    const att = localStorage.getItem('ATTEMPTS');
    return isDefined(att) ? parseInt(att) : null;
  }

  set attempts(att) {
    localStorage.setItem('ATTEMPTS', String(att));
  }

  getCurrentUser(): CurrentUserModel {
    return JSON.parse(localStorage.getItem(CompanyCurrentDataService.CURRENT_USER));
  }

  changePassword(user: CurrentUserModel) {
    this.updateCurrentUserInStorage(user);
    hermes.send(HermesEnum.CHANGE_PASSWORD, true, true);
  }

  selectRole(user: CurrentUserModel) {
    this.updateCurrentUserInStorage(user);
    hermes.send(HermesEnum.SELECT_ROLE, true, true);
  }

  updateCurrentRole(user: CurrentUserModel) {
    this.updateCurrentUserInStorage(user);
    hermes.send(HermesEnum.UPDATE_CURRENT_ROLE, true, true);
  }


  updateRoles(user: CurrentUserModel) {
    this.updateCurrentUserInStorage(user);
    hermes.send(HermesEnum.UPDATE_ROLES, true, true);
  }


  private updateCurrentUserInStorage(user: CurrentUserModel) {
    localStorage.setItem(CompanyCurrentDataService.CURRENT_USER, JSON.stringify(user));
  }

  login(user: CurrentUserModel) {
    this.updateCurrentUserInStorage(user);
    this.removeInactivityRoleFromStorage();
    hermes.send(HermesEnum.LOGIN, true, true);
  }

  logout() {
    localStorage.removeItem(CompanyCurrentDataService.CURRENT_USER);
    hermes.send(HermesEnum.LOGOUT, false, true);
    this.removeAttemptsFromStorage();
  }

  getInactivityRoleFromStorage() {
    return JSON.parse(localStorage.getItem(CompanyCurrentDataService.INACTIVITY_ROLE));
  }

  removeInactivityRoleFromStorage() {
    localStorage.removeItem(CompanyCurrentDataService.INACTIVITY_ROLE);
  }

  setInactivityRole(role) {
    localStorage.setItem(CompanyCurrentDataService.INACTIVITY_ROLE, JSON.stringify(role));
  }

  changePasswordForCurrentUser(oldPassword, newPassword) {
    return this.http.post<any>(this.settingsProvider.apiUrl + '/users/current/change-password',
      {password: oldPassword, newPassword: newPassword});
  }

  getAdditionalInfoForCurrentUser() {
    return this.http.get<any>(this.settingsProvider.apiUrl + '/users/current').pipe(map(requestResults =>
      UserModel.fromJSON(requestResults)));
  }

  updateCurrentUser(user) {
    return this.http.put<any>(this.settingsProvider.apiUrl + '/users/current',
      CurrentUserUpdateRequest.toJSON(user)
    );
  }

  getRolesForCurrentUser() {
    return this.http.get<any>(this.settingsProvider.apiUrl + '/users/current/roles', {withCredentials: true});
  }

  getCurrentRolePermissions() {
    return this.http.get<any>(this.settingsProvider.apiUrl + '/users/current/roles/current/permissions');
  }

  getRolesWithPermissionsForCurrentEntity() {
    return this.http.get<any>(this.settingsProvider.apiUrl + '/entities/current/roles').pipe(
      map(requestResults => {
        const rolesByEntity = [];
        requestResults.forEach(requestResult => {
          rolesByEntity.push(Object.assign(convertJSONToRole(requestResult), {entity: this.getCurrentUser().currentRole.entity}));
        });
        return rolesByEntity;
      }));
  }

  updateCurrentUserRoles() {
    const currentUser = this.getCurrentUser();
    const syncArray = [];
    syncArray.push(this.getRolesForCurrentUser().pipe(map(roles => {
      currentUser.roles = roles;
    })));
    return forkJoin(syncArray).pipe(map(r => {
      this.updateRoles(currentUser);
    }));
  }

  currentRoleIsAdmin() {
    return this.http.get<any>(this.settingsProvider.apiUrl + '/roles/current/admin');
  }

  getCurrentEntityType(): Observable<EntityTypeModel> {
    return this.http.get<any>(this.settingsProvider.apiUrl + '/entities/current/type').pipe(map(resp => new EntityTypeModel(resp['id'], resp['name'])));
  }

  getCurrentEntity() {
    return this.getCurrentUser() && this.getCurrentUser().currentRole ?
      this.getCurrentUser().currentRole.entity : null;
  }

  removeAttemptsFromStorage() {
    localStorage.removeItem('ATTEMPTS');
  }

  get prefix(): string {
    return SYSTEM_PREFIX + this.getCurrentUser().email + '_' + this.getCurrentUser().currentRole.id;
  }

  isLoggedIn(): boolean {
    return null !== this.getCurrentUser();
  }
}
